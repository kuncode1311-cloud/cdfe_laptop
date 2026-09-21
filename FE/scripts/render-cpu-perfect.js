const sharp = require('sharp');
const path = require('path');

const src = path.join(__dirname, 'temp_cpu.jpg');
const out = path.join(__dirname, '..', 'public', 'images', 'sp', 'cpu_intel_i9_14900ks_v8.jpg');

async function main() {
  // 1. Lấy thông tin ảnh gốc
  const meta = await sharp(src).metadata();
  console.log('Original CPU:', meta.width, meta.height);

  // 2. Cắt chính xác vùng viền của CPU (loại bỏ hoàn toàn lề ngoài)
  // Bbox của CPU trong ảnh: left: 365, top: 345, width: 2470, height: 2940
  const cropped = await sharp(src)
    .extract({ left: 365, top: 345, width: 2470, height: 2940 })
    .resize(null, 680, { fit: 'contain' })
    .toBuffer();

  const cMeta = await sharp(cropped).metadata();

  // 3. Đặt lên nền studio trắng tinh 1376x768 với bóng đổ chân đế tinh tế
  const shadowSvg = Buffer.from(`
    <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.22" />
          <stop offset="60%" stop-color="#0f172a" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1376" height="768" fill="#ffffff" />
      <ellipse cx="688" cy="725" rx="300" ry="24" fill="url(#shadow)" />
    </svg>
  `);

  const left = Math.round((1376 - cMeta.width) / 2);
  const top = Math.round((768 - cMeta.height) / 2) - 10;

  await sharp(shadowSvg)
    .composite([{ input: cropped, left, top }])
    .jpeg({ quality: 96 })
    .toFile(out);

  console.log('✓ Hoàn tất CPU V8 (1376x768, viền PCB sắc lẹm, bóng đổ tinh tế)');
}

main().catch(console.error);
