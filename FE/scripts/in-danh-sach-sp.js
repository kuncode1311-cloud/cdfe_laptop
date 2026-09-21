const fs = require('fs');
const path = require('path');
const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json'), 'utf8'));
db.san_pham.forEach((s, idx) => {
  const dm = Array.isArray(s.danh_muc) ? s.danh_muc.join(', ') : s.danh_muc;
  console.log((idx + 1) + '. [' + s.id + '] (' + dm + ') - ' + s.ten_san_pham);
});
