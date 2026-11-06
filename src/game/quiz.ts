// Đố vui du lịch: hỏi 1 câu mỗi điểm dừng. Đáp án khớp sau khi bỏ dấu,
// chữ thường (dùng plain() ở chatter.ts): gõ "da nang" hay "Đà Nẵng" đều ăn.

export interface QuizQ {
  q: string;
  a: string[]; // các cách gõ được chấp nhận (đã bỏ dấu, thường hoá)
  show: string; // đáp án hiện lúc công bố
}

export const QUIZ: QuizQ[] = [
  { q: 'Cầu Rồng ở thành phố nào?', a: ['da nang', 'danang'], show: 'Đà Nẵng' },
  { q: 'Cầu Vàng được hai bàn tay đá nâng đỡ nằm ở đâu?', a: ['ba na', 'ba na hills', 'bana'], show: 'Bà Nà Hills, Đà Nẵng' },
  { q: 'Biển Mỹ Khê nằm ở thành phố nào?', a: ['da nang', 'danang'], show: 'Đà Nẵng' },
  { q: 'Hồ Xuân Hương nằm ở thành phố ngàn hoa nào?', a: ['da lat', 'dalat'], show: 'Đà Lạt' },
  { q: 'Đỉnh núi cao nhất Việt Nam tên là gì?', a: ['fansipan', 'fan si pan', 'phan xi pang'], show: 'Fansipan' },
  { q: 'Chùa Một Cột nằm ở đâu?', a: ['ha noi', 'hanoi'], show: 'Hà Nội' },
  { q: 'Văn Miếu Quốc Tử Giám là trường đại học đầu tiên của nước nào?', a: ['viet nam', 'vietnam'], show: 'Việt Nam' },
  { q: 'Phố đèn lồng nổi tiếng nhất Việt Nam là ở đâu?', a: ['hoi an', 'hoian'], show: 'Hội An' },
  { q: 'Chùa Cầu là biểu tượng của phố cổ nào?', a: ['hoi an', 'hoian'], show: 'Hội An' },
  { q: 'Cố đô Huế nằm bên dòng sông nào?', a: ['song huong', 'huong'], show: 'Sông Hương' },
  { q: 'Món ăn nổi tiếng nhất của Huế là gì? Gõ 2 chữ.', a: ['bun bo', 'bún bò'], show: 'Bún bò Huế' },
  { q: 'Tháp Bà Ponagar nằm ở thành phố biển nào?', a: ['nha trang', 'nhatrang'], show: 'Nha Trang' },
  { q: 'Bãi Sao nằm ở đảo nào?', a: ['phu quoc', 'phuquoc'], show: 'Phú Quốc' },
  { q: 'Cáp treo vượt biển dài nhất thế giới đi ra đảo nào ở Phú Quốc?', a: ['hon thom', 'honthom'], show: 'Hòn Thơm' },
  { q: 'Ruộng bậc thang đẹp nhất Sa Pa nằm ở thung lũng nào?', a: ['muong hoa', 'muonghoa'], show: 'Thung lũng Mường Hoa' },
  { q: 'Món bánh tráng nướng là đặc sản của thành phố nào?', a: ['da lat', 'dalat'], show: 'Đà Lạt' },
  { q: 'Mì Quảng là đặc sản của tỉnh nào?', a: ['quang nam', 'quangnam', 'da nang', 'danang'], show: 'Quảng Nam — Đà Nẵng' },
  { q: 'Cao lầu là món ăn nổi tiếng của đâu?', a: ['hoi an', 'hoian'], show: 'Hội An' },
  { q: 'Chợ Bến Thành nằm ở thành phố nào?', a: ['ho chi minh', 'sai gon', 'saigon', 'tp hcm', 'tphcm'], show: 'TP. Hồ Chí Minh' },
  { q: 'Vịnh Hạ Long nằm ở tỉnh nào?', a: ['quang ninh', 'quangninh'], show: 'Quảng Ninh' },
  { q: 'Động Phong Nha nằm ở tỉnh nào?', a: ['quang binh', 'quangbinh'], show: 'Quảng Bình' },
  { q: 'Cầu Tràng Tiền bắc qua sông nào?', a: ['song huong', 'huong'], show: 'Sông Hương' },
  { q: 'Bánh bèo, bánh nậm là đặc sản của cố đô nào?', a: ['hue'], show: 'Huế' },
  { q: 'Chợ nổi Cái Răng nằm ở thành phố nào?', a: ['can tho', 'cantho'], show: 'Cần Thơ' },
  { q: 'Đảo Cù Lao Chàm thuộc thành phố nào?', a: ['hoi an', 'hoian'], show: 'Hội An' },
  { q: 'Ga Đà Lạt là nhà ga cổ đẹp nhất vùng nào? Gõ 2 chữ.', a: ['dong duong', 'dongduong'], show: 'Đông Dương' },
  { q: 'Sapa thuộc tỉnh nào? (tên tỉnh mới sau sáp nhập)', a: ['lao cai', 'laocai'], show: 'Lào Cai' },
  { q: 'Biển An Bàng nằm ở đâu?', a: ['hoi an', 'hoian'], show: 'Hội An' },
  { q: 'Làng gốm Bát Tràng nằm ở đâu?', a: ['ha noi', 'hanoi'], show: 'Hà Nội' },
  { q: 'Thác Datanla nằm ở thành phố nào?', a: ['da lat', 'dalat'], show: 'Đà Lạt' },
];
