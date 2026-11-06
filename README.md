# Đi Chơi Online — Du Lịch Cùng Nhau

Game TikTok LIVE chill: cả đoàn đi chơi cùng nhau qua 8 điểm đến Việt Nam
(Đà Nẵng, Đà Lạt, Hà Nội, Hội An, Huế, Nha Trang, Phú Quốc, Sa Pa), mỗi nơi
10 điểm dừng = 80 địa điểm thật. KHÔNG đua đội thắng thua. Thả tim mở điểm
dừng tiếp theo, follow là lên xe, vote 1/2/3 chọn việc làm ở mỗi điểm, đố vui
du lịch mỗi điểm, quà mở trải nghiệm (polaroid, món địa phương, hoàng hôn +
pháo hoa, hướng dẫn viên, cờ lưu niệm, hoa nở, mở view, ngắm sao).

- Panel điều khiển: `/` (cần mật khẩu panel `PANEL_KEY`)
- Sân khấu 9:16 cho TikTok LIVE Studio / OBS: `/stage` hoặc `/?view=stage`
- Kết nối TikTok chỉ bằng username, không cần mật khẩu/cookie TikTok
- Giọng MC tiếng Việt (Edge TTS) kể chuyện mỗi điểm dừng, nhạc nền WebAudio
  tự sinh (không file, không bản quyền), quà theo xu/tên, Điểm Vàng x2 điểm
  khi đủ mục tiêu quà cả đoàn, bot mô phỏng tối đa 16 con để test

## Chạy local

```bash
npm ci
npm run build
PORT=4187 PANEL_KEY=<mat-khau-test> npx tsx server.ts
```

## Deploy

Xem `DEPLOY.md`. Bản live hiện tại deploy bằng chích code vào container qua
Dokploy API (chưa bền); bước GitHub để build bền ghi trong `DEPLOY.md`.
