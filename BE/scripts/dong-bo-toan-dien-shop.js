const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbPath = path.join(__dirname, '..', '..', 'FE', 'db.json');
const laptopJsPath = path.join(__dirname, '..', '..', 'FE', 'du-lieu', 'danh-sach-laptop.js');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Cập nhật danh mục chuẩn cho các sản phẩm hiện có
const categoryMap = {
  'balo-gaming-rog-ranger-18': ['balo-tui-chong-soc', 'phu-kien-gear'],
  'tai-nghe-gaming-aether-pro-71': ['tai-nghe-loa', 'phu-kien-gear'],
  'chuot-gaming-khong-day-pro-air-8': ['chuot-lot-chuot', 'phu-kien-gear'],
  'ban-phim-co-gaming-rgb-pro-switch-red': ['ban-phim-co', 'phu-kien-gear'],
  'cu-sac-gan-anker-140w-pd31': ['sac-cap-hub', 'phu-kien-gear'],
  'gia-do-tan-nhiet-so-lanh-icepro': ['de-tan-gia-do', 'phu-kien-gear'],
  'ssd-samsung-990-pro-2tb': ['linh-kien-nang-cap', 'linh-kien'],
  'ram-kingston-fury-beast-32gb-ddr5': ['linh-kien-nang-cap', 'linh-kien']
};

db.san_pham.forEach(sp => {
  if (categoryMap[sp.id]) {
    sp.danh_muc = categoryMap[sp.id];
  }
});

// 2. 5 Sản phẩm công nghệ cao cấp mới
const newTechProducts = [
  {
    id: 'lot-chuot-gaming-speed-rgb-xxl',
    ma_san_pham: 'PAD-SPEED-RGB',
    ten_san_pham: 'Lót Chuột Gaming Speed RGB XXL 900x400mm - Bề Mặt Vải Micro-Weave Chống Nước',
    hang_san_xuat: 'razer',
    danh_muc: ['chuot-lot-chuot', 'phu-kien-gear'],
    gia_goc: 690000,
    gia_khuyen_mai: 490000,
    phan_tram_giam_gia: 29,
    hinh_anh_chinh: '/images/sp/lot_chuot_gaming_rgb.jpg',
    thu_vien_hinh_anh: ['/images/sp/lot_chuot_gaming_rgb.jpg'],
    thong_so: {
      cpu: '900 x 400mm',
      ram: 'Vải Speed Micro',
      o_cung: 'LED RGB 14 Mode',
      trong_luong: 0.65,
      dung_luong_pin: 'Đáy cao su 4mm',
      che_do_bao_hanh: 'BH 12 tháng chính hãng'
    },
    dac_diem_noi_bat: ['Kích thước siêu lớn 900x400mm bao trọn bàn phím và chuột', 'Sợi dệt siêu mịn Micro-Weave tối ưu cho mắt đọc quang học', 'Viền LED RGB phát sáng 14 chế độ chuyển màu gaming'],
    mo_ta_chi_tiet: 'Bàn di chuột gaming khổ lớn chuyên dụng cho game thủ FPS và thiết kế đồ họa.',
    con_hang: true,
    so_luong_ton_kho: 60,
    so_luong_da_ban: 320,
    diem_danh_gia_tb: 4.9,
    so_luong_danh_gia: 78,
    la_flash_sale: true,
    la_ban_chay: true,
    la_san_pham_moi: true,
    ho_tro_tra_gop_0_phan_tram: false
  },
  {
    id: 'gia-do-laptop-nhom-ergonomic-360',
    ma_san_pham: 'STD-ERGO-360',
    ten_san_pham: 'Giá Đỡ Laptop Nhôm CNC Công Thái Học Ergonomic Stand 360 - Xoay 360 Độ Gập Gọn',
    hang_san_xuat: 'moft',
    danh_muc: ['de-tan-gia-do', 'phu-kien-gear'],
    gia_goc: 990000,
    gia_khuyen_mai: 690000,
    phan_tram_giam_gia: 30,
    hinh_anh_chinh: '/images/sp/gia_do_laptop_360.jpg',
    thu_vien_hinh_anh: ['/images/sp/gia_do_laptop_360.jpg'],
    thong_so: {
      cpu: 'Nhôm CNC phay',
      ram: 'Xoay 360 độ',
      o_cung: 'Chịu lực 10kg',
      trong_luong: 0.95,
      dung_luong_pin: 'Laptop 10-18 inch',
      che_do_bao_hanh: 'BH 24 tháng chính hãng'
    },
    dac_diem_noi_bat: ['Đế xoay 360 độ phát ra tiếng click cơ học cực kỳ thỏa mãn', 'Chất liệu hợp kim nhôm hàng không CNC phay xước cao cấp', 'Nâng cao màn hình ngang tầm mắt chống mỏi cổ vai gáy'],
    mo_ta_chi_tiet: 'Giá đỡ laptop công thái học cao cấp cho góc làm việc chuyên nghiệp.',
    con_hang: true,
    so_luong_ton_kho: 45,
    so_luong_da_ban: 195,
    diem_danh_gia_tb: 4.9,
    so_luong_danh_gia: 42,
    la_flash_sale: false,
    la_ban_chay: true,
    la_san_pham_moi: true,
    ho_tro_tra_gop_0_phan_tram: true
  },
  {
    id: 'hub-chuyen-doi-typec-10in1-hyperdrive',
    ma_san_pham: 'HUB-10IN1-PRO',
    ten_san_pham: 'Cáp Chuyển Đổi Type-C Hub 10-in-1 HyperDrive PRO - Xuất 4K 60Hz, Sạc PD 100W, Gigabit LAN',
    hang_san_xuat: 'anker',
    danh_muc: ['sac-cap-hub', 'phu-kien-gear'],
    gia_goc: 1890000,
    gia_khuyen_mai: 1390000,
    phan_tram_giam_gia: 26,
    hinh_anh_chinh: '/images/sp/hub_typec_10in1.jpg',
    thu_vien_hinh_anh: ['/images/sp/hub_typec_10in1.jpg'],
    thong_so: {
      cpu: '10 Cổng kết nối',
      ram: 'HDMI 4K 60Hz',
      o_cung: 'Sạc PD 100W',
      trong_luong: 0.18,
      dung_luong_pin: 'LAN 1Gbps',
      che_do_bao_hanh: 'BH 24 tháng 1 đổi 1'
    },
    dac_diem_noi_bat: ['Mở rộng 10 cổng: HDMI 4K60Hz, 3x USB 3.2, SD/TF, LAN RJ45, Audio, PD 100W', 'Vỏ nhôm nguyên khối Space Gray tản nhiệt siêu tốc', 'Tương thích hoàn hảo MacBook M-Series, Dell XPS, ThinkPad'],
    mo_ta_chi_tiet: 'Trạm kết nối đa năng tất cả trong 1 cho laptop hiện đại.',
    con_hang: true,
    so_luong_ton_kho: 35,
    so_luong_da_ban: 168,
    diem_danh_gia_tb: 4.8,
    so_luong_danh_gia: 36,
    la_flash_sale: true,
    la_ban_chay: true,
    la_san_pham_moi: true,
    ho_tro_tra_gop_0_phan_tram: true
  },
  {
    id: 'cpu-intel-core-i9-14900ks-box',
    ma_san_pham: 'CPU-I9-14900KS',
    ten_san_pham: 'Vi Xử Lý Intel Core i9-14900KS Special Edition (24 Nhân 32 Luồng | Up to 6.2GHz | 36MB Cache)',
    hang_san_xuat: 'intel',
    danh_muc: ['linh-kien-nang-cap', 'linh-kien'],
    gia_goc: 18990000,
    gia_khuyen_mai: 16490000,
    phan_tram_giam_gia: 13,
    hinh_anh_chinh: '/images/sp/cpu_intel_i9_14900ks.jpg',
    thu_vien_hinh_anh: ['/images/sp/cpu_intel_i9_14900ks.jpg'],
    thong_so: {
      cpu: 'Max 6.2 GHz',
      ram: '24 Nhân 32 Luồng',
      o_cung: '36MB SmartCache',
      trong_luong: 0.15,
      dung_luong_pin: 'LGA1700 150W',
      che_do_bao_hanh: 'BH 36 tháng chính hãng'
    },
    dac_diem_noi_bat: ['Xung nhịp phá kỷ lục thế giới lên tới 6.2GHz xuất xưởng', '24 nhân kiến trúc Raptor Lake Refresh (8 P-core + 16 E-core)', 'Hộp Special Edition polygon pha lê cực kỳ đẳng cấp'],
    mo_ta_chi_tiet: 'Bộ vi xử lý desktop mạnh nhất hành tinh cho máy trạm và gaming đỉnh cao.',
    con_hang: true,
    so_luong_ton_kho: 15,
    so_luong_da_ban: 64,
    diem_danh_gia_tb: 5.0,
    so_luong_danh_gia: 22,
    la_flash_sale: false,
    la_ban_chay: true,
    la_san_pham_moi: true,
    ho_tro_tra_gop_0_phan_tram: true
  },
  {
    id: 'tui-chong-soc-tomtoc-defender',
    ma_san_pham: 'BAG-TOMTOC-360',
    ten_san_pham: 'Túi Chống Sốc Laptop Tomtoc Defender 360 Chống Rơi Vỡ Góc Chuẩn Quân Đội Mỹ',
    hang_san_xuat: 'tomtoc',
    danh_muc: ['balo-tui-chong-soc', 'phu-kien-gear'],
    gia_goc: 950000,
    gia_khuyen_mai: 720000,
    phan_tram_giam_gia: 24,
    hinh_anh_chinh: '/images/sp/tui_chong_soc_tomtoc.jpg',
    thu_vien_hinh_anh: ['/images/sp/tui_chong_soc_tomtoc.jpg'],
    thong_so: {
      cpu: 'CornerArmor 360',
      ram: 'Khóa kéo YKK',
      o_cung: 'Cho máy 14-16"',
      trong_luong: 0.35,
      dung_luong_pin: 'Vải Cordura kháng nước',
      che_do_bao_hanh: 'BH 12 tháng chính hãng'
    },
    dac_diem_noi_bat: ['Công nghệ đệm góc CornerArmor chống sốc đạt chuẩn rơi tự do quân sự Mỹ', 'Vải Cordura cao cấp chống mài mòn và kháng nước vượt trội', 'Khóa kéo YKK Nhật Bản trơn tru bền bỉ theo thời gian'],
    mo_ta_chi_tiet: 'Túi chống sốc số 1 thế giới bảo vệ máy tính đắt tiền an toàn tuyệt đối.',
    con_hang: true,
    so_luong_ton_kho: 40,
    so_luong_da_ban: 240,
    diem_danh_gia_tb: 4.9,
    so_luong_danh_gia: 65,
    la_flash_sale: false,
    la_ban_chay: true,
    la_san_pham_moi: true,
    ho_tro_tra_gop_0_phan_tram: false
  }
];

