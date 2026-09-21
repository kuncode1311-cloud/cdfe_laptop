const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Lennovo\\.gemini\\antigravity-ide\\brain\\9ad731e7-4ac3-42af-a47b-fddcec3b36b8';
const spDir = path.join(__dirname, '..', 'public', 'images', 'sp');

// Tạo SVG gradient nền studio có vệt sáng spotlight tròn dịu mắt ở tâm
function createStudioBackgroundSvg(width = 1376, height = 768) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="spotlight" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="60%" stop-color="#f5f7fa" />
          <stop offset="100%" stop-color="#e8ecf2" />
        </radialGradient>
        <ellipse id="groundShadow" cx="688" cy="710" rx="320" ry="25" fill="black" opacity="0.12" filter="blur(14px)" />
      </defs>
      <rect width="${width}" height="${height}" fill="url(#spotlight)" />
      <use href="#groundShadow" />
    </svg>
  `);
}

async function renderBaloV4() {
  const src = path.join(brainDir, 'balo_gaming_rog_v2_1788882611042.jpg');
  // Cắt sát balo (loại bỏ lề trắng thừa)
  // Bbox đã đo: minX: 315, maxX: 888, minY: 70, maxY: 859
  const cropped = await sharp(src)
    .extract({ left: 310, top: 65, width: 580, height: 800 })
    .toBuffer();

  // Scale balo cao 660px (chiếm 86% chiều cao 768, chừa lề 54px trên dưới, không bao giờ bị cắt)
  const scaled = await sharp(cropped)
    .resize(null, 660, { fit: 'contain' })
    .toBuffer();

  const bgSvg = createStudioBackgroundSvg();
  const outPath = path.join(spDir, 'balo_gaming_rog_v4.jpg');

  await sharp(bgSvg)
    .composite([{ input: scaled, gravity: 'center', top: 48, left: 443 }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Balo V4 hoàn thành (1376x768, balo cao 660px full card, không cắt quai)');
}

async function renderTaiNgheV4() {
  const src = path.join(brainDir, 'tai_nghe_gaming_1788882105659.jpg');
  // Cắt sát tai nghe (bbox: minX: 80, maxX: 940, minY: 80, maxY: 940)
  const cropped = await sharp(src)
    .extract({ left: 80, top: 80, width: 860, height: 860 })
    .toBuffer();

  // Scale tai nghe vừa vặn 640px
  const scaled = await sharp(cropped)
    .resize(640, 640, { fit: 'contain' })
    .toBuffer();

  const bgSvg = createStudioBackgroundSvg();
  const outPath = path.join(spDir, 'tai_nghe_gaming_pro_v4.jpg');

  await sharp(bgSvg)
    .composite([{ input: scaled, gravity: 'center', top: 58, left: 368 }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Tai nghe V4 hoàn thành (1376x768, vòm tai nghe không cắt)');
}

async function renderDeTanV4() {
  const src = path.join(brainDir, 'gia_do_tan_nhiet_1788882046861.jpg');
  const cropped = await sharp(src)
    .extract({ left: 60, top: 60, width: 900, height: 900 })
    .toBuffer();

  const scaled = await sharp(cropped)
    .resize(800, 640, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  const bgSvg = createStudioBackgroundSvg();
  const outPath = path.join(spDir, 'gia_do_tan_nhiet_v4.jpg');

  await sharp(bgSvg)
    .composite([{ input: scaled, gravity: 'center' }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Đế tản nhiệt V4 hoàn thành (1376x768 bè ngang full card)');
}

async function renderCuSacV4() {
  const src = path.join(brainDir, 'cu_sac_gan_1788882076496.jpg');
  const cropped = await sharp(src)
    .extract({ left: 80, top: 80, width: 860, height: 860 })
    .toBuffer();

  const scaled = await sharp(cropped)
    .resize(640, 640, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  const bgSvg = createStudioBackgroundSvg();
  const outPath = path.join(spDir, 'cu_sac_gan_140w_v4.jpg');

  await sharp(bgSvg)
    .composite([{ input: scaled, gravity: 'center' }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Củ sạc V4 hoàn thành (1376x768)');
}

async function renderGiaDoNhomV4() {
  const fanSrc = path.join(__dirname, '..', 'public', 'images', 'about-cooling-fan.jpg');
  const cropped = await sharp(fanSrc)
    .resize(750, 640, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  const bgSvg = createStudioBackgroundSvg();
  const outPath = path.join(spDir, 'gia_do_laptop_360_v4.jpg');

  await sharp(bgSvg)
    .composite([{ input: cropped, gravity: 'center' }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Giá đỡ nhôm V4 hoàn thành (1376x768)');
}

async function renderLotChuotV4() {
  const src = path.join(__dirname, '..', 'public', 'images', 'tin_gaming_rtx40.jpg');
  const outPath = path.join(spDir, 'lot_chuot_gaming_rgb_v4.jpg');
  await sharp(src)
    .resize(1376, 768, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 94 })
    .toFile(outPath);

  console.log('✓ Lót chuột V4 hoàn thành (1376x768)');
}

async function renderCpuV4() {
  const src = path.join(__dirname, '..', 'public', 'images', 'about-tech-chip.jpg');
  const outPath = path.join(spDir, 'cpu_intel_i9_14900ks_v4.jpg');
  await sharp(src)
    .resize(1376, 768, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 94 })
    .toFile(outPath);

  console.log('✓ CPU Intel V4 hoàn thành (1376x768)');
}

async function renderHubV4() {
  const src = path.join(__dirname, '..', 'public', 'images', 'tin_ai_pc_chip.jpg');
  const outPath = path.join(spDir, 'hub_typec_10in1_v4.jpg');
  await sharp(src)
    .resize(1376, 768, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 94 })
    .toFile(outPath);

  console.log('✓ Hub Type-C V4 hoàn thành (1376x768)');
}

async function renderTomtocV4() {
  const src = path.join(brainDir, 'balo_gaming_rog_v2_1788882611042.jpg');
  const scaled = await sharp(src)
    .resize(750, 600, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();

  const bgSvg = createStudioBackgroundSvg();
  const outPath = path.join(spDir, 'tui_chong_soc_tomtoc_v4.jpg');

  await sharp(bgSvg)
    .composite([{ input: scaled, gravity: 'center' }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Túi Tomtoc V4 hoàn thành (1376x768)');
}

async function main() {
  console.log('Bắt đầu tạo bộ ảnh V4 chuẩn studio 1376 x 768...');
  await renderBaloV4();
  await renderTaiNgheV4();
  await renderDeTanV4();
  await renderCuSacV4();
  await renderGiaDoNhomV4();
  await renderLotChuotV4();
  await renderCpuV4();
  await renderHubV4();
  await renderTomtocV4();
  console.log('Hoàn thành 100% bộ ảnh V4!');
}

main().catch(console.error);
