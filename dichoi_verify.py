#!/usr/bin/env python3
"""Verify live dichoi.bla.io.vn. Lay PANEL_KEY tu Dokploy compose env luc chay
(khong ghi mat khau vao file/log). Chi in PASS/FAIL, khong in mat khau."""
import json, subprocess, sys
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import dynamic_credential_entry

BASE = "https://dichoi.bla.io.vn"
COMPOSE_ID = "2oqqioqouRslFjUBp1CvI"

def dokploy(procedure, method="GET", data=None, query=None):
    key = str(dynamic_credential_entry("custom.dokploy", "access_token")["surrogate"]).strip()
    url = f"https://bla.io.vn/api/{procedure}"
    if query:
        url += "?" + query
    cmd = ["curl", "-s", "-m", "60", "-X", method, "-H", f"x-api-key: {key}",
           "-H", "Content-Type: application/json", "-H", "Accept: application/json",
           "-w", "\n%{http_code}"]
    if data is not None:
        cmd += ["-d", json.dumps(data)]
    cmd.append(url)
    r = subprocess.run(cmd, capture_output=True, text=True)
    out = r.stdout.strip()
    lines = out.rsplit("\n", 1)
    try:
        return int(lines[-1]), lines[0] if len(lines) > 1 else ""
    except ValueError:
        return r.returncode, out