// 3. Chuẩn hóa và làm giàu dữ liệu toàn diện cho TẤT CẢ sản phẩm
const danhSachKhoChuan = [
  {
    ten_chi_nhanh: 'TNTP Flagship Store - Thái Hà, Đống Đa, Hà Nội',
    dia_chi: 'Số 158 Phố Thái Hà, P. Trung Liệt, Q. Đống Đa, Hà Nội',
    so_dien_thoai: '0968.123.456',
    so_luong_con: 5
  },
  {
    ten_chi_nhanh: 'TNTP Premium Center - Q.10, TP. Hồ Chí Minh',
    dia_chi: 'Số 284 Cao Thắng, Phường 12, Quận 10, TP. Hồ Chí Minh',
    so_dien_thoai: '0978.888.999',
    so_luong_con: 6
  },
  {
    ten_chi_nhanh: 'TNTP Hub Đà Nẵng - Q. Hải Châu, Đà Nẵng',
    dia_chi: 'Số 79 Nguyễn Văn Linh, P. Phước Ninh, Q. Hải Châu, Đà Nẵng',
    so_dien_thoai: '0981.555.666',
    so_luong_con: 3
  }
];

const productEnrichment = {
  'tai-nghe-gaming-aether-pro-71': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-den', ten_tuy_chon: 'Đen Huyền Bí (Matte Black)', chenh_lech_gia: 0, hinh_anh: '/images/sp/tai_nghe_gaming_pro_v8.jpg' },
      { ma_tuy_chon: 'opt-trang', ten_tuy_chon: 'Trắng Băng Tuyết (Ice White)', chenh_lech_gia: 100000, hinh_anh: '/images/sp/tai_nghe_gaming_white.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/tai_nghe_gaming_pro_v8.jpg',
      '/images/sp/tai_nghe_gaming_white.jpg',
      '/images/sp/tai_nghe_gaming_cushion.jpg',
      '/images/sp/tai_nghe_gaming_pro_v7.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Giá treo tai nghe kim loại RGB TNTP Gaming cao cấp', gia_tri: 350000 },
      { ten_qua_tang: 'Túi da đựng tai nghe du lịch chống sốc chuyên dụng', gia_tri: 250000 },
      { ten_qua_tang: 'Cáp sạc Type-C bọc dù siêu bền 1.5m', gia_tri: 120000 }
    ],
    thong_so: {
      cpu: 'Màng loa Graphene 50mm Hi-Res',
      card_do_hoa: 'Âm vòm 7.1 Spatial Surround',
      ram: 'Độ trễ siêu thấp 15ms Lightspeed',
      o_cung: 'Pin 60 giờ liên tục',
      man_hinh: 'Đệm tai Memory Foam bọc da Protein',
      tan_so_quet: 0,
      trong_luong: 0.26,
      dung_luong_pin: '1000mAh (Sử dụng 60 giờ)',
      che_do_bao_hanh: 'BH 24 tháng chính hãng, 1 đổi 1 trong 30 ngày',
      cong_ket_noi: ['Không dây 2.4GHz Lightspeed', 'Bluetooth 5.3', 'Jack 3.5mm Audio', 'Type-C sạc'],
      chuan_wifi_bluetooth: 'Bluetooth 5.3 & Wireless 2.4GHz USB Dongle',
      he_dieu_hanh: 'Tương thích Windows 11, macOS, Android, iOS, PS5, Switch',
      chat_lieu_vo: 'Khung nhôm hàng không siêu nhẹ & nhựa ABS cao cấp'
    },
    dac_diem_noi_bat: [
      'Màng loa Graphene 50mm thế hệ mới tái hiện âm trường vòm 7.1 siêu chân thực',
      'Công nghệ kết nối kép Lightspeed 2.4GHz không độ trễ và Bluetooth 5.3 đa thiết bị',
      'Thời lượng pin khủng tới 60 giờ, sạc nhanh 15 phút nghe thêm 6 giờ',
      'Micro khử ồn công nghệ AI lọc tạp âm giọng nói chuẩn phòng thu đàm thoại cực nét'
    ],
    mo_ta_chi_tiet: 'Tai nghe gaming không dây cao cấp Aether Pro 7.1 mang tới trải nghiệm âm thanh chiến trường tuyệt đỉnh, định vị bước chân đối thủ với độ chính xác đến từng centimet.'
  },
  'chuot-gaming-pro-air-8': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-den', ten_tuy_chon: 'Đen Carbon Siêu Nhẹ 49g', chenh_lech_gia: 0, hinh_anh: '/images/sp/gaming_mouse_wireless.jpg' },
      { ma_tuy_chon: 'opt-trang', ten_tuy_chon: 'Trắng Superlight Edition', chenh_lech_gia: 100000, hinh_anh: '/images/sp/mouse_wireless.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/gaming_mouse_wireless.jpg',
      '/images/sp/mouse_wireless.jpg',
      '/images/sp/mouse_wide_v2.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Bộ Feet chuột 100% PTFE bo cong siêu lướt dự phòng', gia_tri: 150000 },
      { ten_qua_tang: 'Bộ Grip Tape chống trượt dán thân chuột cao cấp', gia_tri: 150000 },
      { ten_qua_tang: 'Túi nhung bảo quản chuột khi di chuyển', gia_tri: 80000 }
    ],
    thong_so: {
      cpu: 'Cảm biến PAW3395 26.000 DPI',
      card_do_hoa: 'Polling Rate 8.000Hz (0.125ms)',
      ram: 'Trọng lượng siêu nhẹ chỉ 49g',
      o_cung: 'Pin sạc Li-po 90 giờ',
      man_hinh: 'Switch quang học Omron 100 triệu lần click',
      tan_so_quet: 0,
      trong_luong: 0.049,
      dung_luong_pin: 'Pin sạc 400mAh dùng 90 giờ',
      che_do_bao_hanh: 'BH 24 tháng chính hãng, 1 đổi 1 trong 30 ngày',
      cong_ket_noi: ['Wireless 2.4GHz 8K Dongle', 'Bluetooth 5.3', 'Type-C dây bện Paracord'],
      chuan_wifi_bluetooth: 'Wireless 2.4GHz 8K & Bluetooth 5.3',
      he_dieu_hanh: 'Windows 10/11, macOS, Linux',
      chat_lieu_vo: 'Nhựa Composite siêu bền bề mặt phủ UV chống bóng mồ hôi'
    }
  },
  'ban-phim-co-custom-glyph-75': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-red', ten_tuy_chon: 'Gateron G Pro Red (Linear êm ái)', chenh_lech_gia: 0, hinh_anh: '/images/sp/gaming_keyboard_rgb.jpg' },
      { ma_tuy_chon: 'opt-brown', ten_tuy_chon: 'Gateron G Pro Brown (Tactile khấc bấm)', chenh_lech_gia: 50000, hinh_anh: '/images/sp/keyboard_rgb.jpg' },
      { ma_tuy_chon: 'opt-yellow', ten_tuy_chon: 'KTT Cabbage Tofu Lube sẵn (Âm clack đầm)', chenh_lech_gia: 150000, hinh_anh: '/images/sp/keyboard_wide_v2.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/gaming_keyboard_rgb.jpg',
      '/images/sp/keyboard_rgb.jpg',
      '/images/sp/keyboard_wide_v2.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Kẹp nhổ Switch & Keycap kim loại 2-in-1 CNC', gia_tri: 120000 },
      { ten_qua_tang: 'Bộ 4 Switch dự phòng chính hãng bôi trơn Krytox', gia_tri: 100000 },
      { ten_qua_tang: 'Khăn phủ bàn phím chống bụi cao cấp', gia_tri: 60000 }
    ],
    thong_so: {
      cpu: 'Mạch Hotswap 5-Pin RGB từng phím',
      card_do_hoa: 'Cấu trúc Gasket Mount 5 lớp tiêu âm',
      ram: 'Keycap PBT Double-shot Cherry Profile',
      o_cung: 'Pin dung lượng khủng 4.000mAh',
      man_hinh: 'Màn hình OLED 0.96 inch hiển thị thông số',
      tan_so_quet: 0,
      trong_luong: 0.95,
      dung_luong_pin: '4.000mAh (Dùng 200 giờ tắt LED)',
      che_do_bao_hanh: 'BH 24 tháng chính hãng, 1 đổi 1 trong 30 ngày',
      cong_ket_noi: ['Type-C bọc dù rời', 'Wireless 2.4GHz', 'Bluetooth 5.2 (3 thiết bị)'],
      chuan_wifi_bluetooth: 'Bluetooth 5.2 & Wireless 2.4GHz',
      he_dieu_hanh: 'Windows, macOS (Hỗ trợ nút chuyển layout), iOS, Android',
      chat_lieu_vo: 'Vỏ nhôm Anode CNC nguyên khối cao cấp'
    }
  },
  'balo-gaming-rog-ranger-18': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-den', ten_tuy_chon: 'Bản Đen ROG Cybertext 18 inch', chenh_lech_gia: 0, hinh_anh: '/images/sp/balo_gaming_rog_v8.jpg' },
      { ma_tuy_chon: 'opt-moonlight', ten_tuy_chon: 'Bản Moonlight White Giới Hạn', chenh_lech_gia: 200000, hinh_anh: '/images/sp/balo_gaming_rog_v7.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/balo_gaming_rog_v8.jpg',
      '/images/sp/balo_gaming_rog_v7.jpg',
      '/images/sp/balo_gaming_rog.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Khóa số chống trộm an ninh chuẩn TSA cao cấp', gia_tri: 180000 },
      { ten_qua_tang: 'Áo trùm mưa balo phản quang chuyên dụng', gia_tri: 120000 }
    ],
    thong_so: {
      cpu: 'Chứa máy màn hình khủng tới 18 inch',
      card_do_hoa: 'Vải Polyester 1680D kháng nước tuyệt đối',
      ram: 'Dung tích chứa đồ 36 Lít',
      o_cung: 'Khóa kéo YKK chống rạch trộm',
      man_hinh: 'Đệm lưng êm ái thoáng khí Air-mesh',
      tan_so_quet: 0,
      trong_luong: 1.25,
      dung_luong_pin: 'Kháng nước chuẩn IPX4',
      che_do_bao_hanh: 'BH 36 tháng chính hãng',
      cong_ket_noi: ['Cổng USB tích hợp sạc nhanh ra ngoài'],
      chuan_wifi_bluetooth: 'Không dây',
      he_dieu_hanh: 'Tương thích mọi loại laptop 14 - 18 inch',
      chat_lieu_vo: 'Vải dù Polyester 1680D & da PU chống thấm'
    }
  },
  'gia-do-tan-nhiet-so-lanh-icepro': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-den', ten_tuy_chon: 'Màu Đen RGB Gaming', chenh_lech_gia: 0, hinh_anh: '/images/sp/gia_do_tan_nhiet_v8.jpg' },
      { ma_tuy_chon: 'opt-bac', ten_tuy_chon: 'Màu Bạc Titan Pro', chenh_lech_gia: 50000, hinh_anh: '/images/sp/gia_do_tan_nhiet_v7.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/gia_do_tan_nhiet_v8.jpg',
      '/images/sp/gia_do_tan_nhiet_v7.jpg',
      '/images/sp/gia_do_laptop_360_v8.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Cáp nguồn Type-C 100W bện bọc dù siêu bền', gia_tri: 150000 },
      { ten_qua_tang: 'Củ sạc nhanh 30W cấp nguồn độc lập sò lạnh', gia_tri: 250000 }
    ],
    thong_so: {
      cpu: 'Sò lạnh bán dẫn công suất 35W cực đại',
      card_do_hoa: 'Quạt hút ly tâm 4.500 RPM êm ái',
      ram: 'Hạ nhiệt độ CPU/GPU tức thì 20°C',
      o_cung: 'LED RGB Aura Sync 12 chế độ',
      man_hinh: 'Màn hình LED hiển thị nhiệt độ mặt tiếp xúc',
      tan_so_quet: 0,
      trong_luong: 0.75,
      dung_luong_pin: 'Cấp nguồn qua cổng Type-C 9V/12V',
      che_do_bao_hanh: 'BH 12 tháng 1 đổi 1 chính hãng',
      cong_ket_noi: ['Cổng Type-C nguồn vào', 'Cổng USB 3.0 mở rộng'],
      chuan_wifi_bluetooth: 'Không',
      he_dieu_hanh: 'Tương thích mọi laptop từ 13 đến 18 inch',
      chat_lieu_vo: 'Hợp kim nhôm dẫn nhiệt & nhựa nhiệt dẻo Polycarbonate'
    }
  },
  'cu-sac-gan-anker-140w-pd31': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-den', ten_tuy_chon: 'Màu Đen Anker Phantom', chenh_lech_gia: 0, hinh_anh: '/images/sp/cu_sac_gan_140w_v8.jpg' },
      { ma_tuy_chon: 'opt-bac', ten_tuy_chon: 'Màu Bạc Kim Loại Prime', chenh_lech_gia: 50000, hinh_anh: '/images/sp/cu_sac_gan_140w_v7.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/cu_sac_gan_140w_v8.jpg',
      '/images/sp/cu_sac_gan_140w_v7.jpg',
      '/images/sp/cu_sac_gan_140w.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Cáp sạc Anker Type-C 240W PD 3.1 bọc sợi sinh học dài 1.8m', gia_tri: 350000 },
      { ten_qua_tang: 'Bao da bảo vệ củ sạc chống trầy xước du lịch', gia_tri: 100000 }
    ],
    thong_so: {
      cpu: 'Công suất đỉnh 140W chuẩn PD 3.1',
      card_do_hoa: 'Công nghệ GaNPrime thế hệ mới nhất',
      ram: 'Phân bổ điện thông minh PowerIQ 4.0',
      o_cung: 'Kiểm soát nhiệt độ ActiveShield 2.0',
      man_hinh: '3 Cổng (2 Type-C + 1 USB-A sạc cùng lúc 3 máy)',
      tan_so_quet: 0,
      trong_luong: 0.28,
      dung_luong_pin: 'Điện áp 100-240V toàn cầu',
      che_do_bao_hanh: 'BH 24 tháng 1 đổi 1 chính hãng Anker',
      cong_ket_noi: ['2 Cổng USB-C 140W Max', '1 Cổng USB-A 22.5W'],
      chuan_wifi_bluetooth: 'Không',
      he_dieu_hanh: 'Sạc đầy đủ MacBook Pro 16, Dell XPS, Gaming, iPhone, iPad',
      chat_lieu_vo: 'Nhựa chống cháy tiêu chuẩn V0 kết hợp khung viền kim loại'
    }
  },
  'lot-chuot-gaming-speed-rgb-xxl': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-speed', ten_tuy_chon: 'Bề mặt Vải Speed Siêu Mịn', chenh_lech_gia: 0, hinh_anh: '/images/sp/lot_chuot_gaming_rgb_v8.jpg' },
      { ma_tuy_chon: 'opt-control', ten_tuy_chon: 'Bề mặt Vải Control Dày 4mm', chenh_lech_gia: 50000, hinh_anh: '/images/sp/lot_chuot_gaming_rgb_v7.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/lot_chuot_gaming_rgb_v8.jpg',
      '/images/sp/lot_chuot_gaming_rgb_v7.jpg',
      '/images/sp/lot_chuot_gaming_rgb.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Cáp sạc Type-C cấp nguồn LED bọc dù siêu bền 2m', gia_tri: 80000 },
      { ten_qua_tang: 'Khăn lau vệ sinh bề mặt vải micro-fiber', gia_tri: 40000 }
    ],
    thong_so: {
      cpu: 'Kích thước siêu khủng 900 x 400 mm',
      card_do_hoa: 'Viền LED quang học RGB 14 chế độ sáng',
      ram: 'Bề mặt sợi dệt Micro-Weave chống nước',
      o_cung: 'Đế cao su tự nhiên chống trượt 4mm',
      man_hinh: 'Độ dày đệm êm tay 4.0mm',
      tan_so_quet: 0,
      trong_luong: 0.65,
      dung_luong_pin: 'Cấp nguồn qua cổng Type-C 5V',
      che_do_bao_hanh: 'BH 12 tháng chính hãng',
      cong_ket_noi: ['Cổng Type-C nguồn LED RGB'],
      chuan_wifi_bluetooth: 'Không',
      he_dieu_hanh: 'Tương thích tất cả các loại mắt đọc chuột quang học / laser',
      chat_lieu_vo: 'Vải Microfiber phủ lớp Nano chống tràn nước'
    }
  },
  'gia-do-laptop-nhom-ergonomic-360': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-bac', ten_tuy_chon: 'Màu Bạc Nhôm Apple Silver', chenh_lech_gia: 0, hinh_anh: '/images/sp/gia_do_laptop_360_v8.jpg' },
      { ma_tuy_chon: 'opt-xam', ten_tuy_chon: 'Màu Xám Không Gian Space Gray', chenh_lech_gia: 50000, hinh_anh: '/images/sp/gia_do_laptop_360_v7.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/gia_do_laptop_360_v8.jpg',
      '/images/sp/gia_do_laptop_360_v7.jpg',
      '/images/sp/gia_do_laptop_360.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Túi nỉ bảo quản chống trầy gấp gọn du lịch', gia_tri: 120000 },
      { ten_qua_tang: 'Cờ lê lục giác mini cân chỉnh độ cứng khớp xoay', gia_tri: 30000 }
    ],
    thong_so: {
      cpu: 'Trục bi xoay 360 độ phát ra tiếng click cơ học',
      card_do_hoa: 'Khả năng chịu lực cực đại 10kg',
      ram: 'Góc nghiêng tùy biến 0 - 180 độ',
      o_cung: 'Đệm cao su Silicone chống trầy toàn diện',
      man_hinh: 'Nâng chiều cao màn hình ngang tầm mắt công thái học',
      tan_so_quet: 0,
      trong_luong: 0.98,
      dung_luong_pin: 'Không dùng điện',
      che_do_bao_hanh: 'BH 24 tháng 1 đổi 1 chính hãng',
      cong_ket_noi: ['Không'],
      chuan_wifi_bluetooth: 'Không',
      he_dieu_hanh: 'Phù hợp tất cả laptop từ 10 đến 17.3 inch và iPad Pro',
      chat_lieu_vo: '100% Nhôm nguyên khối cắt CNC anodize siêu mịn'
    }
  },
  'hub-chuyen-doi-typec-10in1-hyperdrive': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-xam', ten_tuy_chon: 'Xám Space Gray Chuẩn MacBook', chenh_lech_gia: 0, hinh_anh: '/images/sp/hub_typec_10in1_v8.jpg' },
      { ma_tuy_chon: 'opt-bac', ten_tuy_chon: 'Bạc Silver Phù Hợp Dell XPS', chenh_lech_gia: 0, hinh_anh: '/images/sp/hub_typec_10in1_v7.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/hub_typec_10in1_v8.jpg',
      '/images/sp/hub_typec_10in1_v7.jpg',
      '/images/sp/hub_typec_10in1.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Túi nỉ chống sốc bảo quản trạm kết nối', gia_tri: 100000 },
      { ten_qua_tang: 'Nắp bọc đầu cáp Type-C chống bụi oxy hóa', gia_tri: 30000 }
    ],
    thong_so: {
      cpu: '10 Cổng kết nối siêu đa năng tất cả trong 1',
      card_do_hoa: 'Xuất hình HDMI 4K@60Hz HDR Ultra HD',
      ram: 'Sạc nhanh xuyên qua Power Delivery 100W',
      o_cung: 'Mạng LAN Gigabit RJ45 tốc độ 1.000 Mbps',
      man_hinh: 'Khe đọc thẻ SD & MicroSD UHS-I tốc độ 104MB/s',
      tan_so_quet: 0,
      trong_luong: 0.18,
      dung_luong_pin: 'Tản nhiệt thụ động qua vỏ nhôm nguyên khối',
      che_do_bao_hanh: 'BH 24 tháng 1 đổi 1 chính hãng',
      cong_ket_noi: ['HDMI 4K 60Hz', 'USB-C PD 100W', '3x USB-A 3.2 5Gbps', 'LAN RJ45 1Gbps', 'SD/TF Card', 'Jack Audio 3.5mm'],
      chuan_wifi_bluetooth: 'Cáp Type-C cắm trực tiếp',
      he_dieu_hanh: 'Tương thích macOS, Windows, iPadOS, ChromeOS, Android',
      chat_lieu_vo: 'Hợp kim nhôm nguyên khối Space Gray tản nhiệt siêu tốc'
    }
  },
  'cpu-intel-core-i9-14900ks-box': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-box', ten_tuy_chon: 'Hộp Special Edition Pha Lê', chenh_lech_gia: 0, hinh_anh: '/images/sp/cpu_intel_i9_14900ks_v8.jpg' },
      { ma_tuy_chon: 'opt-tray', ten_tuy_chon: 'Bản Tray Tinh Gọn Tiết Kiệm', chenh_lech_gia: -500000, hinh_anh: '/images/sp/cpu_intel_i9_14900ks_v7.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/cpu_intel_i9_14900ks_v8.jpg',
      '/images/sp/cpu_intel_i9_14900ks_v7.jpg',
      '/images/sp/cpu_intel_i9_14900ks.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Keo tản nhiệt cao cấp Thermal Grizzly Kryonaut Extreme 2g', gia_tri: 390000 },
      { ten_qua_tang: 'Khung chống uốn cong CPU Thermalright LGA1700 BCF kim loại CNC', gia_tri: 250000 }
    ],
    thong_so: {
      cpu: 'Xung nhịp Turbo kỷ lục lên tới 6.2 GHz',
      card_do_hoa: 'Đồ họa tích hợp Intel UHD Graphics 770',
      ram: 'Hỗ trợ DDR5-5600 / DDR4-3200 tối đa 192GB',
      o_cung: '36MB Intel Smart Cache + 32MB L2 Cache',
      man_hinh: '24 Nhân (8 P-Core hiệu năng + 16 E-Core tiết kiệm) 32 Luồng',
      tan_so_quet: 0,
      trong_luong: 0.15,
      dung_luong_pin: 'TDP 150W (Max Turbo Power 253W)',
      che_do_bao_hanh: 'BH 36 tháng chính hãng Intel Việt Nam',
      cong_ket_noi: ['Socket LGA1700', 'PCIe 5.0 x16 / PCIe 4.0 x4'],
      chuan_wifi_bluetooth: 'Hỗ trợ Wi-Fi 7 CNVi',
      he_dieu_hanh: 'Windows 11 / Windows 10 / Linux',
      chat_lieu_vo: 'Hộp polygon pha lê đặc biệt dành riêng cho bản Special Edition'
    }
  },
  'tui-chong-soc-tomtoc-defender': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-14', ten_tuy_chon: 'Kích cỡ 13.5 - 14.2 inch (Xám Đậm)', chenh_lech_gia: 0, hinh_anh: '/images/sp/tui_chong_soc_tomtoc.jpg' },
      { ma_tuy_chon: 'opt-16', ten_tuy_chon: 'Kích cỡ 15.6 - 16.0 inch (Đen Nhám)', chenh_lech_gia: 60000, hinh_anh: '/images/sp/tui_chong_soc_tomtoc.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/tui_chong_soc_tomtoc.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Dây đeo vai đệm khí chống mỏi Ergonomic chính hãng Tomtoc', gia_tri: 220000 },
      { ten_qua_tang: 'Túi nhỏ đựng củ sạc và chuột không dây đồng bộ', gia_tri: 150000 }
    ],
    thong_so: {
      cpu: 'Công nghệ đệm góc CornerArmor chống rơi vỡ chuẩn quân sự',
      card_do_hoa: 'Vải dù Cordura quân đội chống thấm và chống rách mài mòn',
      ram: 'Khóa kéo YKK Nhật Bản trơn tru tuổi thọ trên 50.000 lần kéo',
      o_cung: 'Lớp lót nhung mềm mại dày 360 độ chống xước thân máy',
      man_hinh: 'Ngăn phụ thông minh chứa phụ kiện sạc cáp bút',
      tan_so_quet: 0,
      trong_luong: 0.35,
      dung_luong_pin: 'Kháng nước chuẩn quân đội',
      che_do_bao_hanh: 'BH 12 tháng khóa kéo và đường may chính hãng',
      cong_ket_noi: ['Quai xách da PU cao cấp', 'Dây đeo vai có thể tháo rời'],
      chuan_wifi_bluetooth: 'Không',
      he_dieu_hanh: 'Tương thích mọi dòng MacBook Air/Pro, Dell XPS, ThinkPad',
      chat_lieu_vo: 'Vải tái chế Cordura 100% thân thiện môi trường'
    }
  },
  'samsung-990-pro-2tb': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-no-heat', ten_tuy_chon: 'Bản Tiêu Chuẩn (Không Heatsink)', chenh_lech_gia: 0, hinh_anh: '/images/sp/samsung_990_ssd.jpg' },
      { ma_tuy_chon: 'opt-heatsink', ten_tuy_chon: 'Bản Tản Nhiệt Nhôm Heatsink Chuyên Game', chenh_lech_gia: 300000, hinh_anh: '/images/sp/990_ssd.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/samsung_990_ssd.jpg',
      '/images/sp/990_ssd.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Bộ tản nhiệt nhôm đồng heatsink M.2 PCIe 4.0 cao cấp', gia_tri: 250000 },
      { ten_qua_tang: 'Vít bắt SSD và tua vít từ tính chuyên dụng', gia_tri: 50000 }
    ],
    thong_so: {
      cpu: 'Tốc độ đọc tuần tự khủng 7.450 MB/s',
      card_do_hoa: 'Tốc độ ghi tuần tự 6.900 MB/s',
      ram: 'Dung lượng 2TB (2000GB)',
      o_cung: 'Chuẩn giao tiếp PCIe Gen 4.0 x4, NVMe 2.0',
      man_hinh: 'Đọc/Ghi ngẫu nhiên lên tới 1.400K / 1.550K IOPS',
      tan_so_quet: 0,
      trong_luong: 0.009,
      dung_luong_pin: 'Độ bền ghi 1.200 TBW',
      che_do_bao_hanh: 'BH 60 tháng (5 năm) chính hãng 1 đổi 1',
      cong_ket_noi: ['Khe cắm M.2 2280'],
      chuan_wifi_bluetooth: 'Không',
      he_dieu_hanh: 'Tương thích PC, Laptop Gaming và nâng cấp bộ nhớ PS5',
      chat_lieu_vo: 'Nhãn đồng tản nhiệt Niken cao cấp Dynamic Thermal Guard'
    }
  },
  'kingston-fury-renegade-rgb-32gb': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-6000', ten_tuy_chon: 'Kit 32GB (2x16GB) Bus 6000MHz CL32', chenh_lech_gia: 0, hinh_anh: '/images/sp/kingston_fury_ram.jpg' },
      { ma_tuy_chon: 'opt-6400', ten_tuy_chon: 'Kit 32GB (2x16GB) Bus 6400MHz CL32', chenh_lech_gia: 250000, hinh_anh: '/images/sp/fury_ram.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/kingston_fury_ram.jpg',
      '/images/sp/fury_ram.jpg'
    ],
    qua_tang: [
      { ten_qua_tang: 'Áo thun Kingston FURY Gaming phiên bản giới hạn', gia_tri: 250000 },
      { ten_qua_tang: 'Gói hỗ trợ lắp đặt & Overclock tinh chỉnh timing tại showroom', gia_tri: 200000 }
    ],
    thong_so: {
      cpu: 'Dung lượng 32GB (Kit 2 thanh 16GB)',
      card_do_hoa: 'Chuẩn DDR5 tốc độ cực cao 6000MHz',
      ram: 'Độ trễ thấp CL32 tối ưu cho Gaming và Render',
      o_cung: 'Tương thích Intel XMP 3.0 & AMD EXPO ép xung tự động 1-click',
      man_hinh: 'Đèn LED RGB 16.8 triệu màu công nghệ Infrared Sync độc quyền',
      tan_so_quet: 0,
      trong_luong: 0.12,
      dung_luong_pin: 'Điện áp 1.35V tiết kiệm điện',
      che_do_bao_hanh: 'BH trọn đời chính hãng (Lifetime Warranty)',
      cong_ket_noi: ['Chân cắm DDR5 DIMM 288-pin'],
      chuan_wifi_bluetooth: 'Không',
      he_dieu_hanh: 'Tương thích toàn bộ Mainboard Intel Z790/B760 và AMD X670/B650',
      chat_lieu_vo: 'Tản nhiệt nhôm đen tuyền họa tiết cắt vân góc cạnh hầm hố'
    }
  },
  'macbook-pro-16-m3-max': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-space-black', ten_tuy_chon: 'Đen Không Gian (Space Black) 48GB / 1TB', chenh_lech_gia: 0, hinh_anh: '/images/sp/macbook_pro_m3.jpg' },
      { ma_tuy_chon: 'opt-silver', ten_tuy_chon: 'Bạc Ánh Kim (Silver) 64GB / 2TB', chenh_lech_gia: 8000000, hinh_anh: '/images/sp/pro_m3.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/macbook_pro_m3.jpg',
      '/images/sp/pro_m3.jpg'
    ]
  },
  'hp-omen-transcend-14-ai': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-black', ten_tuy_chon: 'Shadow Black (Đen Bóng Đêm) 32GB / 1TB', chenh_lech_gia: 0, hinh_anh: '/images/sp/hp_omen_14.jpg' },
      { ma_tuy_chon: 'opt-white', ten_tuy_chon: 'Ceramic White (Trắng Gốm Sứ) 32GB / 1TB', chenh_lech_gia: 1200000, hinh_anh: '/images/sp/omen_14.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/hp_omen_14.jpg',
      '/images/sp/omen_14.jpg'
    ]
  },
  'rog-scar-18-2026': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-32', ten_tuy_chon: 'Bản Chuẩn RTX 4080 / 32GB / 1TB', chenh_lech_gia: 0, hinh_anh: '/images/sp/asus_rog_scar18.jpg' },
      { ma_tuy_chon: 'opt-64', ten_tuy_chon: 'Bản Đỉnh Cao RTX 4090 / 64GB / 2TB', chenh_lech_gia: 16000000, hinh_anh: '/images/sp/scar18_wide_v2.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/asus_rog_scar18.jpg',
      '/images/sp/scar18_wide_v2.jpg',
      '/images/sp/rog_scar18.jpg'
    ]
  },
  'legion-pro-7i-2026': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-std', ten_tuy_chon: 'Bản Chuẩn Core i9 / RTX 4080 / 32GB', chenh_lech_gia: 0, hinh_anh: '/images/sp/lenovo_legion_pro7.jpg' },
      { ma_tuy_chon: 'opt-max', ten_tuy_chon: 'Bản Đầy Đủ Core i9 / RTX 4090 / 64GB', chenh_lech_gia: 14500000, hinh_anh: '/images/sp/legion_pro7.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/lenovo_legion_pro7.jpg',
      '/images/sp/legion_pro7.jpg'
    ]
  },
  'acer-predator-helios-18-ai': {
    tuy_chon_phien_ban: [
      { ma_tuy_chon: 'opt-std', ten_tuy_chon: 'Bản 32GB RAM / 1TB SSD Mini-LED', chenh_lech_gia: 0, hinh_anh: '/images/sp/acer_predator_helios.jpg' },
      { ma_tuy_chon: 'opt-max', ten_tuy_chon: 'Bản 64GB RAM / 2TB SSD Mini-LED', chenh_lech_gia: 8500000, hinh_anh: '/images/sp/predator_helios.jpg' }
    ],
    thu_vien_hinh_anh: [
      '/images/sp/acer_predator_helios.jpg',
      '/images/sp/predator_helios.jpg'
    ]
  }
};

