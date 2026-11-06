#!/usr/bin/env python3
"""Tao Dokploy project/compose/domain cho Di Choi Online (live-first, hotfix).
- Tao project "Di Choi Online LIVE", compose "di-choi-online" (raw, node:22-alpine
  + vong lap doi code nhu Di Lam), domain dichoi.bla.io.vn port 4187 https:true.
- Sinh PANEL_KEY moi trong tien trinh, set qua compose.update (compose.create
  bo qua env). In PANEL_KEY 1 lan o cuoi de bao cao cho chu kenh; KHONG ghi
  mat khau vao file nao (chi in ra stdout cua lan chay nay).
- Luu IDs (khong co mat khau) vao /tmp/dichoi-dokploy-ids.json.
"""
import json, secrets, subprocess, sys
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import dynamic_credential_entry

BASE = "https://bla.io.vn"
PANEL_KEY = "DiChoi-" + secrets.token_urlsafe(12)

COMPOSE_FILE = """services:
  app:
    image: node:22-alpine
    working_dir: /app
    environment:
      PORT: "4187"
      NODE_ENV: "production"
      PANEL_KEY: "${PANEL_KEY}"
    volumes:
      - di-choi-online-data:/app/data
    command: >
      sh -c "mkdir -p /app/src/game /app/src/live /app/data; apk add --no-cache python3 make g++ >/dev/null 2>&1; while true; do if [ -f /app/server.ts ] && [ ! -f /app/node_modules/.install-done ]; then cd /app && rm -rf node_modules && npm install --no-audit --no-fund && touch node_modules/.install-done; fi; if [ -f /app/server.ts ] && [ -f /app/node_modules/.install-done ]; then cd /app && npm run build && npx tsx server.ts; fi; sleep 5; done"
    restart: unless-stopped

volumes:
  di-choi-online-data:
"""

def api(procedure, method="GET", data=None, query=None, timeout=120):
    key = str(dynamic_credential_entry("custom.dokploy", "access_token")["surrogate"]).strip()
    url = f"{BASE}/api/{procedure}"
    if query:
        url += "?" + query
    cmd = ["curl", "-s", "-m", str(timeout), "-X", method, "-H", f"x-api-key: {key}",
           "-H", "Content-Type: application/json", "-H", "Accept: application/json",
           "-w", "\n%{http_code}"]
    if data is not None:
        cmd += ["-d", json.dumps(data)]
    cmd.append(url)
    r = subprocess.run(cmd, capture_output=True, text=True)
    out = r.stdout.strip()
    lines = out.rsplit("\n", 1)
    try:
        status = int(lines[-1]); body = lines[0] if len(lines) > 1 else ""
    except ValueError:
        return {"status": r.returncode, "text": out}
    try:
        return {"status": status, "json": json.loads(body) if body else None}
    except json.JSONDecodeError:
        return {"status": status, "text": body}

def must_ok(step, r):
    print(f"[{step}] status={r['status']}")
    if r["status"] not in (200, 201) or not r.get("json"):
        print(json.dumps(r, indent=2, ensure_ascii=False)[:2000])
        sys.exit(1)
    return r["json"]

def main():
    ids = {}
    try:
        ids = json.load(open("/tmp/dichoi-dokploy-ids.json"))
    except Exception:
        ids = {}
    if ids.get("projectId") and ids.get("environmentId"):
        project_id = ids["projectId"]; env_id = ids["environmentId"]
        print("dung lai projectId:", project_id, "environmentId:", env_id)
    else:
        # 1. project
        r = api("project.create", "POST", {"name": "Di Choi Online LIVE",
            "description": "Di Choi Online - TikTok LIVE du lich chill - dichoi.bla.io.vn"})
        pj = must_ok("project.create", r)
        proj = pj.get("project") or pj
        project_id = proj.get("projectId")
        env_obj = pj.get("environment") or (pj.get("environments") or [{}])[0]
        env_id = env_obj.get("environmentId")
        if not project_id or not env_id:
            print("project.create tra ve thieu id:", json.dumps(pj, ensure_ascii=False)[:1000]); sys.exit(1)
        ids["projectId"] = project_id; ids["environmentId"] = env_id
        print("projectId:", project_id, "environmentId:", env_id)

    # 2. compose (raw)
    r = api("compose.create", "POST", {
        "name": "di-choi-online", "projectId": project_id, "environmentId": env_id,
        "composeFile": COMPOSE_FILE, "sourceType": "raw", "composeType": "docker-compose",
        "description": "Di Choi Online - TikTok LIVE du lich chill",
    })
    cp = must_ok("compose.create", r)
    compose_id = cp.get("composeId")
    if not compose_id:
        print("compose.create tra ve thieu id:", json.dumps(cp, ensure_ascii=False)[:1000]); sys.exit(1)
    ids["composeId"] = compose_id; ids["appName"] = cp.get("appName")
    print("composeId:", compose_id, "appName:", cp.get("appName"))

    # 3. env PANEL_KEY (compose.create bo qua env)
    r = api("compose.update", "POST", {"composeId": compose_id, "env": f"PANEL_KEY={PANEL_KEY}\n"})
    must_ok("compose.update env", r)
    print("compose.update env: OK (PANEL_KEY da dat, khong in gia tri o day)")

    # 4. domain https:true ngay tu dau (bai hoc Lop Hoc: mac dinh https false gay 404)
    r = api("domain.create", "POST", {
        "composeId": compose_id, "host": "dichoi.bla.io.vn", "port": 4187,
        "https": True, "serviceName": "app", "certificateType": "letsencrypt",
    })
    dm = must_ok("domain.create", r)
    domain_id = dm.get("domainId") or (dm.get("domain") or {}).get("domainId")
    ids["domainId"] = domain_id
    print("domainId:", domain_id)

    # 5. deploy
    r = api("compose.deploy", "POST", {"composeId": compose_id})
    dp = must_ok("compose.deploy", r)
    dep = dp if isinstance(dp, dict) else {}
    ids["deploymentId"] = dep.get("deploymentId")
    print("deploymentId:", ids["deploymentId"])

    with open("/tmp/dichoi-dokploy-ids.json", "w") as f:
        json.dump(ids, f, indent=2)
    print("IDS_DA_LUU /tmp/dichoi-dokploy-ids.json")
    print("PANEL_KEY_FOR_REPORT=" + PANEL_KEY)

if __name__ == "__main__":
    main()
