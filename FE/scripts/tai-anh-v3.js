const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const spDir = path.join(__dirname, '..', 'public', 'images', 'sp');

const photoSources = [
  {
    name: 'balo_gaming_rog_v3.jpg',
    url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1376&h=768&fit=crop&crop=entropy&q=88',
    backup: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1376&h=768&fit=crop&crop=entropy&q=88'
  },
  {
    name: 'tai_nghe_gaming_pro_v3.jpg',
    url: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=1376&h=768&fit=crop&crop=entropy&q=88',
    backup: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1376&h=768&fit=crop&crop=entropy&q=88'
  },
  {
    name: 'gia_do_laptop_360_v3.jpg',
    url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1376&h=768&fit=crop&crop=entropy&q=88'
  },
  {
    name: 'cpu_intel_i9_14900ks_v3.jpg',
    url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1376&h=768&fit=crop&crop=entropy&q=88'
  },
  {
    name: 'lot_chuot_gaming_rgb_v3.jpg',
    url: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=1376&h=768&fit=crop&crop=entropy&q=88'
  },
  {
    name: 'tui_chong_soc_tomtoc_v3.jpg',
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1376&h=768&fit=crop&crop=entropy&q=88'
  },
  {
    name: 'cu_sac_gan_140w_v3.jpg',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1376&h=768&fit=crop&crop=entropy&q=88'
  },
  {
    name: 'hub_typec_10in1_v3.jpg',
    url: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=1376&h=768&fit=crop&crop=entropy&q=88'
  }
];

async function downloadAndResize() {
  console.log('Bắt đầu tải và định dạng ảnh V3 (1376 x 768 full card)...');

  for (const item of photoSources) {
    const destPath = path.join(spDir, item.name);
    try {
      let res = await fetch(item.url);
      if (!res.ok && item.backup) {
        res = await fetch(item.backup);
      }
      if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      }

      const rawBuffer = Buffer.from(await res.arrayBuffer());

      // Chuẩn hóa chính xác 1376 x 768 bằng sharp
      const formattedBuffer = await sharp(rawBuffer)
        .resize(1376, 768, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 92 })
        .toBuffer();

      fs.writeFileSync(destPath, formattedBuffer);
      console.log('✓ Thành công:', item.name, '(1376x768)');
    } catch (err) {
      console.error('Lỗi khi tải', item.name, err.message);
    }
  }

  // Xử lý riêng ảnh đế tản nhiệt từ ảnh quạt tản nhiệt high-res sẵn có trong repo
  const fanSrc = path.join(__dirname, '..', 'FE', 'public', 'images', 'about-cooling-fan.jpg');
  if (fs.existsSync(fanSrc)) {
    const fanOut = path.join(spDir, 'gia_do_tan_nhiet_v3.jpg');
    const fanBuf = await sharp(fs.readFileSync(fanSrc))
      .resize(1376, 768, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 92 })
      .toBuffer();
    fs.writeFileSync(fanOut, fanBuf);
    console.log('✓ Thành công: gia_do_tan_nhiet_v3.jpg (1376x768)');
  }

  console.log('Hoàn thành 100% việc chuẩn bị ảnh V3!');
}

downloadAndResize().catch(console.error);