// Đưa 5 sản phẩm mới vào danh sách db.san_pham trước khi chuẩn hóa
newTechProducts.forEach(np => {
  const idx = db.san_pham.findIndex(p => p.id === np.id);
  if (idx >= 0) db.san_pham[idx] = { ...db.san_pham[idx], ...np };
  else db.san_pham.push(np);
});

// Cập nhật từng sản phẩm
db.san_pham.forEach((sp) => {
  // 1. Luôn bảo đảm ton_kho có showroom
  if (!sp.ton_kho || sp.ton_kho.length === 0) {
    sp.ton_kho = danhSachKhoChuan;
  }

  // 2. Bảo đảm thong_so an toàn và có cong_ket_noi dạng mảng
  if (!sp.thong_so) sp.thong_so = {};
  if (!sp.thong_so.cong_ket_noi) {
    sp.thong_so.cong_ket_noi = ['Type-C Thunderbolt 4 / USB 3.2', 'USB-A 3.2 Gen 2', 'HDMI 2.1 4K@120Hz', 'Jack 3.5mm'];
  } else if (typeof sp.thong_so.cong_ket_noi === 'string') {
    sp.thong_so.cong_ket_noi = [sp.thong_so.cong_ket_noi];
  }
  if (!sp.thong_so.che_do_bao_hanh) {
    sp.thong_so.che_do_bao_hanh = 'Bảo hành chính hãng 24 tháng 1 đổi 1 trong 30 ngày';
  }
  if (!sp.thong_so.he_dieu_hanh) {
    sp.thong_so.he_dieu_hanh = 'Windows 11 Home 64-bit bản quyền chính hãng';
  }
  if (!sp.thong_so.chuan_wifi_bluetooth) {
    sp.thong_so.chuan_wifi_bluetooth = 'Wi-Fi 6E / Wi-Fi 7 + Bluetooth 5.3';
  }

  // 3. Nếu có dữ liệu chuyên biệt thì nạp đè
  if (productEnrichment[sp.id]) {
    const en = productEnrichment[sp.id];
    if (en.tuy_chon_phien_ban) sp.tuy_chon_phien_ban = en.tuy_chon_phien_ban;
    if (en.qua_tang) sp.qua_tang = en.qua_tang;
    if (en.dac_diem_noi_bat) sp.dac_diem_noi_bat = en.dac_diem_noi_bat;
    if (en.mo_ta_chi_tiet) sp.mo_ta_chi_tiet = en.mo_ta_chi_tiet;
    if (en.thong_so) sp.thong_so = { ...sp.thong_so, ...en.thong_so };
    if (en.thu_vien_hinh_anh) sp.thu_vien_hinh_anh = en.thu_vien_hinh_anh;
  }

  // 4. Nếu vẫn chưa có tuy_chon_phien_ban, sinh mặc định đẹp
  if (!sp.tuy_chon_phien_ban || sp.tuy_chon_phien_ban.length === 0) {
    if ((sp.danh_muc || []).includes('gaming') || (sp.danh_muc || []).includes('laptop-gaming')) {
      sp.tuy_chon_phien_ban = [
        { ma_tuy_chon: 'opt-std', ten_tuy_chon: 'Bản Chuẩn Xuất Xưởng (RAM 16GB / SSD 512GB)', chenh_lech_gia: 0, hinh_anh: sp.hinh_anh_chinh },
        { ma_tuy_chon: 'opt-upgrade', ten_tuy_chon: 'Bản Nâng Cấp Pro (RAM 32GB / SSD 1TB NVMe)', chenh_lech_gia: 1800000, hinh_anh: (sp.thu_vien_hinh_anh && sp.thu_vien_hinh_anh[1]) || sp.hinh_anh_chinh }
      ];
    } else if ((sp.danh_muc || []).includes('phu-kien-gear') || (sp.danh_muc || []).includes('linh-kien')) {
      sp.tuy_chon_phien_ban = [
        { ma_tuy_chon: 'opt-std', ten_tuy_chon: 'Màu Tiêu Chuẩn (Black)', chenh_lech_gia: 0, hinh_anh: sp.hinh_anh_chinh },
        { ma_tuy_chon: 'opt-white', ten_tuy_chon: 'Màu Giới Hạn (White Edition)', chenh_lech_gia: 80000, hinh_anh: (sp.thu_vien_hinh_anh && sp.thu_vien_hinh_anh[1]) || sp.hinh_anh_chinh }
      ];
    } else {
      sp.tuy_chon_phien_ban = [
        { ma_tuy_chon: 'opt-std', ten_tuy_chon: 'Bản 16GB RAM / 512GB SSD', chenh_lech_gia: 0, hinh_anh: sp.hinh_anh_chinh },
        { ma_tuy_chon: 'opt-plus', ten_tuy_chon: 'Bản 32GB RAM / 1TB SSD', chenh_lech_gia: 2200000, hinh_anh: (sp.thu_vien_hinh_anh && sp.thu_vien_hinh_anh[1]) || sp.hinh_anh_chinh }
      ];
    }
  }

  // Đảm bảo mỗi tùy chọn phiên bản có ảnh rõ ràng
  if (Array.isArray(sp.tuy_chon_phien_ban)) {
    sp.tuy_chon_phien_ban.forEach((opt, idx) => {
      if (!opt.hinh_anh) {
        opt.hinh_anh = (sp.thu_vien_hinh_anh && sp.thu_vien_hinh_anh[idx]) || sp.hinh_anh_chinh;
      }
    });
  }

  // Luôn bảo đảm sp.thu_vien_hinh_anh đầy đủ và chứa ảnh của các phiên bản
  if (!Array.isArray(sp.thu_vien_hinh_anh) || sp.thu_vien_hinh_anh.length === 0) {
    sp.thu_vien_hinh_anh = [sp.hinh_anh_chinh];
  }
  sp.tuy_chon_phien_ban.forEach((opt) => {
    if (opt.hinh_anh && !sp.thu_vien_hinh_anh.includes(opt.hinh_anh)) {
      sp.thu_vien_hinh_anh.push(opt.hinh_anh);
    }
  });

  // 5. Nếu vẫn chưa có quà tặng, bổ sung bộ quà chuẩn
  if (!sp.qua_tang || sp.qua_tang.length === 0) {
    if ((sp.danh_muc || []).includes('phu-kien-gear') || (sp.danh_muc || []).includes('linh-kien')) {
      sp.qua_tang = [
        { ten_qua_tang: 'Túi đựng phụ kiện cao cấp chống thấm', gia_tri: 120000 },
        { ten_qua_tang: 'Khăn lau thiết bị vi sợi kháng khuẩn', gia_tri: 40000 }
      ];
    } else {
      sp.qua_tang = [
        { ten_qua_tang: 'Balo Laptop Chống Sốc Cao Cấp TNTP Edition', gia_tri: 590000 },
        { ten_qua_tang: 'Chuột Quang Không Dây Công Thái Học', gia_tri: 250000 },
        { ten_qua_tang: 'Gói Cân Màu Màn Hình & Vệ Sinh Máy Trọn Đời', gia_tri: 500000 }
      ];
    }
  }

  // 6. Đảm bảo dac_diem_noi_bat
  if (!sp.dac_diem_noi_bat || sp.dac_diem_noi_bat.length === 0) {
    sp.dac_diem_noi_bat = [
      'Thiết kế cao cấp đạt chuẩn độ bền quốc tế',
      'Hiệu năng mạnh mẽ đáp ứng xuất sắc mọi tác vụ đa nhiệm',
      'Bảo hành chính hãng 24 tháng 1 đổi 1 tận tâm'
    ];
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('db.json đã cập nhật! Tổng sản phẩm:', db.san_pham.length);

// Ghi đè file danh-sach-laptop.js
const fileJsContent = `// Dữ liệu sản phẩm laptop và phụ kiện TNTP Laptop
export const DANH_SACH_LAPTOP = ${JSON.stringify(db.san_pham, null, 2)};
`;
fs.writeFileSync(laptopJsPath, fileJsContent, 'utf8');
console.log('danh-sach-laptop.js đã cập nhật thành công!');

// Đồng bộ MongoDB Atlas
async function syncMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Không tìm thấy MONGODB_URI!');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Đã kết nối MongoDB Atlas!');

  const SanPham = require('../models/san-pham.model');

  for (const sp of db.san_pham) {
    await SanPham.findOneAndUpdate(
      { id: sp.id },
      { $set: sp },
      { upsert: true, returnDocument: 'after' }
    );
  }

  const count = await SanPham.countDocuments();
  console.log('MongoDB Atlas đã đồng bộ thành công! Tổng số sản phẩm trong DB (collection san_pham):', count);
  await mongoose.disconnect();
  console.log('Hoàn tất 100%!');
}

syncMongo().catch(err => {
  console.error('Lỗi sync Mongo:', err);
  process.exit(1);
});
