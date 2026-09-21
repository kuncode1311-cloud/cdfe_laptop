const fs = require('fs');
const path = require('path');

// Bản đồ thông số kỹ thuật chuẩn hóa cho toàn bộ 38 sản phẩm phụ kiện
const THONG_SO_PHU_KIEN_CHUAN = {
  // ---------------- BALO & TÚI CHỐNG SỐC (7 sp) ----------------
  'balo-gaming-rog-ranger-18': {
    kich_co_laptop_phu_hop: 'Tương thích mọi laptop từ 14 đến 18 inch (Vừa vặn ROG Strix SCAR 18)',
    dung_tich: 'Dung tích cực đại 36 Lít với ngăn chứa đa tầng',
    chat_lieu_vai: 'Vải Polyester 1680D phủ lớp kháng nước tuyệt đối & chống rách mài mòn',
    lop_lot_bao_ve: 'Lớp đệm bảo vệ 5 lớp triệt tiêu lực va đập chống sốc toàn diện',
    khoa_keo: 'Khóa kéo YKK Nhật Bản chống rạch trộm kèm lỗ xỏ ổ khóa',
    khang_nuoc: 'Kháng nước tiêu chuẩn IPX4, đi kèm áo trùm che mưa phản quang độc quyền',
    so_ngan_chua: 'Ngăn chính 18", ngăn phụ kiện riêng cho phím TKL, chuột, tai nghe và sạc',
    kich_thuoc: '510 x 340 x 240 mm',
    trong_luong: 1.25,
    cong_tinh_nang: 'Cổng USB tích hợp sạc nhanh ra ngoài, quai đeo đệm khí Air-mesh giảm tải',
    che_do_bao_hanh: 'Bảo hành 36 tháng đường may và khóa kéo chính hãng'
  },
  'tui-chong-soc-tomtoc-defender': {
    kich_co_laptop_phu_hop: 'Tương thích MacBook Air/Pro 13-14 inch, Dell XPS 13/14, ThinkPad X1',
    dung_tich: 'Thiết kế Slim gọn nhẹ, chuyên dụng bảo vệ máy',
    chat_lieu_vai: 'Vải dù Cordura quân đội 100% tái chế, chống thấm nước và chống rách',
    lop_lot_bao_ve: 'Đệm khí CornerArmor 360 độ đạt chuẩn thử nghiệm thả rơi quân đội Mỹ (MIL-STD-810H)',
    khoa_keo: 'Khóa kéo YKK Nhật Bản bền bỉ trên 50.000 lần kéo',
    khang_nuoc: 'Chống thấm nước bề mặt và ngăn chặn hoàn toàn bụi bẩn',
    so_ngan_chua: '1 ngăn đựng máy đệm nhung + 2 ngăn phụ đựng sạc, cáp, chuột và hub',
    kich_thuoc: '340 x 245 x 30 mm',
    trong_luong: 0.35,
    cong_tinh_nang: 'Quai xách da PU cao cấp và dây đeo vai có thể tháo rời',
    che_do_bao_hanh: 'Bảo hành chính hãng 12 tháng đường may và khóa kéo'
  },
  'balo-predator-gaming-utility': {
    kich_co_laptop_phu_hop: 'Ngăn chứa laptop màn hình khủng tới 17.3 inch',
    dung_tich: 'Dung tích 32 Lít với tải trọng tối đa lên tới 100kg',
    chat_lieu_vai: 'Vải Polyester 1680D phủ PU kháng nước tuyệt đối',
    lop_lot_bao_ve: 'Lớp mút xốp định hình dày dặn chống va đập từ mọi hướng',
    khoa_keo: 'Hệ thống khóa kéo chống nước với đầu kéo kim loại bền bỉ',
    khang_nuoc: 'Kháng mưa chuẩn IPX4 với đáy chống bám bùn đất',
    so_ngan_chua: '3 ngăn lớn độc lập và các ngăn phụ chuyên dụng cho gear',
    kich_thuoc: '520 x 355 x 200 mm',
    trong_luong: 1.1,
    cong_tinh_nang: 'Quai đeo vai chịu tải cao, khóa trợ lực ngực chống gù lưng',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng'
  },
  'tui-chong-soc-tomtoc-defender-macbook': {
    kich_co_laptop_phu_hop: 'Tương thích MacBook Pro 14/16 inch, MacBook Air M2/M3 & Laptop 14-16"',
    dung_tich: 'Kiểu dáng thanh lịch ôm sát thân máy tối đa',
    chat_lieu_vai: 'Vải Polyester tái chế cao cấp chống mài mòn thân thiện môi trường',
    lop_lot_bao_ve: 'Lớp lót lông cừu mềm mại siêu dày bảo vệ chống trầy xước viền kim loại',
    khoa_keo: 'Khóa kéo YKK chống thấm cao cấp siêu êm ái',
    khang_nuoc: 'Kháng nước trượt nước bề mặt công nghệ Hydro-repellent',
    so_ngan_chua: 'Ngăn chính chống sốc và ngăn ngoài đựng củ sạc Type-C',
    kich_thuoc: '355 x 250 x 28 mm',
    trong_luong: 0.35,
    cong_tinh_nang: 'Đệm góc CornerArmor độc quyền triệt tiêu lực rơi vỡ',
    che_do_bao_hanh: 'Bảo hành khóa kéo 12 tháng chính hãng'
  },
  'balo-targus-strike-ii-gaming': {
    kich_co_laptop_phu_hop: 'Ngăn đệm chuyên dụng laptop gaming lên tới 17.3 inch',
    dung_tich: 'Dung tích 27 Lít đa ngăn bố trí khoa học',
    chat_lieu_vai: 'Chất liệu Polyester cao cấp phủ chống bám bụi và chống nước',
    lop_lot_bao_ve: 'Hệ thống bảo vệ SafePort Sling lơ lửng chống tiếp đất khi rơi',
    khoa_keo: 'Khóa kim loại đúc siêu bền chống bung gãy',
    khang_nuoc: 'Tích hợp áo mưa trùm kín balo ở đáy',
    so_ngan_chua: 'Ngăn đựng kính mát, móc treo tai nghe và ngăn đựng bàn phím',
    kich_thuoc: '500 x 340 x 160 mm',
    trong_luong: 0.98,
    cong_tinh_nang: 'Đệm lưng thoáng khí công thái học, quai đeo trợ lực',
    che_do_bao_hanh: 'Bảo hành trọn đời giới hạn (Lifetime Warranty)'
  },
  'balo-dell-gaming-pursuit-17': {
    kich_co_laptop_phu_hop: 'Vừa vặn laptop gaming 15.6 đến 17.3 inch (Alienware, Dell G-Series)',
    dung_tich: 'Dung tích 28 Lít rộng rãi',
    chat_lieu_vai: 'Vải dệt mật độ cao chống rách kết hợp mặt giáp EVA',
    lop_lot_bao_ve: 'Tấm khiên đúc định hình EVA mặt trước bảo vệ thiết bị bên trong',
    khoa_keo: 'Khóa kéo kim loại chịu lực cao',
    khang_nuoc: 'Chống thấm nước mưa phùn và văng nước nhẹ',
    so_ngan_chua: 'Nhiều ngăn phân chia rõ ràng cho chuột, adapter và tai nghe',
    kich_thuoc: '490 x 330 x 180 mm',
    trong_luong: 0.95,
    cong_tinh_nang: 'Dải phản quang an toàn ban đêm, đệm lưng lưới chữ V',
    che_do_bao_hanh: 'Bảo hành chính hãng 12 tháng'
  },
  'tui-deo-cheo-tomtoc-edc-sling': {
    kich_co_laptop_phu_hop: 'Vừa iPad Pro 11", MacBook 12", Steam Deck, ROG Ally hoặc Nintendo Switch',
    dung_tich: 'Dung tích 7 Lít tối ưu phụ kiện công nghệ EDC hàng ngày',
    chat_lieu_vai: 'Vải sợi Cordura Ballistic Nylon siêu bền chống rạch',
    lop_lot_bao_ve: 'Lớp đệm xốp bảo vệ màn hình máy chơi game và tablet',
    khoa_keo: 'Khóa kéo YKK chống nước và khóa dây Duraflex bấm nhả cực nhanh',
    khang_nuoc: 'Chống thấm nước hoàn toàn',
    so_ngan_chua: '3 khoang chứa thông minh: ngăn ẩn sau lưng, khoang chính và khoang trước',
    kich_thuoc: '310 x 200 x 100 mm',
    trong_luong: 0.42,
    cong_tinh_nang: 'Quai đeo chéo đa năng chuyển đổi trái/phải dễ dàng',
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng'
  },

  // ---------------- BÀN PHÍM CƠ (5 sp) ----------------
  'ban-phim-co-asus-rog-azoth': {
    loai_switch: 'Switch cơ ROG NX Red/Snow (Pre-lubed sẵn từ nhà máy)',
    tinh_nang_dac_biet: 'Màn hình OLED 2 inch hiển thị thông số CPU/GPU & GIF, Hot-swap 5-pin',
    layout: 'Layout 75% gọn gàng (81 phím)',
    keycap: 'ROG PBT Doubleshot / ABS UV coat',
    cau_truc_mount: 'Gasket Mount 3 lớp đệm tiêu âm Silicone & Poron',
    chat_lieu_case: 'Khung mặt trên nhôm CNC anodized, đáy nhựa kỹ thuật cao',
    ket_noi: '3 Mode: ROG SpeedNova 2.4GHz không độ trễ, Bluetooth 5.1 & Type-C có dây',
    den_led: 'RGB 16.8 triệu màu Per-Key đồng bộ ASUS Aura Sync',
    dung_luong_pin: 'Lên tới 2.000 giờ (khi tắt OLED & LED RGB)',
    trong_luong: 1.18,
    tuong_thich: 'Windows 10/11 & macOS',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng ASUS'
  },
  'ban-phim-co-akko-mod007-pc': {
    loai_switch: 'Switch từ tính Akko Yellow Magnetic (Hall Effect Sensor)',
    tinh_nang_dac_biet: 'Rapid Trigger tùy chỉnh điểm kích hoạt từ 0.1mm đến 4.0mm, không điểm chết',
    layout: 'Layout 75% có núm xoay kim loại CNC (82 phím)',
    keycap: 'PBT Dye-Sub OEM Profile bền màu vĩnh viễn',
    cau_truc_mount: 'Gasket Mount với đệm giảm chấn cao cấp',
    chat_lieu_case: 'Polycarbonate cao cấp trong suốt tản sáng tuyệt đẹp',
    ket_noi: 'USB Type-C có dây với Polling Rate 8000Hz siêu tốc cho thi đấu FPS',
    den_led: 'RGB 16.8 triệu màu với 20 hiệu ứng ánh sáng',
    dung_luong_pin: 'Dùng nguồn Type-C trực tiếp ổn định tuyệt đối',
    trong_luong: 1.05,
    tuong_thich: 'Windows 10/11 & macOS (Driver cấu hình Web tiện lợi)',
    che_do_bao_hanh: 'Bảo hành chính hãng 12 tháng'
  },
  'ban-phim-co-keychron-q1-pro': {
    loai_switch: 'Keychron K Pro Red/Brown Switch cơ học bôi trơn sẵn',
    tinh_nang_dac_biet: 'Tương thích hoàn toàn QMK/VIA lập trình macro không giới hạn, Hot-swap',
    layout: 'Layout 75% có núm xoay đa năng Programmable Knob',
    keycap: 'KSA Profile PBT Double-shot công thái học chống bóng',
    cau_truc_mount: 'Double Gasket Mount độc quyền triệt tiêu tiếng vang kim loại',
    chat_lieu_case: 'Vỏ nhôm nguyên khối 6063 CNC gia công tỉ mỉ',
    ket_noi: 'Bluetooth 5.1 kết nối 3 thiết bị cùng lúc & Type-C có dây',
    den_led: 'RGB South-facing rực rỡ không cấn keycap Cherry',
    dung_luong_pin: 'Pin sạc 4000mAh sử dụng liên tục tới 300 giờ',
    trong_luong: 1.73,
    tuong_thich: 'macOS & Windows (gạt switch chuyển đổi phần cứng)',
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng'
  },
  'ban-phim-co-logitech-g915-tkl': {
    loai_switch: 'Switch cơ học GL Tactile / Linear Low Profile siêu mỏng',
    tinh_nang_dac_biet: 'Độ mỏng chỉ 22mm, con lăn âm lượng chuyên dụng bằng nhôm',
    layout: 'Layout Tenkeyless (TKL) tinh gọn giải phóng không gian chuột',
    keycap: 'Keycap Low Profile phủ lớp chống bám dầu vân tay',
    cau_truc_mount: 'Khung hợp kim nhôm máy bay 5052 siêu cứng vững',
    chat_lieu_case: 'Mặt nhôm xước phay sang trọng, đáy gia cố sợi thủy tinh',
    ket_noi: 'Không dây Lightspeed 1ms siêu tốc, Bluetooth & Dây micro-USB',
    den_led: 'Lightsync RGB 16.8 triệu màu đồng bộ trò chơi',
    dung_luong_pin: '40 giờ sáng đèn RGB liên tục ở mức sáng 100%',
    trong_luong: 0.81,
    tuong_thich: 'Windows 8 trở lên, macOS 10.11 trở lên',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng Logitech'
  },
  'ban-phim-co-razer-blackwidow-v4-pro': {
    loai_switch: 'Razer Green Clicky / Yellow Linear Switch (Độ bền 100 triệu lần nhấn)',
    tinh_nang_dac_biet: 'Núm xoay Razer Command Dial, 8 phím Macro chuyên dụng, Polling Rate 8000Hz',
    layout: 'Fullsize 104 phím kèm cụm phím điều khiển media độc lập',
    keycap: 'Doubleshot ABS Keycap siêu dày chống mờ ký tự',
    cau_truc_mount: '2 lớp đệm tiêu âm PCB foam và bottom case foam',
    chat_lieu_case: 'Mặt trên hợp kim nhôm 5052 cao cấp sơn phủ anodized',
    ket_noi: 'Dây cáp Type-C bện dù có thể tháo rời kèm cổng USB 2.0 Passthrough',
    den_led: 'Razer Chroma RGB Per-Key & viền phát sáng Underglow 3 phía',
    dung_luong_pin: 'Nguồn có dây trực tiếp đảm bảo Polling Rate 8000Hz',
    trong_luong: 1.12,
    tuong_thich: 'Windows 10/11 với phần mềm Razer Synapse 3',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng Razer'
  },

  // ---------------- CHUỘT & LÓT CHUỘT (6 sp) ----------------
  'chuot-gaming-sieu-nhe': {
    mat_doc_cam_bien: 'Cảm biến quang học PixArt PAW3395 chuẩn thi đấu esport',
    do_phan_giai_dpi: 'Lên tới 26.000 DPI tùy chỉnh linh hoạt',
    toc_do_ips_gia_toc: '650 IPS / Gia tốc 50G',
    switch_chuot: 'Huano Blue Shell Pink Dot tuổi thọ 80 triệu lần bấm giòn nảy',
    polling_rate: '1000Hz - 4000Hz không dây phản hồi tức thì',
    ket_noi: '3 Mode: Không dây 2.4GHz, Bluetooth 5.2 và Type-C bện dù siêu mềm',
    trong_luong: 0.049,
    dung_luong_pin: 'Pin Lithium 300mAh chơi game liên tục 70 giờ',
    chat_lieu_feet: '100% Virgin PTFE bo tròn cạnh lướt siêu trơn',
    kich_thuoc: '119 x 62 x 38 mm',
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng'
  },
  'chuot-logitech-g-pro-x-superlight-2': {
    mat_doc_cam_bien: 'Cảm biến quang học HERO 2 thế hệ mới nhất độ chính xác pixel-to-pixel',
    do_phan_giai_dpi: '100 – 32.000 DPI không làm mịn, không gia tốc',
    toc_do_ips_gia_toc: '500+ IPS / Gia tốc 40G',
    switch_chuot: 'Switch lai cơ - quang Lightforce siêu bền triệt tiêu double click',
    polling_rate: '4000Hz Polling Rate không dây qua dongle Lightspeed',
    ket_noi: 'Không dây Lightspeed 2.4GHz & Cổng sạc nhanh Type-C',
    trong_luong: 0.060,
    dung_luong_pin: 'Thời lượng pin lên tới 95 giờ hoạt động liên tục',
    chat_lieu_feet: '100% Zero-Additive PTFE không lẫn tạp chất',
    kich_thuoc: '125.0 x 63.5 x 40.0 mm',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng Logitech'
  },
  'chuot-razer-viper-v3-pro': {
    mat_doc_cam_bien: 'Cảm biến quang học Focus Pro 35K Gen-2 chính xác tuyệt đối 99.8%',
    do_phan_giai_dpi: 'Lên tới 35.000 DPI (bước chỉnh từng 1 DPI đơn vị)',
    toc_do_ips_gia_toc: '750 IPS / Gia tốc 70G',
    switch_chuot: 'Razer Optical Mouse Switches Gen-3 tuổi thọ 90 triệu lần nhấn',
    polling_rate: 'Không dây HyperPolling lên tới 8000Hz thực tế không giật lag',
    ket_noi: 'Không dây Razer HyperSpeed Wireless & Type-C Speedflex',
    trong_luong: 0.054,
    dung_luong_pin: 'Lên đến 95 giờ ở 1000Hz (17 giờ ở 8000Hz thi đấu)',
    chat_lieu_feet: '100% PTFE kích thước lớn bo tròn mép',
    kich_thuoc: '127.1 x 63.9 x 39.9 mm',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng Razer'
  },
  'chuot-khong-day-ergonomic-logitech-mx-master-3s': {
    mat_doc_cam_bien: 'Cảm biến Darkfield quang học di chuyển trên mọi bề mặt kể cả mặt kính',
    do_phan_giai_dpi: '200 – 8.000 DPI (điều chỉnh từng bước 50 DPI)',
    switch_chuot: 'Quiet Clicks giảm 90% tiếng ồn click chuột giúp tập trung tối đa',
    polling_rate: '125Hz tối ưu hóa thời lượng pin cho công việc',
    ket_noi: 'Bluetooth Low Energy & Đầu thu Logi Bolt USB Receiver',
    trong_luong: 0.141,
    dung_luong_pin: 'Pin sạc 500mAh dùng 70 ngày, sạc nhanh 1 phút dùng 3 giờ',
    con_lan: 'Con lăn MagSpeed cuộn 1000 dòng/giây và con lăn ngón cái phụ',
    kich_thuoc: '124.9 x 84.3 x 51.0 mm',
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng'
  },
  'lot-chuot-gaming-rgb': {
    loai_lot_chuot: 'Bàn di chuột Gaming tích hợp dải LED RGB quanh viền',
    kich_thuoc: '800 x 300 x 4 mm (Size XL phủ kín bàn)',
    chat_lieu_be_mat: 'Vải sợi Micro-texture tối ưu hóa cảm biến quang học chuột',
    chat_lieu_de: 'Đế cao su thiên nhiên chống trượt bám dính bàn tuyệt đối',
    che_do_led: '14 chế độ sáng RGB chuyển màu nút bấm một chạm',
    nguon_dien: 'Cáp bện dù micro-USB cấp nguồn 5V tiện lợi',
    che_do_bao_hanh: 'Bảo hành 6 tháng đổi mới'
  },
  'ban-di-chuot-artisan-hayate-otsu-fx': {
    loai_lot_chuot: 'Bàn di chuột thủ công Artisan Made in Japan cao cấp nhất thế giới',
    kich_thuoc: '490 x 420 x 4 mm (Size XL bề mặt trơn phẳng)',
    chat_lieu_be_mat: 'Vải dệt Jacquard dệt kim công nghệ cao cân bằng hoàn hảo Speed & Control',
    chat_lieu_de: 'Lớp bọt xốp PORON độc quyền giác hút bám chặt mặt bàn không xê dịch',
    do_cung_de: 'Độ mềm SOFT tạo cảm giác dừng chuột Stopping Power chuẩn xác',
    che_do_bao_hanh: 'Cam kết chính hãng Made in Japan nguyên seal'
  },
  'lot-chuot-steelseries-qck-prism-cloth-xl': {
    loai_lot_chuot: 'Bàn di chuột SteelSeries vải vi sợi mật độ cao viền LED RGB 2 vùng',
    kich_thuoc: '900 x 300 x 4 mm (Size XL chuẩn để vừa cả phím lẫn chuột)',
    chat_lieu_be_mat: 'Vải dệt vi sợi Micro-woven cloth bán chạy nhất thế giới',
    chat_lieu_de: 'Đế cao su chống trượt bền bỉ loại bỏ dịch chuyển ngoài ý muốn',
    che_do_led: 'RGB 2 vùng độc lập tương thích SteelSeries Engine & PrismSync',
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng'
  },

  // ---------------- TAI NGHE & LOA (6 sp) ----------------
  'tai-nghe-gaming-pro': {
    mang_loa_driver: 'Củ loa Neodymium Dynamic 50mm tái tạo âm trầm sống động',
    cong_nghe_am_thanh: 'Âm thanh vòm giả lập 7.1 Surround định vị tiếng bước chân chuẩn xác',
    dai_tan_so: '20 Hz – 20.000 Hz',
    tro_khang_do_nhay: '32 Ohm / 105 dB SPL/mW',
    micro: 'Micro lọc tiếng ồn đa hướng có thể uốn dẻo linh hoạt',
    ket_noi: 'Jack 3.5mm mạ vàng kèm dây chia âm thanh PC và cổng USB cấp LED',
    trong_luong: 0.32,
    dem_tai: 'Đệm mút êm ái bọc da PU thoáng khí đeo thoải mái nhiều giờ',
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng'
  },
  'tai-nghe-steelseries-arctis-nova-pro-wireless': {
    mang_loa_driver: 'Màng loa cao cấp High-Res Neodymium Drivers 40mm độ méo tiếng siêu thấp',
    cong_nghe_am_thanh: '360° Spatial Audio tương thích hoàn toàn Sonar Audio Software Suite',
    dai_tan_so: '10 Hz – 40.000 Hz (Chứng nhận Hi-Res Audio Certified)',
    chong_on_anc: 'Chống ồn chủ động ANC 4 micro với chế độ nghe môi trường Transparency Mode',
    micro: 'ClearCast Gen 2 khử tiếng ồn bằng AI hai chiều có thể thu gọn vào trong cúp tai',
    ket_noi: 'Trạm phát sóng Wireless Base Station 2.4GHz + Bluetooth 5.0 kết nối kép',
    dung_luong_pin: 'Hệ thống 2 pin Infinity Power System thay nóng liên tục không ngắt quãng',
    trong_luong: 0.338,
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng'
  },
  'tai-nghe-razer-blackshark-v2-pro-2026': {
    mang_loa_driver: 'Màng loa Razer TriForce Titanium 50mm tinh chỉnh từng dải âm cao, trung và trầm',
    cong_nghe_am_thanh: 'THX Spatial Audio âm thanh không gian chuẩn xác định vị tiếng súng',
    dai_tan_so: '12 Hz – 28.000 Hz',
    micro: 'Micro siêu băng thông rộng Razer HyperClear Super Wideband 32kHz bắt âm cực rõ',
    ket_noi: 'Không dây Razer HyperSpeed Wireless 2.4GHz, Bluetooth 5.2 & Type-C',
    dung_luong_pin: 'Thời lượng pin siêu khủng lên tới 70 giờ sử dụng',
    trong_luong: 0.320,
    dem_tai: 'Đệm tai mút hoạt tính FlowKnit siêu thoáng khí chống bí nóng',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng Razer'
  },
  'tai-nghe-sony-wh-1000xm5-chong-on': {
    mang_loa_driver: 'Màng loa 30mm sợi carbon nhẹ và cứng cáp mang lại chất âm tinh khiết tự nhiên',
    cong_nghe_am_thanh: 'Bộ xử lý V1 + QN1 tích hợp, chuẩn âm thanh Hi-Res Audio Wireless & LDAC, DSEE Extreme',
    chong_on_anc: 'Công nghệ chống ồn đỉnh cao thế giới Auto NC Optimizer tự thích ứng môi trường',
    micro: '8 micro thu âm kết hợp thuật toán AI khử ồn đàm thoại trong trẻo',
    ket_noi: 'Bluetooth 5.2 đa điểm kết nối 2 thiết bị đồng thời & Jack 3.5mm',
    dung_luong_pin: '30 giờ bật chống ồn (40 giờ tắt chống ồn), sạc nhanh 3 phút dùng 3 giờ',
    trong_luong: 0.250,
    dem_tai: 'Da mềm mại vừa vặn không gây áp lực lên vành tai',
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng Sony Việt Nam'
  },
  'loa-bluetooth-marshall-emberton-ii': {
    mang_loa_driver: '2 củ loa toàn dải 2 inch 10W + 2 màng tản âm thụ động Passive Radiators',
    cong_nghe_am_thanh: 'Âm thanh đa hướng True Stereophonic 360 độ đặc trưng Marshall',
    dai_tan_so: '60 Hz – 20.000 Hz',
    khang_nuoc: 'Chuẩn kháng nước và bụi bẩn IP67 chống chìm nước 1 mét trong 30 phút',
    ket_noi: 'Bluetooth 5.1 hỗ trợ chế độ kết nối Stack Mode ghép nhiều loa',
    dung_luong_pin: 'Thời lượng phát nhạc liên tục trên 30 giờ',
    kich_thuoc: '68 x 160 x 76 mm',
    trong_luong: 0.700,
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng'
  },
  'loa-gaming-razer-nommo-v2-pro': {
    mang_loa_driver: '2 loa vệ tinh củ loa toàn dải 3.2 inch + 1 Subwoofer loa siêu trầm đánh hướng xuống 5.5 inch',
    cong_nghe_am_thanh: 'THX Spatial Audio âm thanh vòm không gian 3D và âm trầm rung chuyển bàn chơi game',
    dai_tan_so: '40 Hz – 20.000 Hz',
    den_led: 'Đèn nền Razer Chroma RGB phát sáng phía sau loa vệ tinh phản chiếu lên tường',
    bo_dieu_khien: 'Núm xoay Razer Wireless Control Pod điều khiển âm lượng và EQ từ xa',
    ket_noi: 'USB Type-C cho PC/PS5 và Bluetooth 5.3 cho điện thoại',
    trong_luong: 4.85,
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng Razer'
  },

  // ---------------- SẠC, CÁP & HUB (6 sp) ----------------
  'cu-sac-nhanh-gan-140w': {
    cong_suat_toi_da: '140W chuẩn PD 3.1 sạc nhanh cho MacBook Pro 16" và laptop gaming',
    cong_nghe_sac: 'Công nghệ bán dẫn Gallium Nitride (GaN III) kích thước nhỏ gọn tỏa nhiệt thấp',
    so_cong_dau_ra: '3 cổng ra: 2 x USB-C (Max 140W) + 1 x USB-A (Max 22.5W)',
    giao_thuc_ho_tro: 'PD 3.1, PD 3.0, QC 4.0+, PPS, FCP, AFC',
    tinh_nang_an_toan: 'Bảo vệ quá dòng, quá áp, ngắn mạch và kiểm soát nhiệt độ thông minh',
    kich_thuoc: '75 x 75 x 30 mm',
    trong_luong: 0.290,
    che_do_bao_hanh: 'Bảo hành 18 tháng chính hãng 1 đổi 1'
  },
  'cu-sac-anker-prime-100w-gan': {
    cong_suat_toi_da: '100W công suất thực sạc đồng thời 3 thiết bị',
    cong_nghe_sac: 'Anker GaNPrime™ kết hợp công nghệ kiểm soát nhiệt độ ActiveShield™ 2.0',
    so_cong_dau_ra: '3 cổng sạc: 2 x USB-C (Max 100W) + 1 x USB-A (Max 22.5W)',
    giao_thuc_ho_tro: 'PowerIQ 4.0, PD 3.0, PPS tương thích mọi laptop văn phòng và điện thoại',
    kich_thuoc: '44 x 39 x 60 mm (Nhỏ hơn 43% so với củ sạc 96W thông thường)',
    trong_luong: 0.183,
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng đổi mới'
  },
  'cu-sac-ugreen-nexode-200w-gan-6-cong': {
    cong_suat_toi_da: 'Tổng công suất cực khủng 200W sạc được 2 laptop cùng lúc ở 100W',
    cong_nghe_sac: 'Trạm sạc bàn GaN Fast Charger thế hệ mới',
    so_cong_dau_ra: '6 cổng sạc chuyên nghiệp: 4 x USB-C + 2 x USB-A',
    giao_thuc_ho_tro: 'PD 3.0, QC 4+, SCP, AFC, PPS',
    tinh_nang_an_toan: 'Hệ thống bảo vệ Thermal Guard đo nhiệt độ 800 lần mỗi giây',
    kich_thuoc: '100 x 100 x 34 mm',
    trong_luong: 0.520,
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng Ugreen'
  },
  'pin-sac-du-phong-anker-737-powerbank-24000mah': {
    dung_luong_pin: '24.000 mAh (86.4Wh) - Chuẩn dung lượng được phép mang lên máy bay',
    cong_suat_toi_da: '140W công suất sạc 2 chiều (Cả sạc vào pin và sạc ra laptop đều đạt 140W)',
    man_hinh_hien_thi: 'Màn hình màu thông minh Smart Digital Display báo công suất, dung lượng và tuổi thọ pin',
    so_cong_dau_ra: '3 cổng: 2 x USB-C (Max 140W) + 1 x USB-A (Max 18W)',
    cong_nghe_sac: 'Power Delivery 3.1 & ActiveShield 2.0 kiểm soát nhiệt độ an toàn',
    kich_thuoc: '155.8 x 54.6 x 49.6 mm',
    trong_luong: 0.630,
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng đổi mới'
  },
  'hub-typec-10in1': {
    so_cong_dau_ra: '10 cổng: HDMI 4K@60Hz, VGA 1080P, LAN Gigabit RJ45, 3x USB 3.0, SD/TF, 3.5mm, Type-C PD 100W',
    bang_thong_truyen_du_lieu: 'Tốc độ truyền dữ liệu USB 3.0 5Gbps, mạng có dây 1000Mbps',
    cong_suat_sac_pass_through: 'Hỗ trợ sạc vào Type-C PD 100W nuôi máy khi đang kết nối',
    chat_lieu_vo: 'Khung hợp kim nhôm tản nhiệt nhanh, chống bám vân tay',
    trong_luong: 0.120,
    tuong_thich: 'MacBook, iPad Pro, Surface, Dell XPS, ThinkPad, laptop Windows có Type-C',
    che_do_bao_hanh: 'Bảo hành chính hãng 18 tháng'
  },
  'hub-caldigit-ts4-thunderbolt-4': {
    so_cong_dau_ra: '18 cổng: 3x Thunderbolt 4 (40Gbps), 1x DisplayPort 1.4, 5x USB-A 10Gbps, 3x USB-C 10Gbps, LAN 2.5Gbps, SD/microSD UHS-II, Jack âm thanh',
    bang_thong_truyen_du_lieu: 'Băng thông Thunderbolt 4 40Gbps hỗ trợ xuất 2 màn hình 6K@60Hz hoặc 1 màn hình 8K',
    cong_suat_sac_pass_through: 'Cung cấp nguồn sạc lên tới 98W liên tục cho laptop',
    chat_lieu_vo: 'Nhôm tản nhiệt nguyên khối chuẩn chuyên nghiệp',
    trong_luong: 0.640,
    tuong_thich: 'macOS (Apple Silicon M1/M2/M3/M4) và Windows 10/11 có Thunderbolt 4/USB4',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng'
  },
  'hub-ugreen-revodok-pro-9-in-1-usb-c': {
    so_cong_dau_ra: '9 cổng: 2 x HDMI (Hỗ trợ 4K@60Hz kép), 2 x USB-A 3.2 10Gbps, 1 x USB-C 3.2 10Gbps, LAN RJ45 Gigabit, USB-C PD 100W',
    bang_thong_truyen_du_lieu: 'USB 3.2 Gen 2 tốc độ 10Gbps truyền file 10GB chỉ trong 10 giây',
    cong_suat_sac_pass_through: 'USB-C PD 100W sạc nhanh',
    chat_lieu_vo: 'Vỏ nhôm xám không gian tản nhiệt tuyệt vời',
    trong_luong: 0.150,
    tuong_thich: 'Windows, macOS, Linux, Android',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng Ugreen'
  },

  // ---------------- LINH KIỆN & NÂNG CẤP (6 sp) ----------------
  'de-tan-nhiet-laptop-360': {
    loai_linh_kien: 'Đế tản nhiệt nhôm xoay 360 độ công thái học cho laptop 13 - 17.3 inch',
    chat_lieu: 'Hợp kim nhôm dày 3mm chịu lực tới 15kg, khớp xoay 360 độ có tiếng click êm tai',
    tinh_nang_dac_biet: 'Mặt tiếp xúc khoét rãnh tổ ong đối lưu khí tối đa, chỉnh góc nâng bảo vệ cổ và cột sống',
    kich_thuoc: '260 x 220 x 45 mm',
    trong_luong: 0.850,
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng'
  },
  'de-tan-nhiet-iets-gt500': {
    loai_linh_kien: 'Đế tản nhiệt laptop buồng áp suất kín công nghiệp làm mát cấp tốc',
    toc_do_quat: 'Quạt tuabin công nghiệp đường kính 14cm tốc độ 5000 RPM điều chỉnh vô cấp',
    hieu_qua_giam_nhiet: 'Hạ nhiệt CPU và GPU từ 15°C đến 25°C khi chơi game nặng',
    tinh_nang_dac_biet: 'Vòng đệm mút cao su hoạt tính bịt kín 360° ngăn khí nóng lọt lại + màng lọc bụi tháo rời',
    kich_co_laptop_phu_hop: 'Tương thích mọi laptop gaming tản nhiệt đáy từ 14 đến 18 inch',
    nguon_dien: 'Adapter nguồn rời 12V cấp điện riêng bảo vệ cổng USB của laptop',
    trong_luong: 1.20,
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng'
  },
  'ram-laptop-crucial-32gb-ddr5-5600mhz': {
    loai_linh_kien: 'RAM Laptop SODIMM DDR5',
    dung_luong: '32GB (1x32GB) Single Stick',
    toc_do_bus: '5600 MHz (Hỗ trợ tương thích ngược 5200MHz và 4800MHz)',
    do_tre_cl: 'CL46',
    dien_ap: '1.1V tiết kiệm điện năng tối đa',
    chuan_giao_tiep: '262-pin SODIMM',
    che_do_bao_hanh: 'Bảo hành trọn đời giới hạn (Lifetime Warranty)'
  },
  'ssd-samsung-990-pro-2tb-heatsink': {
    loai_linh_kien: 'Ổ cứng SSD M.2 NVMe PCIe Gen 4x4 kèm tản nhiệt Heatsink',
    dung_luong: '2TB (2000GB)',
    toc_do: 'Tốc độ đọc tuần tự 7.450 MB/s - Tốc độ ghi tuần tự 6.900 MB/s',
    toc_do_ngau_nhien: 'Đọc/Ghi ngẫu nhiên 1.600K/1.550K IOPS',
    chuan_giao_tiep: 'M.2 2280 PCIe 4.0 x4, NVMe 2.0',
    do_ben_tbw: '1200 TBW hoặc 1.5 triệu giờ hoạt động (MTBF)',
    tinh_nang_dac_biet: 'Tản nhiệt nhôm mỏng tích hợp lắp vừa cả laptop gaming dày và PlayStation 5',
    che_do_bao_hanh: 'Bảo hành 5 năm chính hãng Samsung'
  },
  'keo-tan-nhiet-thermal-grizzly-kryonaut-extreme': {
    loai_linh_kien: 'Keo tản nhiệt cao cấp dành cho ép xung Overclocking và laptop gaming',
    do_dan_nhiet: '14.2 W/mK hiệu quả truyền nhiệt đỉnh cao',
    trong_luong: '2 gram (Đủ tra cho 4-6 lần CPU/GPU laptop)',
    tinh_nang_dac_biet: 'Không dẫn điện (Non-conductive), không gây chập mạch linh kiện, không bị khô cứng theo thời gian',
    nhiet_do_hoat_dong: '-250 °C đến +350 °C',
    che_do_bao_hanh: 'Chính hãng nhập khẩu Germany nguyên tem chống giả'
  },
  'ssd-di-dong-sandisk-extreme-pro-1tb': {
    loai_linh_kien: 'Ổ cứng di động SSD siêu tốc vỏ kim loại chống sốc',
    dung_luong: '1TB',
    toc_do: 'Tốc độ đọc lên tới 2.000 MB/s - Ghi lên tới 2.000 MB/s',
    chuan_giao_tiep: 'USB 3.2 Gen 2x2 Type-C (20Gbps)',
    do_ben_chong_chiu: 'Kháng bụi và kháng nước chuẩn IP55, chịu rơi từ độ cao 3 mét',
    tinh_nang_dac_biet: 'Vỏ nhôm rèn nguyên khối hoạt động như bộ tản nhiệt, mã hóa phần cứng AES 256-bit',
    trong_luong: 0.078,
    che_do_bao_hanh: 'Bảo hành chính hãng 5 năm SanDisk'
  }
};