def http(method, path, headers=None, data=None):
    cmd = ["curl", "-s", "-m", "30", "-X", method]
    for k, v in (headers or {}).items():
        cmd += ["-H", f"{k}: {v}"]
    if data is not None:
        cmd += ["-d", json.dumps(data)]
    cmd += ["-w", "\n%{http_code}", BASE + path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    out = r.stdout.strip()
    lines = out.rsplit("\n", 1)
    try:
        return int(lines[-1]), lines[0] if len(lines) > 1 else ""
    except ValueError:
        return -1, out

P = F = 0
def ck(name, ok, extra=""):
    global P, F
    if ok:
        P += 1; print(f"PASS {name}")
    else:
        F += 1; print(f"FAIL {name} {extra}")

# Lay PANEL_KEY tu compose (khong in ra)
st, body = dokploy("compose.one", "GET", None, f"composeId={COMPOSE_ID}")
env = json.loads(body).get("env", "") if st == 200 else ""
PANEL_KEY = ""
for line in env.splitlines():
    if line.startswith("PANEL_KEY="):
        PANEL_KEY = line.split("=", 1)[1].strip()
ck("lay PANEL_KEY tu Dokploy compose", bool(PANEL_KEY))

# 1-4. panel/stage
st, body = http("GET", "/", {"Host": "dichoi.bla.io.vn"})
ck("panel / 200", st == 200, str(st))
ck("panel title Di Choi Online", "Đi Chơi Online" in body)
st, _ = http("GET", "/stage", {"Host": "dichoi.bla.io.vn"})
ck("stage /stage 200", st == 200, str(st))
st, _ = http("GET", "/?view=stage", {"Host": "dichoi.bla.io.vn"})
ck("stage ?view=stage 200", st == 200, str(st))
# 5. status
st, body = http("GET", "/api/tiktok/status")
d = json.loads(body) if st == 200 else {}
ck("api/tiktok/status 200, chua ket noi", st == 200 and d.get("data", {}).get("isConnected") is False, body[:120])
# 6. settings mac dinh
st, body = http("GET", "/api/settings")
d = json.loads(body).get("data", {}) if st == 200 else {}
want = {"likesPerStop": 100, "giftGoalXu": 100, "guideSec": 180, "votePts": 5, "quizPts": 20,
        "giftPts1": 10, "giftPts5": 20, "giftPts10": 30, "giftPts20": 50, "giftPts99": 100,
        "bigGiftCoins": 99, "giftThanksCooldownSec": 30, "musicVolume": 12}
ck("GET settings dung 13 mac dinh", d == want, json.dumps(d, ensure_ascii=False))
# 7-9. POST settings gate
h = {"Content-Type": "application/json"}
st, _ = http("POST", "/api/settings", h, {"likesPerStop": 50})
ck("POST settings khong key 403", st == 403, str(st))
st, _ = http("POST", "/api/settings", {**h, "x-panel-key": "sai"}, {"likesPerStop": 50})
ck("POST settings sai key 403", st == 403, str(st))
st, _ = http("POST", "/api/settings", {**h, "x-panel-key": PANEL_KEY}, {"likesPerStop": 50})
ck("POST settings dung key 200", st == 200, str(st))
st, body = http("GET", "/api/settings")
ck("GET settings sau luu = 50", json.loads(body).get("data", {}).get("likesPerStop") == 50, body[:120])
st, _ = http("POST", "/api/settings", {**h, "x-panel-key": PANEL_KEY}, {"likesPerStop": 100})
st, body = http("GET", "/api/settings")
ck("GET settings tra ve 100", json.loads(body).get("data", {}).get("likesPerStop") == 100, body[:120])
# 10-13. test/emit + control gate
st, _ = http("POST", "/api/test/emit", h, {"type": "chat", "data": {"nickname": "Test", "comment": "đi chơi"}})
ck("test/emit khong key 403", st == 403, str(st))
st, _ = http("POST", "/api/test/emit", {**h, "x-panel-key": PANEL_KEY}, {"type": "chat", "data": {"nickname": "Test", "comment": "đi chơi"}})
ck("test/emit dung key 200", st == 200, str(st))
st, _ = http("POST", "/api/control", h, {"action": "speak", "text": "xin chào"})
ck("control khong key 403", st == 403, str(st))
st, _ = http("POST", "/api/control", {**h, "x-panel-key": PANEL_KEY}, {"action": "speak", "text": "xin chào"})
ck("control dung key 200", st == 200, str(st))
# 14. TTS
r = subprocess.run(["curl", "-s", "-m", "60", "-o", "/tmp/dichoi-live-tts.mp3", "-w", "%{http_code} %{content_type} %{size_download}",
                    BASE + "/api/tts?text=Xin%20ch%C3%A0o%20c%E1%BA%A3%20%C4%91o%C3%A0n"], capture_output=True, text=True)
print("tts:", r.stdout.strip())
f = subprocess.run(["file", "/tmp/dichoi-live-tts.mp3"], capture_output=True, text=True)
print("tts file:", f.stdout.strip())
import os
sz = os.path.getsize("/tmp/dichoi-live-tts.mp3")
ck("tts MP3 hop le", sz > 5000 and "MPEG" in f.stdout, f"{sz} byte")
# 15-18. bundle
st, body = http("GET", "/", {"Host": "dichoi.bla.io.vn"})
import re
m = re.search(r"assets/index-[^\"]*\.js", body)
bundle = m.group(0) if m else ""
print("bundle:", bundle)
st, bj = http("GET", "/" + bundle)
ck("bundle tai duoc", st == 200 and len(bj) > 100000, f"{st} {len(bj)}")
ck("bundle co Quan ly — Qua & Du lich", "Quản lý — Quà" in bj)
ck("bundle co Mat khau panel", "Mật khẩu panel" in bj)
ck("bundle 0 lan Xem truoc", "Xem trước" not in bj)
ck("bundle 0 lan lvh.me", "lvh.me" not in bj)
# 19. cac game khac van 200
for host in ["tiktok.bla.io.vn", "sanvui.bla.io.vn", "xuyenviet.bla.io.vn", "damcuoi.bla.io.vn", "lophoc.bla.io.vn", "dilam.bla.io.vn"]:
    st, _ = http("GET", "/", {"Host": host})
    # goi truc tiep host that (curl qua Host header tren dichoi se 403 do allowlist) -> dung URL that
    r = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-m", "15", f"https://{host}/"], capture_output=True, text=True)
    ck(f"game khac {host} 200", r.stdout.strip() == "200", r.stdout.strip())
print(f"KET QUA LIVE: {P} PASS, {F} FAIL")
