const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbPath = path.join(__dirname, '..', '..', 'FE', 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const newProducts = [
  {
    id: 'balo-gaming-rog-ranger-18',
    ma_san_pham: 'BP-ROGR-18',
    ten_san_pham: 'Balo Gaming ROG Ranger 18 inch Chống Nước Chuẩn Quân Đội - Đệm Khí 5 Lớp',
    hang_san_xuat: 'asus',
    danh_muc: ['phu-kien-gear'],
    gia_goc: 2490000,
    gia_khuyen_mai: 1890000,
    phan_tram_giam_gia: 24,
    hinh_anh_chinh: '/images/sp/balo_gaming_rog.jpg',
    thu_vien_hinh_anh: ['/images/sp/balo_gaming_rog.jpg'],
    thong_so: {
      cpu: 'Balo Gaming 18"',
      ram: 'Nylon 1680D',
      o_cung: 'Chống sốc 5 lớp',
      trong_luong: 1.2,
      dung_luong_pin: 'Chống nước IPX4',
      che_do_bao_hanh: 'BH 24 tháng chính hãng'
    },
    dac_diem_noi_bat: ['Chứa vừa laptop gaming khủng 18 inch', 'Vải Nylon Ballistic chống rạch và chống thấm', 'Khóa bảo mật TSA chuẩn hải quan Mỹ'],
    mo_ta_chi_tiet: 'Balo laptop gaming cao cấp chuyên dụng cho game thủ và chuyên gia đồ họa.',
    con_hang: true,
    so_luong_ton_kho: 35,
    so_luong_da_ban: 142,
    diem_danh_gia_tb: 4.9,
    so_luong_danh_gia: 38,
    la_flash_sale: false,
    la_ban_chay: true,
    la_san_pham_moi: true,
    ho_tro_tra_gop_0_phan_tram: true
  },
  {
    id: 'gia-do-tan-nhiet-so-lanh-icepro',
    ma_san_pham: 'PAD-ICE-RGB',
    ten_san_pham: 'Đế Tản Nhiệt Laptop Sò Lạnh ICE-PRO RGB Nhôm CNC - Quạt Kép 2800 RPM',
    hang_san_xuat: 'deepcool',
    danh_muc: ['phu-kien-gear', 'linh-kien'],
    gia_goc: 1590000,
    gia_khuyen_mai: 1190000,
    phan_tram_giam_gia: 25,
    hinh_anh_chinh: '/images/sp/gia_do_tan_nhiet.jpg',
    thu_vien_hinh_anh: ['/images/sp/gia_do_tan_nhiet.jpg'],
    thong_so: {
      cpu: 'Sò lạnh đóng băng',
      ram: 'Nhôm CNC',
      o_cung: 'Quạt 2800 RPM',
      trong_luong: 0.85,
      dung_luong_pin: 'Hạ 15°C',
      che_do_bao_hanh: 'BH 12 tháng 1 đổi 1'
    },
    dac_diem_noi_bat: ['Hạ nhiệt độ CPU & GPU laptop tức thì từ 12-18°C', 'Màn hình LED hiển thị nhiệt độ và tốc độ quạt thời gian thực', 'Đèn LED RGB 16.8 triệu màu đồng bộ gaming'],
    mo_ta_chi_tiet: 'Giải pháp tản nhiệt tối thượng cho laptop gaming và render 3D nặng.',
    con_hang: true,
    so_luong_ton_kho: 50,
    so_luong_da_ban: 210,
    diem_danh_gia_tb: 4.8,
    so_luong_danh_gia: 45,
    la_flash_sale: true,
    la_ban_chay: true,
    la_san_pham_moi: true,
    ho_tro_tra_gop_0_phan_tram: true
  },
  {
    id: 'cu-sac-gan-anker-140w-pd31',
    ma_san_pham: 'ANK-GAN-140W',
    ten_san_pham: 'Củ Sạc Nhanh GaN Anker Prime 140W 3 Cổng Type-C PD 3.1 Màn Hình LED Màu',
    hang_san_xuat: 'anker',
    danh_muc: ['phu-kien-gear', 'linh-kien'],
    gia_goc: 2390000,
    gia_khuyen_mai: 1790000,
    phan_tram_giam_gia: 25,
    hinh_anh_chinh: '/images/sp/cu_sac_gan_140w.jpg',
    thu_vien_hinh_anh: ['/images/sp/cu_sac_gan_140w.jpg'],
    thong_so: {
      cpu: 'Công suất 140W',
      ram: 'GaNPrime',
      o_cung: '3 Cổng Type-C',
      trong_luong: 0.28,
      dung_luong_pin: 'PD 3.1 140W',
      che_do_bao_hanh: 'BH 18 tháng chính hãng'
    },
    dac_diem_noi_bat: ['Chuẩn sạc PD 3.1 công suất tối đa 140W cho MacBook Pro 16 và Laptop Gaming', 'Kích thước siêu nhỏ gọn nhờ công nghệ bán dẫn GaNPrime', 'Màn hình màu TFT hiển thị công suất sạc từng cổng'],
    mo_ta_chi_tiet: 'Củ sạc du lịch tất-cả-trong-một cho laptop, iPad và điện thoại.',
    con_hang: true,
    so_luong_ton_kho: 40,
    so_luong_da_ban: 185,
    diem_danh_gia_tb: 5.0,
    so_luong_danh_gia: 52,
    la_flash_sale: false,
    la_ban_chay: true,
    la_san_pham_moi: true,
    ho_tro_tra_gop_0_phan_tram: true
  },
  {
    id: 'tai-nghe-gaming-aether-pro-71',
    ma_san_pham: 'EP-AETH-71',
    ten_san_pham: 'Tai Nghe Gaming Không Dây Aether Pro 7.1 Wireless - Màng Loa Graphene 50mm',
    hang_san_xuat: 'logitech',
    danh_muc: ['phu-kien-gear'],
    gia_goc: 3490000,
    gia_khuyen_mai: 2690000,
    phan_tram_giam_gia: 23,
    hinh_anh_chinh: '/images/sp/tai_nghe_gaming_pro.jpg',
    thu_vien_hinh_anh: ['/images/sp/tai_nghe_gaming_pro.jpg'],
    thong_so: {
      cpu: 'Âm vòm 7.1',
      ram: 'Driver 50mm',
      o_cung: 'Pin 60 giờ',
      trong_luong: 0.26,
      dung_luong_pin: 'Pin 60h',
      che_do_bao_hanh: 'BH 24 tháng chính hãng'
    },
    dac_diem_noi_bat: ['Driver màng loa Graphene 50mm tái tạo âm trường cực kỳ chính xác', 'Kết nối không dây kép 2.4GHz Lightspeed siêu tốc và Bluetooth 5.3', 'Thời lượng pin ấn tượng lên tới 60 giờ liên tục'],
    mo_ta_chi_tiet: 'Tai nghe gaming đẳng cấp esports định vị tiếng bước chân chuẩn xác.',
    con_hang: true,
    so_luong_ton_kho: 25,
    so_luong_da_ban: 96,
    diem_danh_gia_tb: 4.9,
    so_luong_danh_gia: 29,
    la_flash_sale: true,
    la_ban_chay: true,
    la_san_pham_moi: true,
    ho_tro_tra_gop_0_phan_tram: true
  }
];

// Cập nhật db.json
newProducts.forEach(np => {
  const idx = db.san_pham.findIndex(p => p.id === np.id);
  if (idx >= 0) db.san_pham[idx] = np;
  else db.san_pham.push(np);
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('✅ Đã cập nhật FE/db.json. Tổng sản phẩm:', db.san_pham.length);

// Cập nhật MongoDB Atlas
async function syncMongo() {
  await mongoose.connect(process.env.MONGODB_URI);
  const SanPham = require('../models/san-pham.model');
  for (const np of newProducts) {
    await SanPham.findOneAndUpdate({ id: np.id }, np, { upsert: true, new: true });
    console.log('  ➕ Đã đồng bộ vào MongoDB Atlas:', np.ten_san_pham);
  }
  const count = await SanPham.countDocuments();
  console.log('🎉 Tổng số sản phẩm trong MongoDB Atlas hiện tại:', count);
  process.exit(0);
}

syncMongo();
