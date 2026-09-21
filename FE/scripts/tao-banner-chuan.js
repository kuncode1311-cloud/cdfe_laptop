const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = 'C:/Users/Lennovo/.gemini/antigravity-ide/brain/a0873bb5-87b6-4ba8-8900-21a80051a049/.user_uploaded/media_1789274146652.png';
const outputPath = path.join(__dirname, '../public/images/khuyen-mai/hero_banner_reference_perfect.jpg');

async function taoBanner() {
    try {
        console.log('⏳ Đang xử lý banner từ ảnh reference...');
        const meta = await sharp(inputPath).metadata();
        console.log('Original meta:', meta);

        const width = 1600;
        const height = 500;

        // 1. Upscale ảnh gốc lên 1600x500 dùng bộ lọc Lanczos3 chất lượng cao
        const upscaled = await sharp(inputPath)
            .resize(width, height, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
            .toBuffer();

        // 2. Tạo mask trong suốt: phần bên phải (từ x=760 trở đi) hiển thị 100%, chuyển mượt từ x=520 -> 760
        const mask = Buffer.alloc(width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let alpha = 0;
                if (x >= 760) {
                    alpha = 255;
                } else if (x >= 520) {
                    const ratio = (x - 520) / (760 - 520);
                    // Smooth cosine easing
                    alpha = Math.round(255 * (0.5 - 0.5 * Math.cos(ratio * Math.PI)));
                } else {
                    alpha = 0;
                }
                mask[y * width + x] = alpha;
            }
        }

        const maskPng = await sharp(mask, { raw: { width, height, channels: 1 } })
            .toFormat('png')
            .toBuffer();

        // 3. Ghép mask vào ảnh gốc để lấy phần artwork 3D bên phải mượt mà
        const rightArtwork = await sharp(upscaled)
            .ensureAlpha()
            .composite([
                { input: maskPng, blend: 'dest-in' }
            ])
            .toBuffer();

        // 4. Tạo nền gradient rực rỡ chuẩn 100% màu sắc và ánh sáng của ảnh reference
        // Nền sky blue sáng chói với luồng sáng từ góc trên bên phải
        const svgBg = Buffer.from(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#D5EAFC" />
                        <stop offset="35%" stop-color="#E8F4FE" />
                        <stop offset="70%" stop-color="#DCEDFE" />
                        <stop offset="100%" stop-color="#C5E3FE" />
                    </linearGradient>
                    <radialGradient id="sunGlow" cx="80%" cy="25%" r="65%">
                        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
                        <stop offset="45%" stop-color="#E8F4FE" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="#DCEDFE" stop-opacity="0" />
                    </radialGradient>
                    <radialGradient id="leftSoft" cx="20%" cy="40%" r="50%">
                        <stop offset="0%" stop-color="#EBF5FE" stop-opacity="0.9" />
                        <stop offset="100%" stop-color="#D2EAFE" stop-opacity="0" />
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#skyGrad)" />
                <rect width="100%" height="100%" fill="url(#sunGlow)" />
                <rect width="100%" height="100%" fill="url(#leftSoft)" />
            </svg>
        `);

        // 5. Kết hợp nền và artwork
        await sharp(svgBg)
            .composite([
                { input: rightArtwork, top: 0, left: 0 }
            ])
            .jpeg({ quality: 98 })
            .toFile(outputPath);

        console.log('✅ Đã tạo thành công hero_banner_reference_perfect.jpg chất lượng cao!');
    } catch (err) {
        console.error('❌ Lỗi:', err);
    }
}

taoBanner();
