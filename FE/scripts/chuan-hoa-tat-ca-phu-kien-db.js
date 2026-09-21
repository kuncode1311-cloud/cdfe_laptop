const fs = require('fs');
const path = require('path');

// Định nghĩa thông số kỹ thuật chuẩn hóa cho tất cả 42 sản phẩm phụ kiện trong DB
const THONG_SO_PHU_KIEN_42 = {
  // ==========================================
  // 1. BALO & TÚI CHỐNG SỐC (7 sản phẩm)
  // ==========================================
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

  // ==========================================
  // 2. BÀN PHÍM CƠ (6 sản phẩm)
  // ==========================================
  'ban-phim-co-custom-glyph-75': {
    loai_switch: 'Gateron Oil King Linear (Pre-lubed nhà máy cực mượt)',
    tinh_nang_dac_biet: 'Núm xoay CNC nhôm nguyên khối, Mạch xuôi Hot-swap 5-pin, Led viền RGB',
    layout: 'Layout 75% (82 phím)',
    keycap: 'PBT Dye-Sub Cherry Profile siêu dày',
    cau_truc_mount: 'Gasket Mount 4 lớp đệm tiêu âm Poron & màng cách điện IXPE',
    chat_lieu_case: 'Khung nhôm CNC Anodized màu đen mờ',
    ket_noi: '3 Mode: Không dây 2.4GHz độ trễ 1ms, Bluetooth 5.2 (3 thiết bị) & Type-C',
    den_led: 'RGB South-facing 16.8 triệu màu với 22 chế độ hiệu ứng',
    dung_luong_pin: 'Pin sạc 5000mAh sử dụng liên tục lên đến 250 giờ',
    trong_luong: 1.45,
    tuong_thich: 'Windows, macOS, Linux, Android, iOS',
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng'
  },
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

  // ==========================================
  // 3. CHUỘT & LÓT CHUỘT (8 sản phẩm)
  // ==========================================
  'chuot-gaming-pro-air-8': {
    mat_doc_cam_bien: 'PixArt PAW3395 Quang Học Flagship',
    do_phan_giai_dpi: 'Lên tới 26.000 DPI (chỉnh tay 6 mức)',
    toc_do_ips_gia_toc: '650 IPS / Gia tốc 50G',
    switch_chuot: 'Kailh Black Mamba tuổi thọ 80 triệu lần nhấn chống double-click',
    polling_rate: '1000Hz - 4000Hz không dây qua receiver',
    ket_noi: '3 Mode: Không dây 2.4GHz, Bluetooth 5.1 & Type-C dù',
    trong_luong: 0.052,
    dung_luong_pin: 'Pin sạc 400mAh dùng liên tục 80 giờ',
    chat_lieu_feet: '100% Virgin PTFE bo viền mượt mà',
    kich_thuoc: '120 x 63 x 38 mm',
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng'
  },
  'chuot-logitech-mx-master-3s': {
    mat_doc_cam_bien: 'Cảm biến Darkfield quang học di chuyển trên mọi bề mặt kể cả mặt kính',
    do_phan_giai_dpi: '200 – 8.000 DPI (điều chỉnh từng bước 50 DPI)',
    switch_chuot: 'Quiet Clicks giảm 90% tiếng ồn click chuột giúp tập trung tối đa',
    polling_rate: '125Hz tối ưu hóa thời lượng pin cho công việc',
    ket_noi: 'Bluetooth Low Energy & Đầu thu Logi Bolt USB Receiver',
    trong_luong: 0.141,
    dung_luong_pin: 'Pin sạc 500mAh dùng 70 ngày, sạc nhanh 1 phút dùng 3 giờ',
    chat_lieu_feet: 'PTFE cao cấp lướt êm ái',
    kich_thuoc: '124.9 x 84.3 x 51.0 mm',
    che_do_bao_hanh: 'Bảo hành 12 tháng chính hãng Logitech'
  },
  'chuot-razer-deathadder-v3-pro': {
    mat_doc_cam_bien: 'Focus Pro 30K Optical Sensor độc quyền Razer',
    do_phan_giai_dpi: '30.000 DPI với độ chính xác tuyệt đối 99.8%',
    toc_do_ips_gia_toc: '750 IPS / Gia tốc 70G',
    switch_chuot: 'Razer Optical Mouse Switches Gen-3 tuổi thọ 90 triệu lần bấm',
    polling_rate: 'HyperPolling 1000Hz (Nâng cấp tối đa 8000Hz)',
    ket_noi: 'Không dây Razer HyperSpeed & Dây cáp Speedflex Type-C',
    trong_luong: 0.063,
    dung_luong_pin: 'Thời lượng pin lên đến 90 giờ hoạt động liên tục',
    chat_lieu_feet: '100% PTFE kích thước lớn',
    kich_thuoc: '128.0 x 68.0 x 44.0 mm',
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng Razer'
  },
  'chuot-pulsar-x2v2-mini': {
    mat_doc_cam_bien: 'PixArt PAW3395 Optical Sensor cao cấp',
    do_phan_giai_dpi: '26.000 DPI',
    toc_do_ips_gia_toc: '650 IPS / Gia tốc 50G',
    switch_chuot: 'Optical Switches không có độ trễ debounce',
    polling_rate: 'Hỗ trợ 4K Polling Rate không dây',
    ket_noi: 'Không dây 2.4GHz & Dây cáp bện dù Superflex',
    trong_luong: 0.051,
    dung_luong_pin: 'Pin sạc dùng tới 100 giờ ở 1000Hz',
    chat_lieu_feet: 'PTFE siêu trơn',
    kich_thuoc: '115.6 x 60.6 x 36.6 mm',
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng'
  },
  'lot-chuot-gaming-speed-rgb-xxl': {
    loai_lot_chuot: 'Bàn di chuột kích thước mở rộng XXL viền LED RGB',
    kich_thuoc: '900 x 400 x 4 mm (Phủ trọn bàn làm việc)',
    chat_lieu_be_mat: 'Vải Micro-weave dệt mật độ cao chống nước và bụi',
    chat_lieu_de: 'Đế cao su tự nhiên chống trượt 100%',
    che_do_led: '12 chế độ ánh sáng RGB điều khiển qua nút bấm vật lý',
    nguon_dien: 'Dây cáp bện Type-C tháo rời',
    che_do_bao_hanh: 'Bảo hành chính hãng 12 tháng'
  },
  'lot-chuot-artisan-fx-hayate-otsu': {
    loai_lot_chuot: 'Bàn di chuột thủ công Artisan Made in Japan cao cấp nhất thế giới',
    kich_thuoc: '490 x 420 x 4 mm (Size XL bề mặt trơn phẳng)',
    chat_lieu_be_mat: 'Vải dệt Jacquard dệt kim công nghệ cao cân bằng hoàn hảo Speed & Control',
    chat_lieu_de: 'Lớp bọt xốp PORON độc quyền giác hút bám chặt mặt bàn không xê dịch',
    do_cung_de: 'Độ mềm SOFT tạo cảm giác dừng chuột Stopping Power chuẩn xác',
    che_do_bao_hanh: 'Cam kết chính hãng Made in Japan nguyên seal'
  },
  'lot-chuot-corsair-mm700-rgb': {
    loai_lot_chuot: 'Bàn di chuột Corsair siêu lớn Extended 3XL viền phát sáng 360 độ',
    kich_thuoc: '1220 x 610 x 4 mm (Trải kín toàn bộ mặt bàn lớn)',
    chat_lieu_be_mat: 'Vải dệt lướt êm tăng cường độ chính xác cho cảm biến quang',
    chat_lieu_de: 'Đế cao su dày 4mm nâng đỡ êm ái cổ tay',
    che_do_led: 'RGB 3 vùng phát sáng tích hợp Hub 2 cổng USB passthrough tiện lợi',
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng'
  },

  // ==========================================
  // 4. TAI NGHE & LOA (6 sản phẩm)
  // ==========================================
  'tai-nghe-gaming-aether-pro-71': {
    mang_loa_driver: 'Củ loa Graphene 50mm Hi-Res Audio độ phân giải cao',
    cong_nghe_am_thanh: 'Âm thanh không gian 3D Spatial Audio 7.1 vòm định vị kẻ địch',
    dai_tan_so: '15 Hz – 28.000 Hz',
    tro_khang_do_nhay: '32 Ohm / 108 dB SPL',
    micro: 'Micro thu âm đa hướng công nghệ chống ồn AI khử tạp âm',
    ket_noi: 'Không dây 2.4GHz không độ trễ & Bluetooth 5.3 & Jack 3.5mm',
    dung_luong_pin: 'Thời lượng pin 60 giờ chơi game liên tục',
    trong_luong: 0.285,
    dem_tai: 'Đệm mút hoạt tính Memory Foam bọc vải thở thoáng khí',
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng'
  },
  'tai-nghe-sony-wh-1000xm5': {
    mang_loa_driver: 'Màng loa 30mm sợi carbon nhẹ và cứng cáp mang lại chất âm tinh khiết',
    cong_nghe_am_thanh: 'Bộ xử lý V1 + QN1 tích hợp, Hi-Res Audio Wireless, LDAC, DSEE Extreme',
    chong_on_anc: 'Công nghệ chống ồn đỉnh cao Auto NC Optimizer tự thích ứng môi trường',
    micro: '8 micro thu âm kết hợp thuật toán AI khử ồn đàm thoại trong trẻo',
    ket_noi: 'Bluetooth 5.2 đa điểm kết nối 2 thiết bị đồng thời & Jack 3.5mm',
    dung_luong_pin: '30 giờ bật ANC (40 giờ tắt ANC), sạc nhanh 3 phút dùng 3 giờ',
    trong_luong: 0.250,
    dem_tai: 'Da mềm mại vừa vặn không gây áp lực lên vành tai',
    che_do_bao_hanh: 'Bảo hành chính hãng 12 tháng Sony Việt Nam'
  },
  'tai-nghe-hyperx-cloud-iii-wireless': {
    mang_loa_driver: 'Màng loa góc nghiêng 53mm được tinh chỉnh cho âm thanh gaming chân thực',
    cong_nghe_am_thanh: 'DTS Headphone:X Spatial Audio kích hoạt trọn đời định vị không gian',
    dai_tan_so: '10 Hz – 21.000 Hz',
    micro: 'Micro 10mm siêu rõ kèm màng lọc kim loại chống tạp âm hơi thở',
    ket_noi: 'Không dây 2.4GHz phạm vi 20 mét qua dongle Type-C / USB-A',
    dung_luong_pin: 'Thời lượng pin cực khủng lên tới 120 giờ chỉ sau một lần sạc',
    trong_luong: 0.330,
    dem_tai: 'Đệm mút hoạt tính HyperX đặc trưng bọc da cao cấp êm ái',
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng'
  },
  'tai-nghe-steelseries-arctis-nova-pro': {
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
  'loa-bluetooth-jbl-charge-5': {
    mang_loa_driver: 'Củ loa dạng đường đua 52x90mm + Loa tweeter 20mm riêng biệt + 2 màng rung thụ động',
    cong_nghe_am_thanh: 'JBL Original Pro Sound công suất thực 40W RMS âm trầm đầy uy lực',
    dai_tan_so: '60 Hz – 20.000 Hz',
    khang_nuoc: 'Chuẩn chống nước và kháng bụi IP67 bền bỉ trong mọi điều kiện tiệc tùng',
    ket_noi: 'Bluetooth 5.1 kết nối PartyBoost ghép đôi nhiều loa JBL',
    dung_luong_pin: 'Pin sạc 7500mAh phát nhạc 20 giờ, có cổng USB sạc ngược cho điện thoại',
    kich_thuoc: '223 x 96.5 x 94 mm',
    trong_luong: 0.960,
    che_do_bao_hanh: 'Bảo hành chính hãng 12 tháng JBL'
  },

  // ==========================================
  // 5. SẠC, CÁP & HUB (7 sản phẩm)
  // ==========================================
  'cu-sac-gan-anker-140w-pd31': {
    cong_suat_toi_da: '140W chuẩn PD 3.1 sạc nhanh cho MacBook Pro 16" và laptop gaming',
    cong_nghe_sac: 'Anker GaNPrime kết hợp ActiveShield 2.0 kiểm soát nhiệt độ thông minh',
    so_cong_dau_ra: '3 cổng: 2 x USB-C (Max 140W) + 1 x USB-A (Max 22.5W)',
    giao_thuc_ho_tro: 'PD 3.1, PD 3.0, PPS, QC 4.0+',
    tinh_nang_an_toan: 'Bảo vệ quá dòng, quá áp, ngắn mạch và đo nhiệt độ 3 triệu lần/ngày',
    kich_thuoc: '73 x 32 x 65 mm',
    trong_luong: 0.235,
    che_do_bao_hanh: 'Bảo hành 24 tháng chính hãng 1 đổi 1'
  },
  'hub-chuyen-doi-typec-10in1-hyperdrive': {
    so_cong_dau_ra: '10 cổng: HDMI 4K@60Hz, VGA 1080P, LAN Gigabit RJ45, 3x USB-A 3.1 5Gbps, SD/microSD, Jack 3.5mm & Type-C PD 100W',
    bang_thong_truyen_du_lieu: 'Tốc độ truyền dữ liệu USB 3.1 5Gbps, mạng có dây 1000Mbps',
    cong_suat_sac_pass_through: 'Hỗ trợ sạc vào Type-C PD 100W cấp nguồn liên tục cho laptop',
    chat_lieu_vo: 'Khung nhôm nguyên khối màu xám Space Gray tản nhiệt cực nhanh',
    trong_luong: 0.130,
    tuong_thich: 'MacBook, Dell XPS, ThinkPad, Surface, iPad Pro và máy tính Type-C',
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng'
  },
  'cu-sac-ugreen-nexode-100w-gan': {
    cong_suat_toi_da: '100W sạc nhanh đồng thời 4 thiết bị cùng lúc',
    cong_nghe_sac: 'Công nghệ bán dẫn GaNFast III kích thước nhỏ gọn hiệu suất chuyển đổi 95%',
    so_cong_dau_ra: '4 cổng sạc: 3 x USB-C + 1 x USB-A',
    giao_thuc_ho_tro: 'Power Delivery 3.0, Quick Charge 4.0+, SCP, AFC, PPS',
    kich_thuoc: '69 x 69 x 33 mm',
    trong_luong: 0.215,
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng Ugreen'
  },
  'cap-belkin-thunderbolt-4-2m': {
    bang_thong_truyen_du_lieu: 'Băng thông cực đại 40Gbps truyền video 4K trong vài giây',
    cong_suat_toi_da: 'Sạc nhanh Power Delivery công suất lên tới 100W',
    xuat_hinh_anh: 'Hỗ trợ xuất 1 màn hình 8K@60Hz hoặc 2 màn hình 4K@60Hz kép',
    chieu_dai_cap: 'Chiều dài 2.0 mét cáp bện dù chống gãy đứt siêu bền',
    tuong_thich: 'Thunderbolt 4, Thunderbolt 3, USB4 và Type-C phổ thông',
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng Belkin'
  },
  'tram-sac-anker-prime-20000mah': {
    dung_luong_pin: '20.000 mAh (72Wh) - Chuẩn an toàn hàng không quốc tế',
    cong_suat_toi_da: 'Tổng công suất ra 200W (100W mỗi cổng Type-C đồng thời sạc 2 laptop)',
    man_hinh_hien_thi: 'Màn hình màu TFT hiển thị thời gian thực công suất nạp/xả và chu kỳ pin',
    so_cong_dau_ra: '3 cổng sạc: 2 x USB-C (Max 100W) + 1 x USB-A (Max 65W)',
    kich_thuoc: '126.8 x 54.6 x 49.6 mm',
    trong_luong: 0.540,
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng Anker'
  },
  'hub-caldigit-ts4-thunderbolt-4': {
    so_cong_dau_ra: '18 cổng kết nối: 3x Thunderbolt 4 (40Gbps), 1x DisplayPort 1.4, 5x USB-A 10Gbps, 3x USB-C 10Gbps, LAN 2.5Gbps, SD/microSD UHS-II, Jack âm thanh',
    bang_thong_truyen_du_lieu: 'Băng thông Thunderbolt 4 40Gbps xuất 2 màn hình 6K@60Hz hoặc 1 màn hình 8K',
    cong_suat_sac_pass_through: 'Cung cấp nguồn sạc lên tới 98W liên tục nuôi laptop',
    chat_lieu_vo: 'Nhôm tản nhiệt nguyên khối chuẩn studio chuyên nghiệp',
    trong_luong: 0.640,
    tuong_thich: 'macOS (Apple Silicon M1/M2/M3/M4) và Windows 10/11 có Thunderbolt 4',
    che_do_bao_hanh: 'Bảo hành chính hãng 24 tháng'
  },
  'pin-sac-shargeek-storm-2-100w': {
    dung_luong_pin: '25.600 mAh (93.5Wh) sử dụng 8 cell pin Samsung/LG cao cấp',
    cong_suat_toi_da: '100W sạc nhanh 2 chiều qua cổng Type-C',
    man_hinh_hien_thi: 'Màn hình IPS màu phong cách Cyberpunk hiển thị điện áp, dòng điện và nhiệt độ',
    chat_lieu_vo: 'Vỏ nhựa trong suốt chống cháy để lộ bảng mạch vàng sang trọng',
    so_cong_dau_ra: '4 cổng: 2 x USB-C, 1 x USB-A và 1 x cổng DC tùy chỉnh điện áp 3.3V-25.2V',
    trong_luong: 0.590,
    che_do_bao_hanh: 'Bảo hành chính hãng 12 tháng'
  },

  // ==========================================
  // 6. LINH KIỆN & NÂNG CẤP (8 sản phẩm)
  // ==========================================
  'samsung-990-pro-2tb': {
    loai_linh_kien: 'Ổ cứng SSD M.2 NVMe PCIe Gen 4x4',
    dung_luong: '2TB (2000GB)',
    toc_do: 'Tốc độ đọc 7.450 MB/s - Ghi 6.900 MB/s',
    toc_do_ngau_nhien: 'Đọc/Ghi ngẫu nhiên 1.400K/1.550K IOPS',
    chuan_giao_tiep: 'M.2 2280 PCIe 4.0 x4, NVMe 2.0',
    do_ben_tbw: '1200 TBW / MTBF 1.5 triệu giờ',
    che_do_bao_hanh: 'Bảo hành chính hãng 5 năm Samsung'
  },
  'kingston-fury-renegade-rgb-32gb': {
    loai_linh_kien: 'Bộ nhớ RAM Desktop DDR5 tản nhiệt nhôm có LED RGB',
    dung_luong: '32GB (2 x 16GB) Dual Channel Kit',
    toc_do_bus: '6000 MHz (Hỗ trợ Intel XMP 3.0 & AMD EXPO)',
    do_tre_cl: 'CL32',
    den_led: 'RGB tùy biến đồng bộ hiệu ứng hồng ngoại Infrared Sync Technology',
    che_do_bao_hanh: 'Bảo hành trọn đời giới hạn (Lifetime Warranty)'
  },
  'gia-do-tan-nhiet-so-lanh-icepro': {
    loai_linh_kien: 'Đế tản nhiệt bán dẫn sò lạnh TEC công suất 30W làm lạnh cấp tốc',
    hieu_qua_giam_nhiet: 'Hạ nhiệt độ bề mặt máy xuống tới 5°C - 10°C trong vòng 3 phút',
    toc_do_quat: 'Quạt tản nhiệt 7 cánh 4200 RPM đèn LED RGB',
    kich_co_laptop_phu_hop: 'Tương thích mọi laptop từ 13 đến 17.3 inch',
    chat_lieu: 'Khung hợp kim nhôm tản nhiệt kết hợp đệm silicon chống trượt',
    trong_luong: 0.650,
    che_do_bao_hanh: 'Bảo hành chính hãng 12 tháng'
  },
  'gia-do-laptop-nhom-ergonomic-360': {
    loai_linh_kien: 'Giá đỡ laptop nhôm CNC xoay 360 độ công thái học',
    chat_lieu: 'Hợp kim nhôm nguyên khối dày 3mm chịu tải trọng tới 12kg',
    tinh_nang_dac_biet: 'Trục xoay bi 360 độ phát tiếng bánh cóc, gập đôi gọn gàng khi di chuyển',
    kich_co_laptop_phu_hop: 'Laptop từ 11 đến 17.3 inch và mọi dòng máy tính bảng',
    kich_thuoc: '260 x 220 x 45 mm',
    trong_luong: 0.850,
    che_do_bao_hanh: 'Bảo hành chính hãng 12 tháng'
  },
  'cpu-intel-core-i9-14900ks-box': {
    loai_linh_kien: 'Bộ vi xử lý máy tính để bàn Intel LGA1700 Special Edition',
    so_nhan_luong: '24 Nhân (8 P-Core + 16 E-Core), 32 Luồng xử lý',
    xung_nhip_toi_da: '6.2 GHz Thermal Velocity Boost',
    bo_nho_dem_cache: '36MB Intel Smart Cache (L3)',
    cong_suat_tdp: 'TDP cơ bản 150W / Tối đa 253W+',
    ho_tro_ram: 'DDR5-5600 / DDR4-3200 lên tới 192GB',
    che_do_bao_hanh: 'Bảo hành chính hãng 36 tháng Intel Box'
  },
  'ssd-wd-black-sn850x-2tb': {
    loai_linh_kien: 'Ổ cứng SSD M.2 NVMe PCIe Gen 4x4 chuyên game',
    dung_luong: '2TB (2000GB)',
    toc_do: 'Tốc độ đọc tuần tự 7.300 MB/s - Ghi tuần tự 6.600 MB/s',
    chuan_giao_tiep: 'M.2 2280 PCIe Gen 4x4 NVMe',
    tinh_nang_dac_biet: 'Chế độ Game Mode 2.0 giảm tải thời gian chờ load game',
    do_ben_tbw: '1200 TBW',
    che_do_bao_hanh: 'Bảo hành chính hãng 5 năm Western Digital'
  },
  'ram-kingston-fury-impact-32gb-ddr5': {
    loai_linh_kien: 'RAM Laptop SODIMM DDR5 Plug N Play',
    dung_luong: '32GB (2 x 16GB) Kit',
    toc_do_bus: '5600 MHz CL40 tự động nhận diện bus cao nhất',
    dien_ap: '1.1V tiết kiệm năng lượng cho pin laptop',
    chuan_giao_tiep: '262-pin SODIMM cho laptop',
    che_do_bao_hanh: 'Bảo hành trọn đời giới hạn chính hãng'
  },
  'keo-tan-nhiet-thermal-grizzly': {
    loai_linh_kien: 'Keo tản nhiệt cao cấp dành cho ép xung và laptop gaming',
    do_dan_nhiet: '14.2 W/mK hiệu quả truyền nhiệt cực đại',
    trong_luong: '2 gram (Kèm 2 đầu gạt dàn mỏng keo chuyên dụng)',
    tinh_nang_dac_biet: 'Không dẫn điện, không gây đoản mạch, ổn định nhiệt độ lâu dài',
    nhiet_do_hoat_dong: '-250 °C đến +350 °C',
    che_do_bao_hanh: 'Chính hãng Thermal Grizzly Germany'
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

// =========================================================================
// THỰC THI CHUẨN HÓA VÀ CẬP NHẬT TRÊN TẤT CẢ CÁC TẦNG DỮ LIỆU
// =========================================================================

// 1. Cập nhật FE/db.json
const dbPath = path.join(__dirname, '../db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let countDb = 0;
dbData.san_pham = dbData.san_pham.map(sp => {
  if (THONG_SO_PHU_KIEN_42[sp.id]) {
    countDb++;
    return {
      ...sp,
      thong_so: THONG_SO_PHU_KIEN_42[sp.id]
    };
  }
  return sp;
});

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log(`[✓] Đã chuẩn hóa thành công ${countDb}/42 sản phẩm phụ kiện trong FE/db.json!`);

// 2. Cập nhật FE/du-lieu/san-pham-bo-sung.js
const boSungPath = path.join(__dirname, '../du-lieu/san-pham-bo-sung.js');
let boSungContent = fs.readFileSync(boSungPath, 'utf8');

let countBoSung = 0;
for (const [id, thongSo] of Object.entries(THONG_SO_PHU_KIEN_42)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"thong_so":\\s*)\\{[\\s\\S]*?\\}`);
  if (regex.test(boSungContent)) {
    countBoSung++;
    boSungContent = boSungContent.replace(regex, `$1${JSON.stringify(thongSo, null, 8)}`);
  }
}
fs.writeFileSync(boSungPath, boSungContent, 'utf8');
console.log(`[✓] Đã chuẩn hóa thành công ${countBoSung} sản phẩm trong FE/du-lieu/san-pham-bo-sung.js!`);

// 3. Cập nhật FE/du-lieu/danh-sach-laptop.js
const danhSachPath = path.join(__dirname, '../du-lieu/danh-sach-laptop.js');
let danhSachContent = fs.readFileSync(danhSachPath, 'utf8');

let countDanhSach = 0;
for (const [id, thongSo] of Object.entries(THONG_SO_PHU_KIEN_42)) {
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"thong_so":\\s*)\\{[\\s\\S]*?\\}`);
  if (regex.test(danhSachContent)) {
    countDanhSach++;
    danhSachContent = danhSachContent.replace(regex, `$1${JSON.stringify(thongSo, null, 6)}`);
  }
}
fs.writeFileSync(danhSachPath, danhSachContent, 'utf8');
console.log(`[✓] Đã chuẩn hóa thành công ${countDanhSach} sản phẩm trong FE/du-lieu/danh-sach-laptop.js!`);
