#!/usr/bin/env python3
"""Upload code Di Choi Online vao container Dokploy 9b5a1f6f8087 (hotfix, khong ben).
- Ghi file text qua docker.writeContainerFile (UTF-8)
- Kiem chung tung file bang docker.readContainerFile (so sha256)
- Khong upload package-lock.json: container chay `npm install` (tu tao lockfile)
- server.ts upload CUOI CUNG de vong lap trong compose chi bat dau npm install +
  build khi da du file.
- Khong ghi password/API key ra log.
Sau khi upload xong, vong lap trong compose command tu chay:
  npm install -> npm run build -> npx tsx server.ts
"""
import sys, os, json, subprocess, hashlib, base64
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import dynamic_credential_entry

BASE = "https://bla.io.vn"
CONTAINER = "9b5a1f6f8087"
DEPLOY = "/home/hatch/workspace/di-choi-online-deploy"

TEXT_FILES = [
    "package.json",
    "tsconfig.json",
    "vite.config.ts",
    "index.html",
    "src/App.tsx",
    "src/main.tsx",
    "src/index.css",
    "src/game/GameControls.tsx",
    "src/game/GameStage.tsx",
    "src/game/config.ts",
    "src/game/destinations.ts",
    "src/game/gameSettings.ts",
    "src/game/loi-thoai.ts",
    "src/game/quiz.ts",
    "src/game/sfx.ts",
    "src/game/trip.ts",
    "src/game/useGame.ts",
    "src/live/Dashboard.tsx",
    "src/live/ManageGifts.tsx",
    "src/live/StageFrame.tsx",
    "src/live/bannedWords.ts",
    "src/live/chatter.ts",
    "src/live/music.ts",
    "src/live/names.ts",
    "src/live/page.ts",
    "src/live/scoreboard.ts",
    "src/live/types.ts",
    "src/live/useLiveEvents.ts",
    "src/live/voice.ts",
    "server.ts",
]

def key():
    return str(dynamic_credential_entry("custom.dokploy", "access_token")["surrogate"]).strip()

def api(procedure, method="GET", data=None, query=None, timeout=120):
    url = f"{BASE}/api/{procedure}"
    if query:
        url += "?" + query
    cmd = ["curl", "-s", "-m", str(timeout), "-X", method, "-H", f"x-api-key: {key()}",
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

def sha256(b):
    return hashlib.sha256(b).hexdigest()

def read_container(path):
    r = api("docker.readContainerFile", "GET", None, f"containerId={CONTAINER}&path={path}")
    if r["status"] != 200 or not r.get("json") or "content" not in r["json"]:
        return None
    return base64.b64decode(r["json"]["content"])

def main():
    all_ok = True
    for f in TEXT_FILES:
        local = os.path.join(DEPLOY, f)
        remote = "/app/" + f
        content = open(local, encoding="utf-8").read()
        r = api("docker.writeContainerFile", "POST", {"containerId": CONTAINER, "path": remote, "content": content})
        ok = r["status"] == 200
        print(f"  {'ghi OK ' if ok else 'GHI LOI'} {remote} ({len(content)} byte)")
        if ok:
            got = read_container(remote)
            want = open(local, "rb").read()
            vok = got is not None and sha256(got) == sha256(want)
            print(f"    verify: {'OK ' if vok else 'SAI'} sha256 {sha256(want)[:12]}...")
            ok = vok
        all_ok = all_ok and ok
    print("TAT CA FILE:", "OK" if all_ok else "CO LOI")
    return 0 if all_ok else 1

if __name__ == "__main__":
    sys.exit(main())
