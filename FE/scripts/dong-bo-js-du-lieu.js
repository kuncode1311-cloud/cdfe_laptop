const fs = require('fs');
const path = require('path');

const script42 = require('./chuan-hoa-tat-ca-phu-kien-db.js');
// We need THONG_SO_PHU_KIEN_42 from the script
const scriptText = fs.readFileSync(path.join(__dirname, 'chuan-hoa-tat-ca-phu-kien-db.js'), 'utf8');

// Let's read THONG_SO_PHU_KIEN_42 from db.json
const dbData = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8'));
const mapThongSo = {};
dbData.san_pham.forEach(s => {
  const cats = Array.isArray(s.danh_muc) ? s.danh_muc : [s.danh_muc];
  const laLaptop = cats.some(c => ['gaming', 'ai-pc', 'do-hoa-sang-tao', 'van-phong', 'doanh-nhan', 'sinh-vien', 'van-phong-mong-nhe'].includes(c)) && !cats.includes('balo-tui-chong-soc') && !cats.includes('phu-kien-gear');
  if (!laLaptop) {
    mapThongSo[s.id] = s.thong_so;
  }
});

console.log('Tổng số sản phẩm phụ kiện trong map:', Object.keys(mapThongSo).length);

// 1. Update FE/du-lieu/san-pham-bo-sung.js
const boSungPath = path.join(__dirname, '../du-lieu/san-pham-bo-sung.js');
let boSungContent = fs.readFileSync(boSungPath, 'utf8');
let boSungUpdated = 0;

for (const [id, thongSo] of Object.entries(mapThongSo)) {
  const regex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?thong_so:\\s*)\\{[\\s\\S]*?\\}`);
  if (regex.test(boSungContent)) {
    boSungUpdated++;
    boSungContent = boSungContent.replace(regex, `$1${JSON.stringify(thongSo, null, 12)}`);
  }
}
fs.writeFileSync(boSungPath, boSungContent, 'utf8');
console.log(`[✓] Đã cập nhật ${boSungUpdated} sản phẩm trong FE/du-lieu/san-pham-bo-sung.js!`);

// 2. Update FE/du-lieu/danh-sach-laptop.js
const danhSachPath = path.join(__dirname, '../du-lieu/danh-sach-laptop.js');
let danhSachContent = fs.readFileSync(danhSachPath, 'utf8');
let danhSachUpdated = 0;

for (const [id, thongSo] of Object.entries(mapThongSo)) {
  // Try both "id": and id:
  let regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"thong_so":\\s*)\\{[\\s\\S]*?\\}`);
  if (!regex.test(danhSachContent)) {
    regex = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?thong_so:\\s*)\\{[\\s\\S]*?\\}`);
  }
  if (regex.test(danhSachContent)) {
    danhSachUpdated++;
    danhSachContent = danhSachContent.replace(regex, `$1${JSON.stringify(thongSo, null, 6)}`);
  }
}
fs.writeFileSync(danhSachPath, danhSachContent, 'utf8');
console.log(`[✓] Đã cập nhật ${danhSachUpdated} sản phẩm trong FE/du-lieu/danh-sach-laptop.js!`);
