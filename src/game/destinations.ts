// 8 điểm đến x 10 điểm dừng = 80 địa điểm thật ở Việt Nam.
// Mỗi điểm dừng có 1-2 câu chuyện ngắn để MC đọc lúc đoàn tới nơi.

export interface Stop {
  name: string;
  emoji: string;
  story: string;
}

export interface Destination {
  name: string;
  emoji: string;
  tagline: string;
  stops: Stop[];
}

export const DESTINATIONS: Destination[] = [
  {
    name: 'Đà Nẵng',
    emoji: '🌉',
    tagline: 'Thành phố của những cây cầu',
    stops: [
      { name: 'Cầu Rồng', emoji: '🐉', story: 'Cầu Rồng phun lửa và phun nước vào tối thứ Bảy, Chủ nhật. Ai chưa xem rồng phun lửa thì coi như chưa tới Đà Nẵng!' },
      { name: 'Bà Nà Hills', emoji: '🌁', story: 'Cầu Vàng trên Bà Nà được hai bàn tay đá khổng lồ nâng đỡ, nhìn như bước ra từ trong mây. Lên đây là phải chụp ảnh check-in ngay.' },
      { name: 'Bán đảo Sơn Trà', emoji: '🐒', story: 'Sơn Trà là lá phổi xanh của Đà Nẵng, nhà của voọc chà vá chân nâu. Đứng đây nhìn xuống biển, cả thành phố thu vào tầm mắt.' },
      { name: 'Ngũ Hành Sơn', emoji: '⛰️', story: 'Năm ngọn núi đá vôi mang tên Kim, Mộc, Thủy, Hỏa, Thổ. Lên động Huyền Không nghe tiếng chuông chùa vang giữa núi đá.' },
      { name: 'Biển Mỹ Khê', emoji: '🏖️', story: 'Mỹ Khê từng được tạp chí Forbes bình chọn là một trong những bãi biển quyến rũ nhất hành tinh. Cát trắng, nước trong, tắm xong là quên hết mệt.' },
      { name: 'Chợ Cồn', emoji: '🛍️', story: 'Chợ Cồn là thiên đường ăn vặt: mì Quảng, bánh tráng cuốn thịt heo, chè sầu riêng. Vào chợ là phải ăn no mới được ra!' },
      { name: 'Cầu Sông Hàn', emoji: '🌉', story: 'Cầu Sông Hàn là cây cầu quay đầu tiên ở Việt Nam, nửa đêm cầu xoay ngang để tàu lớn đi qua. Tối ra đây ngắm cầu lên đèn đẹp lắm.' },
      { name: 'Bảo tàng Chăm', emoji: '🗿', story: 'Bảo tàng điêu khắc Chăm giữ những bức tượng sa thạch cả ngàn năm tuổi của vương quốc Champa. Ai thích lịch sử thì mê chỗ này.' },
      { name: 'Núi Thần Tài', emoji: '♨️', story: 'Suối khoáng nóng Núi Thần Tài nằm giữa rừng, ngâm mình trong hồ nước nóng xong là người nhẹ bẫng như vừa được sạc pin.' },
      { name: 'Làng đá Non Nước', emoji: '🪨', story: 'Làng đá Non Nước dưới chân Ngũ Hành Sơn đã có hơn 300 năm làm đá. Tượng đá ở đây đi khắp cả nước, khéo tay lắm.' },
    ],
  },
  {
    name: 'Đà Lạt',
    emoji: '🌸',
    tagline: 'Thành phố ngàn hoa, sương mù buổi sớm',
    stops: [
      { name: 'Hồ Xuân Hương', emoji: '🦢', story: 'Hồ Xuân Hương nằm ngay giữa lòng Đà Lạt, sáng sớm sương phủ mặt hồ, đạp vịt ra giữa hồ ngắm thông reo là chill nhất.' },
      { name: 'Chợ Đà Lạt', emoji: '🍓', story: 'Chợ Đà Lạt bán đủ thứ: dâu tây, bơ, atisô, hoa tươi. Tối ra chợ ăn bánh tráng nướng, uống sữa đậu nành nóng là đúng bài.' },
      { name: 'Đồi chè Cầu Đất', emoji: '🍃', story: 'Đồi chè Cầu Đất xanh mướt cả một vùng, sáng sớm mây luồn qua luống chè. Ai dậy sớm săn mây thì nhớ mang áo ấm nhé.' },
      { name: 'Thung lũng Tình Yêu', emoji: '💕', story: 'Thung lũng Tình Yêu ngày xưa là nơi hẹn hò của các đôi trai gái. Giờ đây hoa nở quanh năm, đi hai người thì vui, đi một mình thì càng vui.' },
      { name: 'Đỉnh Langbiang', emoji: '🏔️', story: 'Langbiang là nóc nhà của cao nguyên Lâm Viên, gắn với truyền thuyết chàng K’lang và nàng H’biang. Lên đỉnh là ngắm được cả Đà Lạt.' },
      { name: 'Dinh Bảo Đại', emoji: '🏰', story: 'Dinh Bảo Đại là nơi vị vua cuối cùng của Việt Nam từng ở. Kiến trúc Pháp cổ, vườn thông bao quanh, đi dạo là thấy mình sang hẳn lên.' },
      { name: 'Ga Đà Lạt', emoji: '🚂', story: 'Ga Đà Lạt là nhà ga cổ đẹp nhất Đông Dương, đầu máy hơi nước vẫn còn đó để chụp ảnh. Tàu răng cưa ngày xưa leo đèo từ đây xuống Phan Rang đó.' },
      { name: 'Vườn hoa thành phố', emoji: '🌷', story: 'Vườn hoa Đà Lạt có hơn 300 loài hoa nở quanh năm. Mùa nào cũng có hoa đẹp, đi chậm thôi để ngửi mùi hoa cho đã.' },
      { name: 'Thác Datanla', emoji: '💦', story: 'Thác Datanla có máng trượt xuyên rừng, trượt xuống nghe tiếng thác ầm ầm bên tai. Ai thích cảm giác mạnh thì đừng bỏ qua.' },
      { name: 'Hồ Tuyền Lâm', emoji: '🛶', story: 'Hồ Tuyền Lâm rộng mênh mông, nước xanh như ngọc, chèo thuyền kayak ra giữa hồ chỉ nghe tiếng chèo khua nước. Yên bình lắm.' },
    ],
  },
  {
    name: 'Hà Nội',
    emoji: '🏮',
    tagline: 'Nghìn năm văn hiến',
    stops: [
      { name: 'Hồ Gươm', emoji: '🐢', story: 'Hồ Gươm gắn với truyền thuyết vua Lê trả gươm cho rùa thần. Sáng sớm ra hồ tập thể dục, chiều ra hồ ăn kem, tối ra hồ xem phố đi bộ.' },
      { name: 'Phố cổ Hà Nội', emoji: '🏘️', story: 'Phố cổ 36 phố phường, mỗi phố một nghề xưa. Đi bộ trong này là ngửi đủ mùi: phở, bún chả, cà phê trứng, bánh cốm.' },
      { name: 'Văn Miếu Quốc Tử Giám', emoji: '🎓', story: 'Văn Miếu là trường đại học đầu tiên của Việt Nam, hơn 900 năm tuổi. Sĩ tử khắp nơi về đây xin chữ, cầu đỗ đạt trước mùa thi.' },
      { name: 'Lăng Bác', emoji: '🇻🇳', story: 'Lăng Bác nằm ở quảng trường Ba Đình, nơi Bác Hồ đọc Tuyên ngôn Độc lập. Vào viếng Bác xong nhớ ghé thăm nhà sàn và ao cá.' },
      { name: 'Chùa Một Cột', emoji: '🪷', story: 'Chùa Một Cột dựng trên một cột đá giữa hồ sen, nhìn như một bông sen nở. Đây là biểu tượng của Hà Nội cả ngàn năm nay.' },
      { name: 'Hồ Tây', emoji: '🌅', story: 'Hồ Tây là hồ lớn nhất Hà Nội, chiều hoàng hôn phủ vàng mặt hồ, đường ven hồ rợp bóng cây. Đạp xe quanh hồ là thú vui của người Hà Nội.' },
      { name: 'Nhà thờ Lớn', emoji: '⛪', story: 'Nhà thờ Lớn Hà Nội xây theo kiến trúc Gothic, đá xám cổ kính. Tối Giáng sinh cả phố Nhà Thờ sáng đèn, đông vui lắm.' },
      { name: 'Chợ Đồng Xuân', emoji: '🧺', story: 'Chợ Đồng Xuân là chợ lớn nhất phố cổ, bán từ vải vóc tới đặc sản. Muốn mua quà về cho người thân thì ghé đây là đủ.' },
      { name: 'Phố bia Tạ Hiện', emoji: '🍺', story: 'Tạ Hiện là phố bia nổi tiếng nhất Hà Nội, tối ngồi ghế nhựa vỉa hè, uống bia hơi, ăn nem chua rán, ngắm phố xá tấp nập.' },
      { name: 'Làng gốm Bát Tràng', emoji: '🏺', story: 'Làng gốm Bát Tràng có từ thế kỷ 14, ai tới cũng được tự tay nặn gốm. Nặn xấu cũng không sao, mang về làm kỷ niệm là vui rồi.' },
    ],
  },
  {
    name: 'Hội An',
    emoji: '🏮',
    tagline: 'Phố đèn lồng soi bóng sông Hoài',
    stops: [
      { name: 'Chùa Cầu', emoji: '🌉', story: 'Chùa Cầu là biểu tượng của Hội An, cây cầu Nhật Bản hơn 400 năm tuổi bắc qua sông. Đêm rằm đèn lồng soi xuống nước đẹp như tranh.' },
      { name: 'Phố đèn lồng', emoji: '🏮', story: 'Phố đèn lồng Hội An tối lên đèn là cả phố rực rỡ sắc màu. Ai chưa chụp ảnh với đèn lồng thì coi như chưa tới Hội An.' },
      { name: 'Hội quán Phúc Kiến', emoji: '🐉', story: 'Hội quán Phúc Kiến thờ Thiên Hậu Thánh Mẫu, kiến trúc chạm khắc tinh xảo của người Hoa xưa. Vào đây là nghe được cả một thời thương cảng.' },
      { name: 'Nhà cổ Tấn Ký', emoji: '🏠', story: 'Nhà cổ Tấn Ký hơn 200 năm tuổi, kiến trúc Việt - Hoa - Nhật hòa vào nhau. Mưa lớn nước sông dâng, nhà vẫn khô ráo nhờ thiết kế xưa.' },
      { name: 'Chợ Hội An', emoji: '🥭', story: 'Chợ Hội An bán đủ món ngon: cao lầu, bánh mì Phượng, chè bắp, nước mót thảo mộc. Ăn xong nhớ mua bánh đậu xanh về làm quà.' },
      { name: 'Biển An Bàng', emoji: '🏖️', story: 'An Bàng là bãi biển yên tĩnh nhất Hội An, cát trắng mịn, quán ven biển chill. Ngắm hoàng hôn ở đây là quên hết muộn phiền.' },
      { name: 'Làng rau Trà Quế', emoji: '🥬', story: 'Làng rau Trà Quế trồng rau bằng rong sông, rau thơm nức cả làng. Du khách được tự tay trồng rau, làm bánh xèo, ăn rau vừa hái.' },
      { name: 'Cù Lao Chàm', emoji: '🐠', story: 'Cù Lao Chàm là khu dự trữ sinh quyển thế giới, nước trong thấy đáy, lặn ngắm san hô là mê luôn. Nhớ giữ gìn biển sạch nhé.' },
      { name: 'Sông Hoài', emoji: '🕯️', story: 'Sông Hoài buổi tối rực đèn hoa đăng, thả một chiếc đèn xuống sông và ước một điều. Đẹp và lãng mạn nhất là đêm rằm.' },
      { name: 'Làng gốm Thanh Hà', emoji: '🏺', story: 'Làng gốm Thanh Hà có từ thế kỷ 16, làm gốm bằng đất sét sông Thu Bồn. Vào làng là được nặn gốm, xem lò nung, mua đồ gốm xinh về.' },
    ],
  },
  {
    name: 'Huế',
    emoji: '👑',
    tagline: 'Cố đô trầm mặc bên sông Hương',
    stops: [
      { name: 'Đại Nội Huế', emoji: '🏯', story: 'Đại Nội là kinh thành của triều Nguyễn, tường thành hào sâu, Ngọ Môn uy nghi. Đi hết Đại Nội là đi hết một thời vàng son.' },
      { name: 'Lăng Khải Định', emoji: '👑', story: 'Lăng Khải Định là lăng vua cầu kỳ nhất, khảm sành sứ lấp lánh cả trong lẫn ngoài. Nhìn gần mới thấy tay nghề thợ xưa tinh xảo cỡ nào.' },
      { name: 'Lăng Tự Đức', emoji: '🌿', story: 'Lăng Tự Đức nằm giữa rừng thông, hồ sen, nhà thơ mộng. Vua Tự Đức thích thơ ca nên lăng của ngài cũng nên thơ như một bài thơ.' },
      { name: 'Chùa Thiên Mụ', emoji: '🔔', story: 'Chùa Thiên Mụ với tháp Phước Duyên bảy tầng soi bóng sông Hương. Tiếng chuông chùa buổi chiều vang xa, nghe là lòng an yên.' },
      { name: 'Sông Hương', emoji: '🚣', story: 'Sông Hương hiền hòa chảy qua Huế, tối ngồi thuyền rồng nghe ca Huế trên sông là trải nghiệm không thể quên.' },
      { name: 'Chợ Đông Ba', emoji: '🍜', story: 'Chợ Đông Ba là chợ lớn nhất Huế, bán đủ đặc sản: bún bò, bánh bèo, bánh nậm, mè xửng. Vào chợ là phải ăn thử bún bò Huế chính gốc.' },
      { name: 'Cầu Tràng Tiền', emoji: '🌉', story: 'Cầu Tràng Tiền bắc qua sông Hương, tối lên đèn đổi màu rực rỡ. Đây là cây cầu trong bao bài thơ, bài hát về Huế.' },
      { name: 'Đồi Vọng Cảnh', emoji: '🌄', story: 'Đồi Vọng Cảnh là nơi ngắm sông Hương đẹp nhất, hoàng hôn buông xuống là cả dòng sông nhuộm vàng. Các vua Nguyễn xưa cũng thích lên đây ngắm cảnh.' },
      { name: 'Lăng Minh Mạng', emoji: '🏛️', story: 'Lăng Minh Mạng nằm giữa núi đồi, hồ nước, kiến trúc cân đối hài hòa. Đây được xem là lăng tẩm đẹp nhất trong các lăng vua Nguyễn.' },
      { name: 'Biển Thuận An', emoji: '🌊', story: 'Biển Thuận An là nơi sông Hương đổ ra biển, sóng êm, cát mịn. Chiều ra đây ăn hải sản tươi, ngắm hoàng hôn trên biển là hết ý.' },
    ],
  },
  {
    name: 'Nha Trang',
    emoji: '🏝️',
    tagline: 'Vịnh biển xanh ngắt',
    stops: [
      { name: 'Tháp Bà Ponagar', emoji: '🛕', story: 'Tháp Bà Ponagar là tháp Chăm hơn ngàn năm tuổi thờ nữ thần Ponagar. Lên tháp ngắm toàn cảnh thành phố và biển Nha Trang.' },
      { name: 'VinWonders Nha Trang', emoji: '🎢', story: 'VinWonders trên đảo Hòn Tre, đi cáp treo vượt biển là đã thấy thích. Trong này có đủ trò chơi, thủy cung, vườn hoa, chơi cả ngày không hết.' },
      { name: 'Bãi biển Trần Phú', emoji: '🏖️', story: 'Bãi biển Trần Phú dài hun hút, cát vàng, nước xanh. Sáng chạy bộ ven biển, chiều tắm biển, tối dạo phố biển là đủ một ngày đẹp.' },
      { name: 'Chợ Đầm', emoji: '🦑', story: 'Chợ Đầm bán đủ hải sản khô, yến sào, đồ lưu niệm. Muốn mua mực khô, cá khô về làm quà thì ghé chợ Đầm là đúng chỗ.' },
      { name: 'Nhà thờ đá Nha Trang', emoji: '⛪', story: 'Nhà thờ đá nằm trên đồi, đá xám cổ kính, nhìn từ trên cao xuống là thấy cả thành phố. Hoàng hôn ở đây đẹp mê hồn.' },
      { name: 'Hòn Chồng', emoji: '🪨', story: 'Hòn Chồng là bãi đá tự nhiên với truyền thuyết chàng trai khổng lồ để lại dấu tay trên đá. Ngồi đây nghe sóng vỗ là thư giãn nhất.' },
      { name: 'Suối Ba Hồ', emoji: '💦', story: 'Suối Ba Hồ có ba hồ nước trong vắt giữa rừng, leo đá lên từng hồ là một cuộc phiêu lưu nhỏ. Tắm suối xong là mát rượi cả người.' },
      { name: 'Đảo Hòn Mun', emoji: '🐠', story: 'Hòn Mun là khu bảo tồn biển, nước trong veo, san hô rực rỡ. Lặn ngắm san hô ở đây là thấy cả một thế giới dưới nước.' },
      { name: 'Viện Hải dương học', emoji: '🦈', story: 'Viện Hải dương học có thủy cung với hàng ngàn loài sinh vật biển, xương cá voi khổng lồ. Trẻ con mê chỗ này lắm.' },
      { name: 'Thác Yang Bay', emoji: '🌿', story: 'Thác Yang Bay nằm giữa rừng nguyên sinh, nước đổ trắng xóa, có cả suối khoáng nóng. Tắm thác xong là khỏe re.' },
    ],
  },
  {
    name: 'Phú Quốc',
    emoji: '🏝️',
    tagline: 'Đảo ngọc phương Nam',
    stops: [
      { name: 'Bãi Sao', emoji: '🏖️', story: 'Bãi Sao là bãi biển đẹp nhất Phú Quốc, cát trắng mịn như kem, nước xanh ngọc. Tắm ở đây xong là không muốn về đất liền.' },
      { name: 'Dinh Cậu', emoji: '🙏', story: 'Dinh Cậu nằm trên ghềnh đá nhô ra biển, nơi ngư dân cầu bình an trước mỗi chuyến ra khơi. Hoàng hôn ở Dinh Cậu đẹp nhất đảo.' },
      { name: 'Chợ đêm Phú Quốc', emoji: '🦐', story: 'Chợ đêm Phú Quốc bán đủ hải sản tươi nướng tại chỗ, kem cuộn, đậu phộng Chou Chou. Tối ra chợ là ăn no căng bụng.' },
      { name: 'Nhà tù Phú Quốc', emoji: '🕯️', story: 'Nhà tù Phú Quốc là di tích lịch sử, nơi ghi nhớ một thời đau thương của dân tộc. Vào đây là để nhớ, để trân trọng hòa bình hôm nay.' },
      { name: 'Suối Tranh', emoji: '💦', story: 'Suối Tranh len qua rừng, nước trong mát, có hồ nhỏ để ngâm chân. Đi bộ trong rừng tới suối là nghe chim hót, ngửi mùi lá rừng.' },
      { name: 'Hòn Thơm', emoji: '🚡', story: 'Hòn Thơm đi bằng cáp treo vượt biển dài nhất thế giới, ngồi cabin ngắm biển xanh ngắt bên dưới là mê luôn. Trên đảo có công viên nước và bãi biển đẹp.' },
      { name: 'Làng chài Hàm Ninh', emoji: '🎣', story: 'Làng chài Hàm Ninh yên bình, nhà bè nổi, ghẹ tươi ngon nức tiếng. Sáng ra đây ăn ghẹ, ngắm bình minh trên biển là đúng điệu dân đảo.' },
      { name: 'Bãi Dài', emoji: '🌅', story: 'Bãi Dài dài hun hút, cát vàng, nước trong, hoàng hôn nhuộm đỏ cả chân trời. Đây là một trong những bãi biển hoang sơ đẹp nhất Phú Quốc.' },
      { name: 'Mũi Gành Dầu', emoji: '🧭', story: 'Mũi Gành Dầu là mũi đất cực Bắc của Phú Quốc, đứng đây nhìn sang được đảo của Campuchia. Biển ở đây xanh thẳm, sóng vỗ êm.' },
      { name: 'VinWonders Phú Quốc', emoji: '🎡', story: 'VinWonders Phú Quốc là công viên giải trí lớn nhất Việt Nam, có đủ trò chơi cảm giác mạnh, thủy cung, vườn thú. Chơi một ngày là chưa đã.' },
    ],
  },
  {
    name: 'Sa Pa',
    emoji: '⛰️',
    tagline: 'Sương mù và ruộng bậc thang',
    stops: [
      { name: 'Đỉnh Fansipan', emoji: '🏔️', story: 'Fansipan là nóc nhà Đông Dương, cao 3.143 mét. Lên đỉnh bằng cáp treo rồi leo bậc đá, đứng trên mây là thấy mình nhỏ bé giữa trời đất.' },
      { name: 'Bản Cát Cát', emoji: '🏡', story: 'Bản Cát Cát của người H’Mông nằm dưới chân núi, nhà sàn, suối chảy, thác nước. Vào bản là được mặc đồ dân tộc, chụp ảnh với ruộng bậc thang.' },
      { name: 'Thung lũng Mường Hoa', emoji: '🌾', story: 'Thung lũng Mường Hoa có ruộng bậc thang đẹp nhất Sa Pa, mùa lúa chín vàng rực cả thung lũng. Đi tàu hỏa leo núi ngắm ruộng là thích nhất.' },
      { name: 'Nhà thờ đá Sa Pa', emoji: '⛪', story: 'Nhà thờ đá Sa Pa xây từ thời Pháp, đá xám cổ kính giữa trung tâm thị trấn. Tối thứ Bảy có chợ tình, người dân tộc xuống phố vui chơi, ca hát.' },
      { name: 'Đèo Ô Quy Hồ', emoji: '🛣️', story: 'Đèo Ô Quy Hồ là một trong tứ đại đỉnh đèo của Việt Nam, đường quanh co, mây bay ngang mặt. Đứng trên đèo ngắm hoàng hôn là nhớ mãi.' },
      { name: 'Cổng Trời', emoji: '🌫️', story: 'Cổng Trời trên đèo Ô Quy Hồ, sáng sớm mây mù giăng kín, bước qua cổng là như bước vào chốn bồng lai. Săn mây ở đây là phải dậy thật sớm.' },
      { name: 'Bản Tả Van', emoji: '🌿', story: 'Bản Tả Van của người Giáy nằm bên suối Mường Hoa, nhà sàn, ruộng bậc thang, cầu mây. Ở homestay trong bản là nghe được cả tiếng suối chảy đêm.' },
      { name: 'Thác Bạc', emoji: '💦', story: 'Thác Bạc đổ từ trên cao xuống trắng xóa như dải lụa bạc giữa núi rừng. Đứng dưới thác là nghe tiếng nước ầm ầm, mát lạnh cả người.' },
      { name: 'Núi Hàm Rồng', emoji: '🐉', story: 'Núi Hàm Rồng nhìn như đầu rồng ngẩng lên trời, leo lên đỉnh là ngắm được toàn cảnh thị trấn Sa Pa và thung lũng Mường Hoa bên dưới.' },
      { name: 'Chợ phiên Sa Pa', emoji: '🧺', story: 'Chợ phiên Sa Pa họp vào cuối tuần, người dân tộc mang thổ cẩm, rau rừng, thuốc nam xuống bán. Mua một món thổ cẩm về là có quà độc nhất.' },
    ],
  },
];

export const TOTAL_STOPS = DESTINATIONS.reduce((s, d) => s + d.stops.length, 0);
