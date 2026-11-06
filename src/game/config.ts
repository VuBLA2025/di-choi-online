// =====================================================
//  CẤU HÌNH ĐI CHƠI ONLINE — DU LỊCH CÙNG NHAU
//  Số liệu. Câu MC đọc nằm ở loi-thoai.ts, câu đố ở quiz.ts,
//  điểm đến nằm ở destinations.ts. Game chill: KHÔNG đua đội,
//  cả đoàn đi chơi cùng nhau, tim mở điểm dừng tiếp theo.
// =====================================================

export const GAME = {
  // Tên đoàn mặc định (hiện trên sân). Chủ kênh đổi ở ô "Tên đoàn" trang điều khiển.
  defaultChannelName: 'Đoàn Du Lịch Online',

  // ---------- Vào đoàn ----------
  joinKeywords: ['di choi', 'len xe', 'đi chơi', 'lên xe', 'dichoi', 'du lich', 'đi du lịch'],

  // ---------- Một điểm dừng ----------
  phaseSec: {
    arrive: 20, // tới nơi: MC kể chuyện về điểm dừng
    visit: 240, // tham quan: vote + đố vui, tim mở điểm tiếp theo (hết giờ thì tự đi tiếp)
    celebrate: 25, // tổng kết điểm đến: vinh danh, rồi sang điểm đến mới
  } as const,
  // Việc làm ở mỗi điểm dừng (vote 1/2/3) — xoay theo điểm dừng
  voteOptions: [
    { id: '1', label: '📸 Chụp ảnh check-in' },
    { id: '2', label: '🍜 Ăn món địa phương' },
    { id: '3', label: '🌅 Ngắm cảnh chill' },
  ] as const,

  // ---------- Điểm ----------
  votePts: 5, // vote 1 lần mỗi điểm dừng
  quizPts: 20, // trả lời đúng đố vui ở điểm dừng
  quizWinners: 10, // tối đa chừng này người đúng được tính mỗi câu
  // Quà theo xu (diamondCount * repeatCount): điểm cộng cho người tặng
  giftPts1: 10,
  giftPts5: 20,
  giftPts10: 30,
  giftPts20: 50,
  giftPts99: 100,
  guideSec: 180, // quà 20 xu: làm Hướng dẫn viên 3 phút
  // Quà theo tên (khớp tên đã bỏ dấu, chữ thường)
  namedGiftPtsRose: 10,
  namedGiftPtsTicket: 50, // Travel Ticket: mở view đẹp
  namedGiftPtsGalaxy: 200,

  // ---------- Tim / mở điểm tiếp theo ----------
  likesPerStop: 100, // đủ 100 tim: mở điểm dừng tiếp theo
  heartBoost: 1, // tim thật tính nguyên

  // ---------- Mục tiêu quà cả đoàn ----------
  giftGoalXu: 100, // đủ 100 xu quà: điểm dừng tiếp theo thành điểm Vàng (điểm x2)

  // ---------- Xe du lịch ----------
  seatsShown: 12, // hiện tối đa chừng này hành khách trên xe
  topKept: 5, // Top Du Khách hiện chừng này người
  bubbleMs: 5000, // bong bóng chat trên đầu hành khách
  inactiveMs: 10 * 60_000, // im chừng này thì ghế nhường cho bạn đang tương tác

  // ---------- Quà / cảm ơn ----------
  giftThanksCooldownMs: 30_000,
  bigGiftCoins: 99,

  // ---------- Nhạc nền ----------
  musicVolume: 12, // % âm lượng nhạc nền WebAudio (0 là tắt)

  // ---------- Nói chuyện ----------
  greetEveryMs: 8000,
  namesPerGreeting: 3,
  shareReminderEveryMs: 6 * 60_000,
  idleAfterSec: 75, // không ai comment chừng này giây thì MC nhắc
  chatterMinLeftMs: 5000,
  chatterMaxWaitMs: 35_000,
  giftLineMaxWaitMs: 45_000,
  maxHoldMs: 25_000,
};
