const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const spDir = path.join(__dirname, '..', 'public', 'images', 'sp');

// Danh sách các ảnh cần chuẩn hóa thành 1376 x 768 để giãn full card
const itemsToProcess = [
  {
    name: 'balo_gaming_rog.jpg',
    targetHeight: 680,
    crop: { left: 300, top: 55, width: 600, height: 815 },
    bg: { r: 243, g: 243, b: 243 }
  },
  {
    name: 'tai_nghe_gaming_pro.jpg',
    targetHeight: 670,
    crop: { left: 80, top: 80, width: 864, height: 864 },
    bg: { r: 248, g: 250, b: 252 }
  },
  {
    name: 'gia_do_tan_nhiet.jpg',
    targetHeight: 680,
    crop: { left: 70, top: 70, width: 884, height: 884 },
    bg: { r: 248, g: 250, b: 252 }
  },
  {
    name: 'cu_sac_gan_140w.jpg',
    targetHeight: 660,
    crop: { left: 70, top: 70, width: 884, height: 884 },
    bg: { r: 248, g: 250, b: 252 }
  },
  {
    name: 'gia_do_laptop_360.jpg',
    targetHeight: 680,
    crop: { left: 50, top: 50, width: 900, height: 900 },
    bg: { r: 248, g: 250, b: 252 }
  },
  {
    name: 'tui_chong_soc_tomtoc.jpg',
    targetHeight: 670,
    crop: { left: 50, top: 50, width: 800, height: 800 },
    bg: { r: 248, g: 250, b: 252 }
  },
  {
    name: 'lot_chuot_gaming_rgb.jpg',
    targetHeight: 768,
    isCover: true
  },
  {
    name: 'hub_typec_10in1.jpg',
    targetHeight: 768,
    isCover: true
  },
  {
    name: 'cpu_intel_i9_14900ks.jpg',
    targetHeight: 768,
    isCover: true
  }
];

async function run() {
  console.log('Bắt đầu chuẩn hóa ảnh thành 1376 x 768 chuẩn full card...');

  for (const item of itemsToProcess) {
    const filePath = path.join(spDir, item.name);
    const tempPath = path.join(spDir, 'tmp_1376_' + item.name);

    if (!fs.existsSync(filePath)) {
      console.warn('Không tìm thấy file:', item.name);
      continue;
    }

    try {
      if (item.isCover) {
        // Với các ảnh phối cảnh như deskmat, cpu, hub: resize cover trực tiếp 1376x768
        await sharp(filePath)
          .resize(1376, 768, { fit: 'cover', position: 'center' })
          .jpeg({ quality: 94 })
          .toFile(tempPath);
      } else {
        // Cắt sát vật thể
        let pipeline = sharp(filePath);
        if (item.crop) {
          pipeline = pipeline.extract(item.crop);
        }

        const croppedBuf = await pipeline.toBuffer();

        // Scale vật thể vừa vặn trong chiều cao targetHeight (khoảng 660-680px trên tổng 768px, chừa 45px lề thở an toàn)
        const scaledBuf = await sharp(croppedBuf)
          .resize(null, item.targetHeight, { fit: 'contain' })
          .toBuffer();

        const finalBuf = await sharp({
          create: {
            width: 1376,
            height: 768,
            channels: 3,
            background: item.bg || { r: 248, g: 250, b: 252, alpha: 1 }
          }
        })
        .composite([{ input: scaledBuf, gravity: 'center' }])
        .jpeg({ quality: 95 })
        .toBuffer();

        fs.writeFileSync(filePath, finalBuf);
      }

      if (item.isCover) {
        const coverBuf = await sharp(filePath)
          .resize(1376, 768, { fit: 'cover', position: 'center' })
          .jpeg({ quality: 94 })
          .toBuffer();
        fs.writeFileSync(filePath, coverBuf);
      }

      console.log('✓ Đã chuẩn hóa 1376x768 full card:', item.name);
    } catch (err) {
      console.error('Lỗi khi xử lý', item.name, err.message);
    }
  }

  // Dọn dẹp các file tmp nếu có
  const files = fs.readdirSync(spDir);
  files.forEach(f => {
    if (f.startsWith('tmp_1376_')) {
      try { fs.unlinkSync(path.join(spDir, f)); } catch(e) {}
    }
  });

  console.log('Hoàn thành chuẩn hóa toàn bộ ảnh 1376 x 768!');
}

run();
