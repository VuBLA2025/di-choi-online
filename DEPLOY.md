# Đi Chơi Online — Du Lịch Cùng Nhau trên dichoi.bla.io.vn

Game live TikTok **Đi Chơi Online — Du Lịch Cùng Nhau**: cả đoàn đi chơi cùng
nhau qua 8 điểm đến Việt Nam (Đà Nẵng, Đà Lạt, Hà Nội, Hội An, Huế, Nha Trang,
Phú Quốc, Sa Pa), mỗi nơi 10 điểm dừng = 80 địa điểm thật, mỗi điểm có 1-2 câu
chuyện MC kể lúc tới nơi. **KHÔNG đua đội thắng thua.** Thả tim mở điểm dừng
tiếp theo (mặc định 100 tim), follow là lên xe du lịch, vote 1/2/3 chọn việc
làm ở mỗi điểm, đố vui du lịch mỗi điểm (30 câu), quà mở trải nghiệm.

## Cách deploy lần này (LIVE TRƯỚC, GitHub SAU)

Theo lệnh của chủ kênh ngày 2026-11-06: deploy live trước, không chặn ở bước
tạo repo GitHub. Vì GitHub App token không có quyền tạo repo (thử
`create_repository` ngày 2026-11-06: 403 "Resource not accessible by
integration", giống lần kiểm tra 2026-11-04), và SSH lên host oracle bị
`Permission denied (publickey)` (thử 2026-11-05), bản live hiện tại deploy
bằng **chích code vào container qua Dokploy API** (cách Sàn Vui 3D và Đi Làm
Online đã dùng), KHÔNG phải build từ Git.

- Dokploy: project `Di Choi Online LIVE` (`cToz3EG9kUS4LHfNJo9KI`, environment
  production `Jps0iuosBWeyrikuVfUEI`), compose `di-choi-online`
  (`2oqqioqouRslFjUBp1CvI`, appName `compose-transmit-mobile-hard-drive-s3rm4l`),
  sourceType `raw`, domain `dichoi.bla.io.vn` (`9EQqXH0uNxOWHaxp_vWuV`,
  port 4187, `https: true`, Let's Encrypt — bật https ngay từ đầu theo bài
  học Lớp Học Chữ).
- Compose chạy image `node:22-alpine`, lệnh vòng lặp: `mkdir` thư mục code,
  `apk add python3 make g++` (tiktok-live-connector cần để build native),
  `npm install` (tự tạo lockfile, không cần package-lock.json) rồi
  `npm run build` + `npx tsx server.ts`. Vòng lặp tự chạy lại khi server tắt.
- Code (29 file text) upload vào container `9b5a1f6f8087` bằng
  `docker.writeContainerFile`, kiểm chứng từng file bằng
  `docker.readContainerFile` (so sha256) — xem `deploy_upload.py`.
  `server.ts` upload cuối cùng để vòng lặp chỉ bắt đầu install/build khi đã
  đủ file. Deploy (`iQijBo0AHPeQ7Mev-FjHy`, done 2026-11-06 13:27 UTC).
- Mật khẩu panel: đặt trong env của compose (`PANEL_KEY`, xem Dokploy).
  KHÔNG ghi mật khẩu vào file/repo/memory. Script `deploy_create.py` sinh
  mật khẩu mới lúc chạy và in ra stdout 1 lần duy nhất để báo cho chủ kênh.
- Verify live: xem `dichoi_verify.py` (tự lấy PANEL_KEY từ compose env lúc
  chạy, chỉ in PASS/FAIL, không in mật khẩu).

## ĐÃ BỀN — build từ GitHub (2026-11-06 tối)

Bản live hiện tại **đã bền**: code build từ repo GitHub, redeploy sẽ build
lại từ repo chứ không mất code.

1. Chủ kênh đã tạo repo trống `VuBLA2025/di-choi-online` trên github.com và
   chọn trong GitHub App installation (App token không tự tạo repo được — đã
   thử và bị 403 ngày 2026-11-06).
2. Push toàn bộ `~/workspace/di-choi-online-deploy/` (41 file text, 329 KB)
   lên repo nhánh `master`, commit `b383adc682fc8b0c5cf58adf36aa7def8f7c3976`
   (trên commit Initial `f4af3fc7` do GitHub tự tạo lúc lập repo với README;
   nhánh `main` mặc định chỉ có README, không dùng — nhánh deploy là `master`).
3. Đổi compose sang sourceType `github` (owner VuBLA2025, repo di-choi-online,
   branch master, composePath `./docker-compose.yml`, composeFile rỗng,
   githubId `0-f_X4vn1CYb3EnTqIaQo` — chung với Lớp Học Chữ/Đám Cưới), giữ
   nguyên domain, port 4187 và env PANEL_KEY, rồi `compose.deploy` (KHÔNG dùng
   `compose.redeploy`). Deployment `7aLqOCuZmiDxGY-cFS9pS` done 2026-11-06
   14:10 UTC.
4. Verify live lại: xem dưới (24/28 PASS lúc đầu, 4 FAIL chỉ do lỗi 520 nhất
   thời của Cloudflare lúc tải bundle + damcuoi timeout — kiểm tra lại ngay
   sau đó đều 200, bundle đủ nội dung).

## Nguồn

- Không clone từ PVLinh (không có game du lịch chill trong 5 repo của
  workaipvlinh-byte). Code viết mới dựa trên khung Đi Làm Online / Lớp Học Chữ
  (TypeScript + React 19 + Vite 8 + Tailwind 4, Express,
  `tiktok-live-connector` 2.5.0, giọng đọc Edge TTS tiếng Việt) đã chứng minh
  trên Dokploy. Demo tĩnh `di-choi-online-demo-san-chill` chỉ dùng để đối
  chiếu luật chơi (8 điểm đến, thang quà), không đọc source của demo.
- Stack: TypeScript + React 19 + Vite 8 + Tailwind 4, Express,
  `tiktok-live-connector` 2.5.0, giọng đọc Edge TTS tiếng Việt (MC nam
  vi-VN-NamMinhNeural mặc định, đổi được giọng nữ ở panel qua `?v=f`).

## Những chỗ khác khung Đi Làm Online

1. **Host allowlist** (`server.ts`): thêm `dichoi.bla.io.vn`.
2. **Mật khẩu panel**: như Đi Làm Online — `POST /api/control`,
   `/api/test/emit`, `/api/tiktok/connect`, `/api/tiktok/disconnect`,
   `/api/settings` yêu cầu đúng `PANEL_KEY` (header `Authorization: Bearer`
   hoặc `x-panel-key`), sai/thiếu thì 403. Dashboard có ô **Mật khẩu panel**.
3. **Bind `0.0.0.0`**, `PORT 4187`, volume `di-choi-online-data:/app/data`
   (giữ `data/game-settings.json` qua restart).
4. **Lõi game mới** (`src/game/trip.ts`, thay `race.ts`): 8 điểm đến x 10 điểm
   dừng ở `destinations.ts` (80 địa điểm thật + chuyện MC mỗi điểm), đi tuần
   tự; 3 giai đoạn mỗi điểm (Tới nơi 20s → Tham quan 240s → Tổng kết điểm đến
   25s); tim mở điểm tiếp theo; follow lên xe; vote 1/2/3 mỗi điểm 1 lần;
   đố vui du lịch mỗi điểm (`quiz.ts`, 30 câu); quà theo xu/tên; top du khách
   + top quà trong ngày; mục tiêu quà cả đoàn → Điểm Vàng x2 điểm.
   Sân xe du lịch vẽ bằng CSS, không cần ảnh ngoài.
5. **Stage 2 đường**: `/?view=stage` và `/stage` (page.ts kiểm tra cả
   `pathname === '/stage'`).
6. **Panel Quản lý — Quà & Du lịch** (`GET/POST /api/settings`, POST cần
   PANEL_KEY): tim mở điểm tiếp theo (100), mục tiêu quà cả đoàn (100 xu),
   thời gian Hướng dẫn viên (180 giây), điểm vote (5), điểm đố vui (20),
   điểm quà 1/5/10/20/99 xu (10/20/30/50/100), quà lớn (99), cảm ơn quà
   (30 giây), nhạc nền (12%). Lưu vào `data/game-settings.json`, stage áp
   dụng ngay qua SSE + poll 60s.
7. **Quà theo thang** (điểm + hiệu ứng sân): 1 xu chụp ảnh polaroid kỷ niệm,
   5 xu gọi món địa phương, 10 xu hoàng hôn + pháo hoa, 20 xu làm Hướng dẫn
   viên (spotlight + đếm ngược, mặc định 3 phút), 99 xu cắm cờ lưu niệm mang
   tên ở điểm đến; Rose = hoa nở, Travel Ticket = mở view đẹp, Galaxy = ngắm
   sao. Bảng "🎁 Tặng quà được gì" hiện thường trực trên stage.
8. **Nhạc nền WebAudio tự sinh** (`src/live/music.ts`, học theo Lớp Học Chữ):
   đệm hợp âm Đô–La thứ–Fa–Sol + nốt nhạc hộp ngũ cung, không file, không lo
   bản quyền. Mặc định 12% âm lượng, tự nhỏ xuống khi MC đang nói, bắt đầu
   sau 1 lần chạm lên stage, tắt bằng cách chỉnh "Nhạc nền" về 0 ở panel.
9. **Giọng MC không mất giữa live** (`src/live/voice.ts`, bài học Lớp Học
   Chữ 2026-11-06): trình phát cũ bỏ câu chưa phát được sau 8 giây làm MC im
   trong khi game vẫn chạy. Nay chờ trong lúc giọng đang tải (tối đa 40 giây),
   chỉ bỏ câu quá hạn / sang phần khác / tải lỗi hẳn; thêm `voice.stats`
   (played/dropped/guardDrops/errors, xem ở console `__dichoiVoice.stats`).
10. **Panel 1 cột, không preview** (quy tắc chủ kênh từ 2026-11-05): panel
    chỉ có quản lí + link "Mở stage thật (tab mới)" (`/stage`,
    `/?view=stage`).

## Kết quả test local (2026-11-06, trước khi deploy)

- `npm ci` → `tsc --noEmit` sạch → `vite build` xong (bundle
  `index-xBzpp34H.js`, 308 KB).
- Lõi Trip test headless 39/39 (`/tmp/dichoi-trip-test.ts`): 8 điểm đến x 10
  điểm dừng = 80, mọi điểm có chuyện MC; chưa lên xe thì chat không tính, gõ
  "đi chơi" lên xe; vote 1 lần/điểm (+5), đố vui đúng 1 lần/điểm (+20); 99 tim
  chưa mở điểm, đủ 100 tim sang điểm tiếp theo, tim reset; quà 1 xu Rose
  (hoa nở + polaroid), 5 xu gọi món, 10 xu hoàng hôn + pháo hoa, 20 xu Hướng
  dẫn viên spotlight, 99 xu Galaxy (ngắm sao + cờ lưu niệm), Travel Ticket mở
  view; đủ mục tiêu quà 100 xu → điểm sau thành Điểm Vàng, đố vui đúng +40;
  hết giờ visit tự sang điểm tiếp; hết 10 điểm → celebrate → sang Đà Lạt;
  hết 8 điểm đến → vòng 2 quay lại Đà Nẵng; chuyến mới reset điểm; follow
  lên xe, share cảm ơn; top du khách + top quà có dữ liệu.
- Server local 27/27 (`/tmp/dichoi-server-test.sh`, PORT 4187, PANEL_KEY test):
  panel/stage 200 với tiêu đề đúng, `/api/tiktok/status` 200,
  `GET /api/settings` đúng 13 giá trị mặc định, `POST /api/settings`
  không/sai key 403 và đúng key lưu được (đổi 50 rồi trả về 100),
  test/emit và control không key 403 / đúng key 200, host lạ 403, connect
  không key 403 / đúng key với username giả 400 thân thiện, `/api/tts` 200
  audio/mpeg MP3 hợp lệ 25.056 byte, bundle chứa "Quản lý — Quà & Du lịch" +
  "Mật khẩu panel", 0 lần "Xem trước" / "lvh.me".
- Chưa kiểm chứng local: render stage bằng mắt trên trình duyệt (Chrome
  headless trên máy này không chạy được — lỗi "Hatch WebGL domain policy is
  required for browser startup", exit 13; chỉ kiểm chứng bằng curl + bundle
  + test lõi như Đi Làm Online đã làm).

## Kết quả verify live (2026-11-06)

- https://dichoi.bla.io.vn/ — panel 200 `<title>Đi Chơi Online — Du Lịch Cùng Nhau</title>`
- https://dichoi.bla.io.vn/stage và https://dichoi.bla.io.vn/?view=stage — 200
- `/api/tiktok/status` 200 JSON (`isConnected: false` — chưa nối TikTok)
- `/api/settings` 200 đúng 13 giá trị mặc định; `POST` không/sai key 403,
  đúng key đổi `likesPerStop` 50 rồi trả về 100 (xác nhận bằng `GET`)
- test/emit không/sai key 403, đúng key 200; control không key 403, đúng key 200
- `/api/tts` 200 audio/mpeg MP3 hợp lệ 25.056 byte
- Bundle live `index-iTXy96o3.js` chứa "Quản lý — Quà & Du lịch" +
  "Mật khẩu panel", 0 lần "Xem trước" / "lvh.me"
- 6 game còn lại vẫn 200 (Chùa, Sàn Vui, Xuyên Việt, Đám Cưới, Lớp Học Chữ,
  Đi Làm Online)
- Tổng verify live: 28/28 PASS (`dichoi_verify.py`)

## Chưa kiểm chứng

- Kết nối TikTok LIVE thật (cần tài khoản đang live + username thật, chủ kênh
  tự nhập ở panel rồi bấm Kết nối).
- Nghe giọng MC / nhạc nền bằng tai trên thiết bị thật.
- Nhìn sân xe du lịch bằng mắt trên trình duyệt (mới kiểm tra bằng curl +
  bundle; nên mở `/stage` xem thử).
- Chơi 1 chuyến thật với người xem (lên xe, vote, đố vui, đủ 100 tim mở
  điểm, quà thật theo tên, mục tiêu quà 100 xu → Điểm Vàng).
- Bước GitHub bền (xem trên): repo chưa tồn tại, compose chưa build từ Git.