// 1. Cập nhật file FE/db.json
const dbPath = path.join(__dirname, '../db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let soLuongThayDoi = 0;
dbData.san_pham = dbData.san_pham.map(sp => {
  if (THONG_SO_PHU_KIEN_CHUAN[sp.id]) {
    soLuongThayDoi++;
    return {
      ...sp,
      thong_so: THONG_SO_PHU_KIEN_CHUAN[sp.id]
    };
  }
  return sp;
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log(`[✓] Đã cập nhật thành công ${soLuongThayDoi} sản phẩm phụ kiện trong FE/db.json!`);

// 2. Cập nhật file FE/du-lieu/san-pham-bo-sung.js
const boSungPath = path.join(__dirname, '../du-lieu/san-pham-bo-sung.js');
let boSungContent = fs.readFileSync(boSungPath, 'utf8');

// Thay thế trực tiếp trong danh_sach_san_pham_bo_sung
for (const [id, thongSo] of Object.entries(THONG_SO_PHU_KIEN_CHUAN)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"thong_so":\\s*)\\{[\\s\\S]*?\\}`);
  if (regex.test(boSungContent)) {
    boSungContent = boSungContent.replace(regex, `$1${JSON.stringify(thongSo, null, 8)}`);
  }
}
fs.writeFileSync(boSungPath, boSungContent, 'utf8');
console.log(`[✓] Đã cập nhật thành công FE/du-lieu/san-pham-bo-sung.js!`);

// 3. Cập nhật file FE/du-lieu/danh-sach-laptop.js
const danhSachPath = path.join(__dirname, '../du-lieu/danh-sach-laptop.js');
let danhSachContent = fs.readFileSync(danhSachPath, 'utf8');

for (const [id, thongSo] of Object.entries(THONG_SO_PHU_KIEN_CHUAN)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"thong_so":\\s*)\\{[\\s\\S]*?\\}`);
  if (regex.test(danhSachContent)) {
    danhSachContent = danhSachContent.replace(regex, `$1${JSON.stringify(thongSo, null, 6)}`);
  }
}
fs.writeFileSync(danhSachPath, danhSachContent, 'utf8');
console.log(`[✓] Đã cập nhật thành công FE/du-lieu/danh-sach-laptop.js!`);
