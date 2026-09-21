const fs = require('fs');
const path = require('path');

const sharp = require(path.join(__dirname, '..', 'node_modules', 'sharp'));
const { DANH_SACH_LAPTOP } = require(path.join(__dirname, '..', 'du-lieu', 'danh-sach-laptop.js'));

async function main() {
  console.log('=== KIỂM TRA 21 ẢNH SẢN PHẨM ===');
  for (let i = 0; i < DANH_SACH_LAPTOP.length; i++) {
    const p = DANH_SACH_LAPTOP[i];
    const rel = p.hinh_anh_chinh.replace(/^\//, '');
    const fullPath = path.join(__dirname, '..', 'public', rel);
    try {
      const exists = fs.existsSync(fullPath);
      if (!exists) {
        console.log(`[${i+1}] ${p.id}: KHÔNG TỒN TẠI -> ${fullPath}`);
        continue;
      }
      const meta = await sharp(fullPath).metadata();
      const ratio = (meta.width / meta.height).toFixed(2);
      console.log(`[${i+1}] ${p.id.padEnd(35)} | ${p.hinh_anh_chinh.padEnd(35)} | ${meta.width}x${meta.height} (ratio: ${ratio}) | ${meta.format}`);
    } catch(err) {
      console.log(`[${i+1}] ${p.id}: ERROR ${err.message}`);
    }
  }
}

main();
