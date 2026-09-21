const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Lennovo\\.gemini\\antigravity-ide\\brain\\9ad731e7-4ac3-42af-a47b-fddcec3b36b8';
const spDir = path.join(__dirname, '..', 'public', 'images', 'sp');
const scriptsDir = __dirname;

// Nền studio trắng tinh khiết chuẩn e-commerce cao cấp (1376 x 768)
// Giống 100% nền của samsung_990_ssd.jpg và kingston_fury_ram.jpg
function createPureWhiteStudioSvg(shadowRx = 380, shadowRy = 24, shadowCy = 710) {
  return Buffer.from(`
    <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pureWhiteGlow" cx="50%" cy="45%" r="75%">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="70%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f8fafc" />
        </radialGradient>
        <radialGradient id="dropShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#0f172a" stop-opacity="0.18" />
          <stop offset="60%" stop-color="#0f172a" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1376" height="768" fill="url(#pureWhiteGlow)" />
      <ellipse cx="688" cy="${shadowCy}" rx="${shadowRx}" ry="${shadowRy}" fill="url(#dropShadow)" />
    </svg>
  `);
}

// 1. Đế tản nhiệt ICE-PRO: Cắt sạch viền softbox, phóng to 1376x768 tràn card
async function renderDeTanV7() {
  const src = path.join(brainDir, 'gia_do_tan_nhiet_v5_1788884558485.jpg');
  const outPath = path.join(spDir, 'gia_do_tan_nhiet_v7.jpg');

  // Cắt bỏ 160px lề 2 bên để loại bỏ hoàn toàn 2 softbox, giữ tỷ lệ 16:9
  // 1376 - 320 = 1056. Chiều cao = 1056 * (768/1376) = 590
  await sharp(src)
    .extract({ left: 160, top: 120, width: 1056, height: 590 })
    .resize(1376, 768, { fit: 'cover' })
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ [1/9] Đế tản nhiệt ICE-PRO V7 hoàn tất (1376x768, quạt RGB + LED 2800 RPM tràn mép card)');
}

// 2. Giá đỡ laptop nhôm 360: Giữ nguyên ảnh chụp chuẩn studio
async function renderGiaDoNhomV7() {
  const src = path.join(brainDir, 'test_quota_check_1788884524693.jpg');
  const outPath = path.join(spDir, 'gia_do_laptop_360_v7.jpg');

  await sharp(src)
    .resize(1376, 768, { fit: 'cover' })
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ [2/9] Giá đỡ laptop nhôm 360 V7 hoàn tất (1376x768)');
}

