const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbPath = path.join(__dirname, '..', '..', 'FE', 'db.json');
const laptopJsPath = path.join(__dirname, '..', '..', 'FE', 'du-lieu', 'danh-sach-laptop.js');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const v4Map = {
  'balo-gaming-rog-ranger-18': '/images/sp/balo_gaming_rog_v4.jpg',
  'tai-nghe-gaming-aether-pro-71': '/images/sp/tai_nghe_gaming_pro_v4.jpg',
  'gia-do-tan-nhiet-so-lanh-icepro': '/images/sp/gia_do_tan_nhiet_v4.jpg',
  'cu-sac-gan-anker-140w-pd31': '/images/sp/cu_sac_gan_140w_v4.jpg',
  'gia-do-laptop-nhom-ergonomic-360': '/images/sp/gia_do_laptop_360_v4.jpg',
  'lot-chuot-gaming-speed-rgb-xxl': '/images/sp/lot_chuot_gaming_rgb_v4.jpg',
  'cpu-intel-core-i9-14900ks-box': '/images/sp/cpu_intel_i9_14900ks_v4.jpg',
  'hub-chuyen-doi-typec-10in1-hyperdrive': '/images/sp/hub_typec_10in1_v4.jpg',
  'tui-chong-soc-tomtoc-defender': '/images/sp/tui_chong_soc_tomtoc_v4.jpg'
};

db.san_pham.forEach(sp => {
  if (v4Map[sp.id]) {
    sp.hinh_anh_chinh = v4Map[sp.id];
    sp.thu_vien_hinh_anh = [v4Map[sp.id]];
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('db.json đã cập nhật ảnh v4!');

const fileJsContent = `// Dữ liệu sản phẩm laptop và phụ kiện TNTP Laptop
export const DANH_SACH_LAPTOP = ${JSON.stringify(db.san_pham, null, 2)};
`;
fs.writeFileSync(laptopJsPath, fileJsContent, 'utf8');
console.log('danh-sach-laptop.js đã cập nhật ảnh v4!');

async function syncAtlas() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas!');
  const SanPham = require('../models/san-pham.model');

  for (const sp of db.san_pham) {
    await SanPham.findOneAndUpdate(
      { id: sp.id },
      { $set: sp },
      { upsert: true, returnDocument: 'after' }
    );
  }

  const count = await SanPham.countDocuments();
  console.log('MongoDB Atlas đã cập nhật xong! Tổng số sản phẩm trong collection san_pham:', count);
  await mongoose.disconnect();
}

syncAtlas().catch(console.error);
