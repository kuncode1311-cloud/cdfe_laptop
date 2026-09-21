const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Lennovo\\.gemini\\antigravity-ide\\brain\\9ad731e7-4ac3-42af-a47b-fddcec3b36b8';
const spDir = path.join(__dirname, '..', 'public', 'images', 'sp');
const scriptsDir = __dirname;

// Tạo nền studio chuẩn 1376 x 768 đồng bộ 100% với laptop cards
function createCleanStudioSvg(width = 1376, height = 768) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="studioGlow" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="65%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#edf2f7" />
        </radialGradient>
        <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.16" />
          <stop offset="60%" stop-color="#0f172a" stop-opacity="0.05" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#studioGlow)" />
      <ellipse cx="688" cy="720" rx="380" ry="32" fill="url(#groundShadow)" />
    </svg>
  `);
}

// 1. Đế tản nhiệt V6: Cắt viền softbox, làm mát RGB lấp đầy 1376x768
async function renderDeTanV6() {
  const src = path.join(brainDir, 'gia_do_tan_nhiet_v5_1788884558485.jpg');
  const outPath = path.join(spDir, 'gia_do_tan_nhiet_v6.jpg');

  // Crop 80px lề 2 bên để loại bỏ mép softbox, phóng to đế tản tràn khung
  const meta = await sharp(src).metadata();
  const cropW = meta.width - 160;
  const cropH = Math.round(cropW * (768 / 1376));
  const top = Math.round((meta.height - cropH) / 2);

  await sharp(src)
    .extract({ left: 80, top: Math.max(0, top), width: cropW, height: Math.min(cropH, meta.height) })
    .resize(1376, 768, { fit: 'cover' })
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Đế tản nhiệt ICE-PRO V6 hoàn thành (1376x768, quạt kép RGB + màn hình 2800 RPM tràn full card)');
}

// 2. Giá đỡ laptop nhôm 360: Dùng render cao cấp đã tạo
async function renderGiaDoNhomV6() {
  const src = path.join(brainDir, 'test_quota_check_1788884524693.jpg');
  const outPath = path.join(spDir, 'gia_do_laptop_360_v6.jpg');

  await sharp(src)
    .resize(1376, 768, { fit: 'cover' })
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Giá đỡ laptop nhôm 360 V6 hoàn thành (1376x768, hợp kim nhôm CNC nâng laptop công thái học)');
}

// 3. Hub Type-C 10 in 1 HyperDrive: Cắt hub nhôm, tạo bóng đổ studio 1376x768
async function renderHubTypeCV6() {
  const src = path.join(scriptsDir, 'temp_hub.jpg');
  const outPath = path.join(spDir, 'hub_typec_10in1_v6.jpg');

  // Cắt bớt viền trắng thừa xung quanh hub
  const cropped = await sharp(src)
    .trim({ threshold: 10 })
    .toBuffer();

  const cMeta = await sharp(cropped).metadata();
  // Scale hub vừa vặn chiều rộng ~920px (chiếm 67% card)
  const scaled = await sharp(cropped)
    .resize(920, null, { fit: 'contain' })
    .toBuffer();

  const sMeta = await sharp(scaled).metadata();
  const bgSvg = createCleanStudioSvg();
  const left = Math.round((1376 - sMeta.width) / 2);
  const top = Math.round((768 - sMeta.height) / 2);

  await sharp(bgSvg)
    .composite([{ input: scaled, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Hub Type-C 10-in-1 V6 hoàn thành (1376x768, không gian màu studio chuẩn)');
}

// 4. CPU Intel Core i9-14900KS: Cắt chip, tạo bóng 3D, nền studio 1376x768
async function renderCpuV6() {
  const src = path.join(scriptsDir, 'temp_cpu.jpg');
  const outPath = path.join(spDir, 'cpu_intel_i9_14900ks_v6.jpg');

  // Cắt sát chip
  const cropped = await sharp(src)
    .trim({ threshold: 25 })
    .toBuffer();

  // Scale chip cao 600px
  const scaled = await sharp(cropped)
    .resize(null, 600, { fit: 'contain' })
    .toBuffer();

  const sMeta = await sharp(scaled).metadata();
  const left = Math.round((1376 - sMeta.width) / 2);
  const top = Math.round((768 - sMeta.height) / 2);

  const bgSvg = createCleanStudioSvg();

  await sharp(bgSvg)
    .composite([{ input: scaled, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ CPU Intel Core i9-14900KS V6 hoàn thành (1376x768, chip flagship sắc nét)');
}

// 5. Túi chống sốc Tomtoc Defender: Cắt sleeve + laptop, đặt nền studio 1376x768
async function renderTuiChongSocV6() {
  const src = path.join(scriptsDir, 'temp_sleeve.jpg');
  const outPath = path.join(spDir, 'tui_chong_soc_tomtoc_v6.jpg');

  const cropped = await sharp(src)
    .trim({ threshold: 10 })
    .toBuffer();

  const scaled = await sharp(cropped)
    .resize(null, 650, { fit: 'contain' })
    .toBuffer();

  const sMeta = await sharp(scaled).metadata();
  const left = Math.round((1376 - sMeta.width) / 2);
  const top = Math.round((768 - sMeta.height) / 2);

  const bgSvg = createCleanStudioSvg();

  await sharp(bgSvg)
    .composite([{ input: scaled, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Túi chống sốc Tomtoc V6 hoàn thành (1376x768)');
}

// 6. Củ sạc Anker 140W: Phóng to củ sạc + đổ bóng studio 1376x768
async function renderCuSacV6() {
  const src = path.join(brainDir, 'cu_sac_gan_1788882076496.jpg');
  const outPath = path.join(spDir, 'cu_sac_gan_140w_v6.jpg');

  const cropped = await sharp(src)
    .trim({ threshold: 15 })
    .toBuffer();

  // Scale củ sạc cao 620px (chiếm 81% chiều cao, cực rõ nét và đầy đặn)
  const scaled = await sharp(cropped)
    .resize(null, 620, { fit: 'contain' })
    .toBuffer();

  const sMeta = await sharp(scaled).metadata();
  const left = Math.round((1376 - sMeta.width) / 2);
  const top = Math.round((768 - sMeta.height) / 2) - 10;

  const bgSvg = createCleanStudioSvg();

  await sharp(bgSvg)
    .composite([{ input: scaled, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Củ sạc Anker GaN 140W V6 hoàn thành (1376x768, rõ nét màn hình LED)');
}

// 7. Tai nghe Aether Pro 7.1: Phóng to tai nghe + bóng studio 1376x768
async function renderTaiNgheV6() {
  const src = path.join(brainDir, 'tai_nghe_gaming_1788882105659.jpg');
  const outPath = path.join(spDir, 'tai_nghe_gaming_pro_v6.jpg');

  const cropped = await sharp(src)
    .trim({ threshold: 15 })
    .toBuffer();

  // Scale tai nghe cao 650px
  const scaled = await sharp(cropped)
    .resize(null, 650, { fit: 'contain' })
    .toBuffer();

  const sMeta = await sharp(scaled).metadata();
  const left = Math.round((1376 - sMeta.width) / 2);
  const top = Math.round((768 - sMeta.height) / 2);

  const bgSvg = createCleanStudioSvg();

  await sharp(bgSvg)
    .composite([{ input: scaled, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Tai nghe Aether Pro V6 hoàn thành (1376x768, đệm tai + mic RGB sắc sảo)');
}

// 8. Balo ROG Ranger: Phóng to balo + bóng studio 1376x768
async function renderBaloV6() {
  const src = path.join(brainDir, 'balo_gaming_rog_v2_1788882611042.jpg');
  const outPath = path.join(spDir, 'balo_gaming_rog_v6.jpg');

  const cropped = await sharp(src)
    .trim({ threshold: 15 })
    .toBuffer();

  // Scale balo cao 670px (chiếm 87% chiều cao 768)
  const scaled = await sharp(cropped)
    .resize(null, 670, { fit: 'contain' })
    .toBuffer();

  const sMeta = await sharp(scaled).metadata();
  const left = Math.round((1376 - sMeta.width) / 2);
  const top = Math.round((768 - sMeta.height) / 2);

  const bgSvg = createCleanStudioSvg();

  await sharp(bgSvg)
    .composite([{ input: scaled, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Balo ROG Ranger V6 hoàn thành (1376x768, không cắt quai, chuẩn studio)');
}

// 9. Lót chuột XXL RGB 900x400: Render SVG mat + bàn phím + chuột trên mặt bàn studio
async function renderLotChuotV6() {
  const outPath = path.join(spDir, 'lot_chuot_gaming_rgb_v6.jpg');

  // Tạo SVG lót chuột XXL phát sáng viền RGB neon tinh tế
  const matSvg = Buffer.from(`
    <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Nền bàn làm việc gỗ đen / carbon fiber sang trọng -->
        <linearGradient id="deskBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#181e29" />
          <stop offset="100%" stop-color="#0d1117" />
        </linearGradient>

        <!-- Viền Neon RGB chạy quanh lót chuột -->
        <linearGradient id="rgbBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff0055" />
          <stop offset="25%" stop-color="#00f0ff" />
          <stop offset="50%" stop-color="#7000ff" />
          <stop offset="75%" stop-color="#00ff66" />
          <stop offset="100%" stop-color="#ff9900" />
        </linearGradient>

        <!-- Bóng đổ của lót chuột -->
        <filter id="matGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="16" result="blur" />
        </filter>
        <filter id="edgeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
        </filter>
      </defs>

      <!-- Bề mặt bàn làm việc -->
      <rect width="1376" height="768" fill="url(#deskBg)" />

      <!-- Ánh sáng LED hắt xuống mặt bàn -->
      <rect x="138" y="114" width="1100" height="540" rx="32" fill="url(#rgbBorder)" opacity="0.35" filter="url(#matGlow)" />

      <!-- Dây đèn LED quang học bo viền lót chuột -->
      <rect x="143" y="119" width="1090" height="530" rx="28" fill="none" stroke="url(#rgbBorder)" stroke-width="8" filter="url(#edgeGlow)" />
      <rect x="143" y="119" width="1090" height="530" rx="28" fill="none" stroke="url(#rgbBorder)" stroke-width="4" />

      <!-- Bề mặt vải dệt Micro-Weave Speed chống nước màu xám đen -->
      <rect x="148" y="124" width="1080" height="520" rx="24" fill="#131720" />

      <!-- Họa tiết ROG Cyber Wave chìm tinh tế góc lót chuột -->
      <path d="M 850 644 L 1228 266 L 1228 644 Z" fill="#1a202c" opacity="0.4" />
      <text x="1170" y="610" fill="#64748b" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" letter-spacing="4" text-anchor="end">TNTP SPEED PRO • XXL 900x400</text>
    </svg>
  `);

  // Lấy bàn phím và chuột thu nhỏ đặt lên bề mặt lót chuột
  const kbSrc = path.join(spDir, 'gaming_keyboard_rgb.jpg');
  const mouseSrc = path.join(spDir, 'gaming_mouse_wireless.jpg');

  const kbCrop = await sharp(kbSrc)
    .extract({ left: 300, top: 180, width: 920, height: 420 })
    .resize(560, null, { fit: 'contain' })
    .toBuffer();

  const mouseCrop = await sharp(mouseSrc)
    .extract({ left: 80, top: 240, width: 520, height: 320 })
    .resize(220, null, { fit: 'contain' })
    .toBuffer();

  await sharp(matSvg)
    .composite([
      { input: kbCrop, left: 240, top: 180 },
      { input: mouseCrop, left: 880, top: 230 }
    ])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ Lót chuột Gaming Speed RGB XXL V6 hoàn thành (1376x768, viền neon RGB rực rỡ, bố cục hoàn hảo)');
}

async function runAll() {
  console.log('Bắt đầu render bộ ảnh V6 chuẩn 1376x768 lấp đầy 100% card...');
  await renderDeTanV6();
  await renderGiaDoNhomV6();
  await renderHubTypeCV6();
  await renderCpuV6();
  await renderTuiChongSocV6();
  await renderCuSacV6();
  await renderTaiNgheV6();
  await renderBaloV6();
  await renderLotChuotV6();
  console.log('\n>>> ĐÃ HOÀN TẤT 100% BỘ ẢNH V6 <<<');
}

runAll().catch(console.error);
