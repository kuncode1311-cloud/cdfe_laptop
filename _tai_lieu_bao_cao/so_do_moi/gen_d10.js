// Sinh sơ đồ tuần tự thanh toán PayOS (rút gọn: Web chung Next.js + Express)
const fs = require('fs');
const W = 980;
const L = [
  { k: 'K', x: 130, t: 'Khách hàng', s: 'Trình duyệt', c: '#2563eb' },
  { k: 'W', x: 400, t: 'Web LaptopNew', s: 'Next.js + Express API', c: '#1e3a5f' },
  { k: 'P', x: 670, t: 'PayOS', s: 'Cổng thanh toán', c: '#d97706' },
  { k: 'M', x: 880, t: 'MongoDB', s: 'Đơn hàng', c: '#16a34a' }
];
const X = Object.fromEntries(L.map((l) => [l.k, l.x]));
const steps = [
  { f: 'K', t: 'W', a: 'Bấm "Chuyển khoản"', b: 'POST /thanh-toan/tao-link (JWT)' },
  { f: 'W', t: 'W', a: 'Kiểm tra chủ đơn, lấy số tiền từ DB' },
  { f: 'W', t: 'P', a: 'Tạo yêu cầu thanh toán', b: 'orderCode + amount, ký HMAC SHA256' },
  { f: 'P', t: 'W', a: 'checkoutUrl + qrCode', b: '(PayOS chậm >2,2s → dùng VietQR dự phòng)', d: 1 },
  { f: 'W', t: 'M', a: 'Lưu payos_order_code', b: 'trạng thái = chờ thanh toán' },
  { f: 'W', t: 'K', a: 'Hiển thị mã QR', d: 1 },
  { f: 'K', t: 'P', a: 'Quét QR, chuyển khoản ngân hàng' },
  { box: 'Cách 1 — Webhook (chính): PayOS tự gọi về server', c: '#16a34a', n: 4 },
  { f: 'P', t: 'W', a: 'POST /thanh-toan/webhook', b: '{ data, signature }' },
  { f: 'W', t: 'W', a: 'Kiểm tra chữ ký, số tiền, chống xử lý lặp' },
  { f: 'W', t: 'P', a: 'Trả 200 OK ngay', d: 1 },
  { f: 'W', t: 'M', a: 'da_thanh_toan = true', b: 'trạng thái = đã xác nhận · gửi email + Telegram' },
  { box: 'Cách 2 — Polling (dự phòng): Frontend hỏi mỗi 3 giây', c: '#7c3aed', n: 2 },
  { f: 'K', t: 'W', a: 'GET /thanh-toan/kiem-tra/:orderCode', b: 'chưa thấy PAID → server hỏi lại PayOS' },
  { f: 'W', t: 'K', a: '"PAID" → hiện thanh toán thành công', d: 1 }
];
const RH = 62, TOP = 130;
let y = TOP, out = '', n = 0, inBox = 0;
const lifeTop = 95;
let body = '';
for (const s of steps) {
  if (s.box) {
    if (inBox) y += 34; inBox = 1; const h = s.n * RH - 6;
    body += `<rect x="30" y="${y - 22}" width="${W - 60}" height="${h + 36}" rx="12" fill="${s.c}" fill-opacity="0.07" stroke="${s.c}" stroke-width="1.6" stroke-dasharray="7 5"/>`;
    body += `<rect x="42" y="${y - 34}" width="${s.box.length * 7.6 + 24}" height="24" rx="6" fill="${s.c}"/><text x="54" y="${y - 17}" fill="#fff" font-size="13" font-weight="700">${s.box}</text>`;
    y += 26;
    continue;
  }
  n++;
  const x1 = X[s.f], x2 = X[s.t];
  const circ = (cx) => `<circle cx="${cx}" cy="${y}" r="13" fill="#1e293b"/><text x="${cx}" y="${y + 4.5}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">${n}</text>`;
  if (s.f === s.t) {
    body += `<path d="M${x1} ${y - 14} h70 v28 h-70" fill="none" stroke="#1e293b" stroke-width="2" marker-end="url(#ah)"/>`;
    body += circ(x1 + 0);
    body += `<text x="${x1 + 82}" y="${y + 5}" font-size="14" fill="#0f172a">${s.a}</text>`;
  } else {
    const dir = x2 > x1 ? 1 : -1;
    body += `<line x1="${x1}" y1="${y}" x2="${x2 - dir * 4}" y2="${y}" stroke="#1e293b" stroke-width="2" ${s.d ? 'stroke-dasharray="7 5"' : ''} marker-end="url(#ah)"/>`;
    body += circ(x1 + dir * 0);
    const mx = (x1 + x2) / 2 + dir * 8;
    body += `<text x="${mx}" y="${y - 20}" text-anchor="middle" font-size="14" font-weight="700" fill="#0f172a">${s.a}</text>`;
    if (s.b) body += `<text x="${mx}" y="${y - 5}" text-anchor="middle" font-size="12" fill="#475569">${s.b}</text>`;
  }
  y += RH;
}
const H = y + 10;
let head = '';
for (const l of L) {
  head += `<line x1="${l.x}" y1="${lifeTop}" x2="${l.x}" y2="${H - 10}" stroke="${l.c}" stroke-opacity="0.35" stroke-width="2"/>`;
  head += `<rect x="${l.x - 80}" y="22" width="160" height="62" rx="12" fill="${l.c}"/><text x="${l.x}" y="50" text-anchor="middle" fill="#fff" font-size="17" font-weight="700">${l.t}</text><text x="${l.x}" y="70" text-anchor="middle" fill="#fff" fill-opacity="0.85" font-size="12">${l.s}</text>`;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Segoe UI, Arial, sans-serif"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#1e293b"/></marker></defs><rect width="100%" height="100%" fill="#fff"/>${head}${body}</svg>`;
fs.writeFileSync(__dirname + '/d10_payos.svg', svg);
fs.writeFileSync(__dirname + '/_d10.html', `<html><body style="margin:0">${svg}</body></html>`);
console.log(W, H);
