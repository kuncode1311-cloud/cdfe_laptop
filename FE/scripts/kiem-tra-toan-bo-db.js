const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('=== TỔNG QUAN DATABASE ===');
console.log('Tổng số sản phẩm:', db.san_pham.length);

const phanLoai = {};
db.san_pham.forEach((sp, idx) => {
  const danhMuc = Array.isArray(sp.danh_muc) ? sp.danh_muc.join(', ') : (sp.danh_muc || 'chua_phan_loai');
  if (!phanLoai[danhMuc]) phanLoai[danhMuc] = [];
  phanLoai[danhMuc].push({
    index: idx + 1,
    id: sp.id,
    ten: sp.ten_san_pham,
    keys: Object.keys(sp.thong_so || {}),
    thong_so: sp.thong_so
  });
});

for (const [dm, list] of Object.entries(phanLoai)) {
  console.log(`\n======================================================`);
  console.log(`DANH MỤC: ${dm} (${list.length} sản phẩm)`);
  console.log(`======================================================`);
  list.forEach(item => {
    console.log(`[${item.index}] ID: ${item.id}`);
    console.log(`    Tên: ${item.ten}`);
    console.log(`    Keys: ${item.keys.join(', ')}`);
    console.log(`    Chi tiết:`, JSON.stringify(item.thong_so));
  });
}
