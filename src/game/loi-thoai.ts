// Câu MC đọc trong game Đi Chơi Online. Dùng makePicker để không lặp câu vừa đọc.
import { makePicker } from '../live/chatter';

const pick = makePicker();

export const MC = {
  // Mở đầu chuyến đi
  journeyStart: (dest: string) => pick([
    `Chuyến du lịch bắt đầu! Điểm đến đầu tiên là ${dest}. Cả đoàn lên xe nào!`,
    `Xe lăn bánh rồi! Mình cùng nhau đi chơi ${dest} nhé, ai chưa lên xe thì gõ đi chơi nhanh nào.`,
    `Chào mừng cả đoàn tới với chuyến đi hôm nay! Điểm đầu tiên: ${dest}.`,
  ]) ?? `Chuyến đi bắt đầu! Điểm đến đầu tiên là ${dest}.`,
  // Tới 1 điểm dừng: MC kể chuyện (story đã có sẵn, đọc kèm câu dẫn)
  arrive: (stop: string, story: string) => `${stop}! ${story}`,
  arriveGolden: (stop: string, story: string) => `Điểm Vàng đây! ${stop}! ${story} Điểm này mọi điểm nhân đôi nhé!`,
  // Hết giờ tham quan mà chưa đủ tim: tự đi tiếp
  visitTimeout: (stop: string) => pick([
    `Hết giờ ở ${stop} rồi, mình lên xe đi điểm tiếp theo thôi! Ai muốn ở lại thì thả tim nhiều vào lần sau nhé.`,
    `Đi tiếp nào cả đoàn ơi, còn nhiều điểm đẹp đang chờ phía trước!`,
  ]) ?? 'Đi điểm tiếp theo thôi!',
  // Đủ tim mở điểm tiếp theo
  nextStop: (stop: string) => pick([
    `Đủ tim rồi! Cả đoàn lên xe đi ${stop} nào!`,
    `Tim bay vù vù! Mình tới ${stop} thôi cả nhà ơi!`,
  ]) ?? `Đi ${stop} nào!`,
  // Hết 1 điểm đến
  destComplete: (dest: string, next: string) => pick([
    `Xong ${dest} rồi! Cả đoàn đã đi hết 10 điểm, giờ mình sang ${next} nhé!`,
    `Tạm biệt ${dest}! Hẹn gặp lại nhé. Điểm đến tiếp theo: ${next}!`,
  ]) ?? `Xong ${dest} rồi! Sang ${next} nhé!`,
  journeyComplete: (dest: string) => pick([
    `Cả đoàn đã đi hết 8 điểm đến, 80 địa điểm! Mình quay lại ${dest} làm vòng mới nhé!`,
    `Một vòng du lịch trọn vẹn! Giờ mình đi lại từ ${dest}, ai chưa đủ điểm thì gỡ lại nào!`,
  ]) ?? `Hết một vòng du lịch! Quay lại ${dest} nhé!`,
  // Vote
  voteResult: (label: string) => `Chốt rồi nhé: cả đoàn chọn ${label}! Đa số thích gì thì mình làm nấy, vui là chính!`,
  // Đố vui
  quizCorrect: (name: string) => pick([
    `Chính xác! Bạn ${name} trả lời đúng, cộng điểm du lịch!`,
    `Nhanh quá! Bạn ${name} đúng rồi, giỏi quá đi!`,
    `Đúng rồi đó bạn ${name}! Bạn là thổ địa rồi đó!`,
  ]) ?? `Bạn ${name} trả lời đúng!`,
  quizReveal: (answer: string) => `Hết giờ! Đáp án là ${answer}. Câu sau cố lên nhé.`,
  // Quà
  giftSmall: (name: string) => pick([
    `Cảm ơn bạn ${name} đã tặng quà cho cả đoàn!`,
    `Bạn ${name} vừa tiếp sức cho chuyến đi, cảm ơn bạn nhé!`,
  ]) ?? `Cảm ơn bạn ${name}!`,
  giftBig: (name: string, coins: number) => pick([
    `Ối dồi ôi! Bạn ${name} tặng ${coins} xu cho cả đoàn! Cả xe vỗ tay nào!`,
    `Quà to đây! Bạn ${name} tặng ${coins} xu, chuyến đi lên một khúc lớn luôn!`,
  ]) ?? `Bạn ${name} tặng ${coins} xu!`,
  polaroid: (name: string) => `Bạn ${name} tặng 1 xu check-in! Chụp một tấm polaroid kỷ niệm ở điểm này nhé!`,
  dish: (name: string) => `Bạn ${name} gọi món địa phương! Cả đoàn được ăn thử món ngon ở đây rồi!`,
  sunset: (name: string) => `Bạn ${name} mở hoàng hôn! Mặt trời lặn, pháo hoa nở, cả đoàn ngắm cảnh đẹp quá đi!`,
  guide: (name: string, sec: number) => `Bạn ${name} làm Hướng dẫn viên ${Math.round(sec / 60)} phút! Cả đoàn nghe bạn giới thiệu nhé!`,
  flag: (name: string, dest: string) => `Bạn ${name} cắm cờ lưu niệm ở ${dest}! Tên bạn ở lại hết điểm đến này!`,
  rose: (name: string) => `Bạn ${name} tặng hoa hồng, cả điểm dừng nở hoa luôn rồi!`,
  ticket: (name: string) => `Bạn ${name} tặng vé du lịch! Mở ra một góc view đẹp nhất ở đây cho cả đoàn ngắm!`,
  galaxy: (name: string) => `Galaxy đây! Bạn ${name} mở trời sao, cả đoàn cùng ngắm sao nào!`,
  giftGoal: (target: number) => `Đủ mục tiêu quà ${target} xu rồi! Điểm dừng tiếp theo thành Điểm Vàng, mọi điểm nhân đôi!`,
  // Follow / share / chào
  follow: (name: string) => pick([
    `Chào mừng bạn ${name} lên xe! Đã có ghế ngồi trên xe du lịch rồi nhé!`,
    `Bạn ${name} vừa follow, lên xe đi chơi cùng cả đoàn nào!`,
  ]) ?? `Chào mừng bạn ${name} lên xe!`,
  share: (name: string) => pick([
    `Cảm ơn bạn ${name} đã chia sẻ live!`,
    `Bạn ${name} chia sẻ live rồi, cả đoàn cảm ơn bạn nhé!`,
  ]) ?? `Cảm ơn bạn ${name} đã chia sẻ!`,
  greet: (names: string) => `Chào ${names} mới lên xe! Gõ đi chơi để vào đoàn đi nào.`,
  joinTrip: (name: string) => `Bạn ${name} lên xe đi chơi cùng cả đoàn!`,
  // Nhắc nhở
  idle: () => pick([
    'Xe đang im quá, ai còn ở đây thì gõ đi chơi cho MC thấy nào.',
    'Không ai comment là xe tưởng cả đoàn ngủ gật đó! Gõ 1, 2 hoặc 3 vote đi nào.',
  ]) ?? 'Ai còn ở đây thì gõ đi chơi nào.',
  shareReminder: () => pick([
    'Ai chưa share live thì share giúp đoàn một cái nhé, để rủ bạn vào đi chơi cùng cho vui.',
    'Share live để rủ bạn lên xe đi chơi cùng nào, càng đông càng vui.',
  ]) ?? 'Share live giúp đoàn nhé.',
  likeReminder: () => pick([
    'Thả tim nhiều vào cả nhà ơi, đủ tim là xe chạy tới điểm đẹp tiếp theo đó!',
    'Tim là xăng của xe du lịch đó, thả tim để xe chạy tiếp nào!',
  ]) ?? 'Thả tim để xe chạy tới điểm tiếp theo nào!',
  giftReminder: () => pick([
    'Tặng quà 1 xu là được chụp ảnh polaroid kỷ niệm, 5 xu là được ăn món địa phương đó cả nhà!',
    'Ai tặng quà là được MC gọi tên cảm ơn, 20 xu là được làm Hướng dẫn viên, 99 xu là được cắm cờ lưu niệm đó!',
  ]) ?? 'Tặng quà để được MC gọi tên cảm ơn nhé!',
};