// 3. Hub Type-C 10 in 1 HyperDrive: Nền trắng tinh khiết, liền mạch 100%
async function renderHubTypeCV7() {
  const src = path.join(scriptsDir, 'temp_hub.jpg');
  const outPath = path.join(spDir, 'hub_typec_10in1_v7.jpg');

  // Cắt sát hub
  const cropped = await sharp(src)
    .trim({ threshold: 12 })
    .toBuffer();

  const cMeta = await sharp(cropped).metadata();
  // Scale hub vừa vặn chiều ngang 1050px (chiếm 76% card)
  const scaled = await sharp(cropped)
    .resize(1050, null, { fit: 'contain' })
    .toBuffer();

  const sMeta = await sharp(scaled).metadata();
  const left = Math.round((1376 - sMeta.width) / 2);
  const top = Math.round((768 - sMeta.height) / 2);

  // Tạo nền trắng tuyệt đối không bị lộ viền
  const bg = await sharp({
    create: {
      width: 1376,
      height: 768,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  }).jpeg().toBuffer();

  await sharp(bg)
    .composite([{ input: scaled, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ [3/9] Hub Type-C 10-in-1 V7 hoàn tất (1376x768, nền trắng tinh khiết)');
}

// 4. CPU Intel Core i9-14900KS: Cắt sát viền chip, xoay góc hoặc đặt giữa sang trọng
async function renderCpuV7() {
  const src = path.join(scriptsDir, 'temp_cpu.jpg');
  const outPath = path.join(spDir, 'cpu_intel_i9_14900ks_v7.jpg');

  // Cắt sát chip (bỏ viền trắng ngoài)
  // Kích thước gốc: 3258 x 3648
  const cropped = await sharp(src)
    .extract({ left: 360, top: 340, width: 2520, height: 2950 })
    .resize(null, 660, { fit: 'contain' })
    .toBuffer();

  const cMeta = await sharp(cropped).metadata();
  const left = Math.round((1376 - cMeta.width) / 2);
  const top = Math.round((768 - cMeta.height) / 2);

  const bgSvg = createPureWhiteStudioSvg(320, 24, 725);

  await sharp(bgSvg)
    .composite([{ input: cropped, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ [4/9] CPU Intel Core i9-14900KS V7 hoàn tất (1376x768, chip flagship sắc sảo)');
}

// 5. Túi chống sốc Tomtoc Defender: Nền trắng tinh khiết, liền mạch 100%
async function renderTuiChongSocV7() {
  const src = path.join(scriptsDir, 'temp_sleeve.jpg');
  const outPath = path.join(spDir, 'tui_chong_soc_tomtoc_v7.jpg');

  // Cắt sát túi + laptop
  const cropped = await sharp(src)
    .trim({ threshold: 10 })
    .resize(null, 660, { fit: 'contain' })
    .toBuffer();

  const cMeta = await sharp(cropped).metadata();
  const left = Math.round((1376 - cMeta.width) / 2);
  const top = Math.round((768 - cMeta.height) / 2);

  const bg = await sharp({
    create: {
      width: 1376,
      height: 768,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  }).jpeg().toBuffer();

  await sharp(bg)
    .composite([{ input: cropped, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ [5/9] Túi chống sốc Tomtoc V7 hoàn tất (1376x768)');
}

// 6. Củ sạc Anker 140W GaN: Phóng to 690px, đầy đặn, màn hình LED sắc nét
async function renderCuSacV7() {
  const src = path.join(brainDir, 'cu_sac_gan_1788882076496.jpg');
  const outPath = path.join(spDir, 'cu_sac_gan_140w_v7.jpg');

  const cropped = await sharp(src)
    .trim({ threshold: 15 })
    .resize(null, 690, { fit: 'contain' })
    .toBuffer();

  const cMeta = await sharp(cropped).metadata();
  const left = Math.round((1376 - cMeta.width) / 2);
  const top = Math.round((768 - cMeta.height) / 2) - 8;

  const bg = await sharp({
    create: {
      width: 1376,
      height: 768,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  }).jpeg().toBuffer();

  await sharp(bg)
    .composite([{ input: cropped, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ [6/9] Củ sạc Anker GaN 140W V7 hoàn tất (1376x768, to rõ sắc nét)');
}

// 7. Tai nghe Aether Pro 7.1: Phóng to 710px, đệm tai + mic RGB sắc sảo
async function renderTaiNgheV7() {
  const src = path.join(brainDir, 'tai_nghe_gaming_1788882105659.jpg');
  const outPath = path.join(spDir, 'tai_nghe_gaming_pro_v7.jpg');

  const cropped = await sharp(src)
    .trim({ threshold: 15 })
    .resize(null, 700, { fit: 'contain' })
    .toBuffer();

  const cMeta = await sharp(cropped).metadata();
  const left = Math.round((1376 - cMeta.width) / 2);
  const top = Math.round((768 - cMeta.height) / 2);

  const bg = await sharp({
    create: {
      width: 1376,
      height: 768,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  }).jpeg().toBuffer();

  await sharp(bg)
    .composite([{ input: cropped, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ [7/9] Tai nghe Aether Pro V7 hoàn tất (1376x768)');
}

// 8. Balo ROG Ranger: Phóng to 720px, quai xách ngay ngắn, chiếm trọn khung
async function renderBaloV7() {
  const src = path.join(brainDir, 'balo_gaming_rog_v2_1788882611042.jpg');
  const outPath = path.join(spDir, 'balo_gaming_rog_v7.jpg');

  const cropped = await sharp(src)
    .trim({ threshold: 15 })
    .resize(null, 715, { fit: 'contain' })
    .toBuffer();

  const cMeta = await sharp(cropped).metadata();
  const left = Math.round((1376 - cMeta.width) / 2);
  const top = Math.round((768 - cMeta.height) / 2);

  const bg = await sharp({
    create: {
      width: 1376,
      height: 768,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  }).jpeg().toBuffer();

  await sharp(bg)
    .composite([{ input: cropped, left, top }])
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ [8/9] Balo ROG Ranger V7 hoàn tất (1376x768)');
}

// 9. Lót chuột XXL RGB 900x400: Studio product render thực tế, viền LED RGB neon đa sắc
async function renderLotChuotV7() {
  const outPath = path.join(spDir, 'lot_chuot_gaming_rgb_v7.jpg');

  // Tạo vector render chuẩn phòng game e-sports cao cấp
  const matSvg = Buffer.from(`
    <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Nền phòng studio tối giản hiện đại -->
        <radialGradient id="studioDark" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#1e293b" />
          <stop offset="60%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#020617" />
        </radialGradient>

        <!-- Dải quang phổ RGB chạy dọc theo viền -->
        <linearGradient id="neonRGB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff007f" />
          <stop offset="20%" stop-color="#9900ff" />
          <stop offset="40%" stop-color="#0066ff" />
          <stop offset="60%" stop-color="#00f0ff" />
          <stop offset="80%" stop-color="#00ff66" />
          <stop offset="100%" stop-color="#ffaa00" />
        </linearGradient>

        <!-- Hiệu ứng phát sáng hào quang (Bloom glow) -->
        <filter id="neonBloom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" result="blur1" />
          <feGaussianBlur stdDeviation="6" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <!-- Lưới carbon fiber cho bề mặt lót chuột -->
        <pattern id="microWeave" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#111827" />
          <path d="M0 0h4v4H0z" fill="#161f31" />
          <path d="M4 4h4v4H4z" fill="#161f31" />
        </pattern>
      </defs>

      <!-- Nền bàn làm việc studio -->
      <rect width="1376" height="768" fill="url(#studioDark)" />

      <!-- Ánh sáng LED hắt xuống mặt bàn -->
      <rect x="118" y="94" width="1140" height="580" rx="36" fill="url(#neonRGB)" opacity="0.45" filter="url(#neonBloom)" />

      <!-- Dây quang học RGB viền quanh lót chuột -->
      <rect x="126" y="102" width="1124" height="564" rx="32" fill="none" stroke="url(#neonRGB)" stroke-width="10" filter="url(#neonBloom)" />
      <rect x="126" y="102" width="1124" height="564" rx="32" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.8" />

      <!-- Bề mặt lót chuột Speed Micro-Weave -->
      <rect x="134" y="110" width="1108" height="548" rx="26" fill="url(#microWeave)" />

      <!-- Đồ họa Cyberpunk ROG in chìm góc phải -->
      <g opacity="0.25">
        <path d="M 800 658 L 1242 216 L 1242 658 Z" fill="#3b82f6" />
        <path d="M 920 658 L 1242 336 L 1242 658 Z" fill="#8b5cf6" />
        <line x1="750" y1="658" x2="1242" y2="166" stroke="#00f0ff" stroke-width="2" />
        <line x1="780" y1="658" x2="1242" y2="196" stroke="#ff007f" stroke-width="1.5" />
      </g>

      <!-- Cụm điều khiển LED Controller ở góc trên bên trái -->
      <rect x="160" y="86" width="120" height="34" rx="8" fill="#0f172a" stroke="#334155" stroke-width="2" />
      <circle cx="180" cy="103" r="6" fill="#00f0ff" filter="url(#neonBloom)" />
      <text x="195" y="108" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">RGB CONTROL</text>

      <!-- Logo & nhãn sản phẩm in chìm góc dưới phải -->
      <text x="1210" y="626" fill="#64748b" font-family="system-ui, sans-serif" font-size="16" font-weight="900" letter-spacing="4" text-anchor="end">TNTP SPEED PRO</text>
      <text x="1210" y="644" fill="#475569" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" letter-spacing="2" text-anchor="end">XXL 900 x 400 mm • 4mm SPEED FABRIC</text>
    </svg>
  `);

  await sharp(matSvg)
    .jpeg({ quality: 96 })
    .toFile(outPath);

  console.log('✓ [9/9] Lót chuột Gaming Speed RGB XXL V7 hoàn tất (1376x768, viền neon RGB studio cực phẩm)');
}

async function runAll() {
  console.log('=== BẮT ĐẦU RENDER BỘ ẢNH V7 CHUẨN 1376 x 768 TRÀN VIỀN 100% ===');
  await renderDeTanV7();
  await renderGiaDoNhomV7();
  await renderHubTypeCV7();
  await renderCpuV7();
  await renderTuiChongSocV7();
  await renderCuSacV7();
  await renderTaiNgheV7();
  await renderBaloV7();
  await renderLotChuotV7();
  console.log('\n=== ĐÃ HOÀN TẤT TOÀN BỘ 9 ẢNH PHỤ KIỆN V7 SẮC NÉT TUYỆT ĐỐI ===');
}

runAll().catch(console.error);
