const fs = require('fs');
const path = require('path');
const mongoose = require(path.join(__dirname, '..', '..', 'BE', 'node_modules', 'mongoose'));
const dotenv = require(path.join(__dirname, '..', '..', 'BE', 'node_modules', 'dotenv'));

dotenv.config({ path: path.join(__dirname, '..', '..', 'BE', '.env') });

const mapV4toV8 = {
  '/images/sp/gia_do_tan_nhiet_v4.jpg': '/images/sp/gia_do_tan_nhiet_v8.jpg',
  '/images/sp/gia_do_laptop_360_v4.jpg': '/images/sp/gia_do_laptop_360_v8.jpg',
  '/images/sp/hub_typec_10in1_v4.jpg': '/images/sp/hub_typec_10in1_v8.jpg',
  '/images/sp/cpu_intel_i9_14900ks_v4.jpg': '/images/sp/cpu_intel_i9_14900ks_v8.jpg',
  '/images/sp/tui_chong_soc_tomtoc_v4.jpg': '/images/sp/tui_chong_soc_tomtoc_v8.jpg',
  '/images/sp/cu_sac_gan_140w_v4.jpg': '/images/sp/cu_sac_gan_140w_v8.jpg',
  '/images/sp/tai_nghe_gaming_pro_v4.jpg': '/images/sp/tai_nghe_gaming_pro_v8.jpg',
  '/images/sp/balo_gaming_rog_v4.jpg': '/images/sp/balo_gaming_rog_v8.jpg',
  '/images/sp/lot_chuot_gaming_rgb_v4.jpg': '/images/sp/lot_chuot_gaming_rgb_v8.jpg'
};

async function syncFiles() {
  console.log('=== 1. CẬP NHẬT FE/du-lieu/danh-sach-laptop.js ===');
  const dsPath = path.join(__dirname, '..', 'du-lieu', 'danh-sach-laptop.js');
  let dsContent = fs.readFileSync(dsPath, 'utf8');
  for (const [oldPath, newPath] of Object.entries(mapV4toV8)) {
    dsContent = dsContent.split(oldPath).join(newPath);
  }
  fs.writeFileSync(dsPath, dsContent, 'utf8');
  console.log('✓ Đã cập nhật danh-sach-laptop.js');

  console.log('=== 2. CẬP NHẬT FE/db.json ===');
  const dbPath = path.join(__dirname, '..', 'db.json');
  let dbContent = fs.readFileSync(dbPath, 'utf8');
  for (const [oldPath, newPath] of Object.entries(mapV4toV8)) {
    dbContent = dbContent.split(oldPath).join(newPath);
  }
  fs.writeFileSync(dbPath, dbContent, 'utf8');
  console.log('✓ Đã cập nhật db.json');
}

async function syncMongo() {
  console.log('=== 3. CẬP NHẬT MONGODB ATLAS COLLECTION san_pham ===');
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.warn('⚠️ Không tìm thấy MONGODB_URI trong BE/.env');
    return;
  }

  await mongoose.connect(mongoUri);
  console.log('✓ Kết nối MongoDB Atlas thành công');

  const db = mongoose.connection.db;
  const col = db.collection('san_pham');

  for (const [oldPath, newPath] of Object.entries(mapV4toV8)) {
    const res = await col.updateMany(
      { hinh_anh_chinh: oldPath },
      { 
        $set: { 
          hinh_anh_chinh: newPath,
          thu_vien_hinh_anh: [newPath]
        } 
      }
    );
    console.log(`- Cập nhật ${oldPath} -> ${newPath}: ${res.modifiedCount} bản ghi`);
  }

  const total = await col.countDocuments();
  console.log(`✓ Tổng số sản phẩm trong MongoDB collection san_pham: ${total}`);
  await mongoose.disconnect();
}

async function main() {
  await syncFiles();
  await syncMongo();
  console.log('\n>>> ĐỒNG BỘ TOÀN DIỆN V8 HOÀN TẤT <<<');
}

main().catch(console.error);
