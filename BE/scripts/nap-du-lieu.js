const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Nạp file cấu hình môi trường .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Import Models
const SanPham = require('../models/san-pham.model');
const DonHang = require('../models/don-hang.model');
const MaGiamGia = require('../models/ma-giam-gia.model');
const DanhGia = require('../models/danh-gia.model');
const NguoiDung = require('../models/nguoi-dung.model');

const napDuLieu = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('❌ Lỗi: Chưa cấu hình MONGODB_URI trong file .env');
            process.exit(1);
        }

        console.log('⏳ Đang kết nối tới MongoDB Atlas...');
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 6000
        });
        console.log('✅ Kết nối MongoDB Atlas thành công!');

        // Đọc dữ liệu từ file FE/db.json
        const duongDanDbJson = path.join(__dirname, '..', '..', 'FE', 'db.json');
        if (!fs.existsSync(duongDanDbJson)) {
            console.error(`❌ Không tìm thấy file: ${duongDanDbJson}`);
            process.exit(1);
        }

        const duLieuJson = JSON.parse(fs.readFileSync(duongDanDbJson, 'utf-8'));

        console.log('🚀 Bắt đầu quá trình nạp dữ liệu (Seed Data)...');

        // 1. Nạp Sản phẩm
        if (Array.isArray(duLieuJson.san_pham) && duLieuJson.san_pham.length > 0) {
            await SanPham.deleteMany({});
            await SanPham.insertMany(duLieuJson.san_pham);
            console.log(`  ➕ Đã nạp thành công ${duLieuJson.san_pham.length} sản phẩm laptop.`);
        }

        // 2. Nạp Mã giảm giá
        if (Array.isArray(duLieuJson.ma_giam_gia) && duLieuJson.ma_giam_gia.length > 0) {
            await MaGiamGia.deleteMany({});
            await MaGiamGia.insertMany(duLieuJson.ma_giam_gia);
            console.log(`  ➕ Đã nạp thành công ${duLieuJson.ma_giam_gia.length} mã giảm giá (voucher).`);
        }

        // 3. Nạp Đơn hàng mẫu
        if (Array.isArray(duLieuJson.don_hang) && duLieuJson.don_hang.length > 0) {
            await DonHang.deleteMany({});
            await DonHang.insertMany(duLieuJson.don_hang);
            console.log(`  ➕ Đã nạp thành công ${duLieuJson.don_hang.length} đơn hàng.`);
        }

        // 4. Nạp Đánh giá mẫu
        if (Array.isArray(duLieuJson.danh_gia) && duLieuJson.danh_gia.length > 0) {
            await DanhGia.deleteMany({});
            await DanhGia.insertMany(duLieuJson.danh_gia);
            console.log(`  ➕ Đã nạp thành công ${duLieuJson.danh_gia.length} đánh giá.`);
        }

        // 5. Nạp Người dùng mẫu (Mã hóa mật khẩu & Phân quyền)
        if (Array.isArray(duLieuJson.nguoi_dung) && duLieuJson.nguoi_dung.length > 0) {
            await NguoiDung.deleteMany({});
            const salt = await bcrypt.genSalt(10);
            const usersWithHash = await Promise.all(
                duLieuJson.nguoi_dung.map(async (u) => ({
                    ...u,
                    matKhau: await bcrypt.hash(u.matKhau || '123456', salt),
                    vaiTro: u.vaiTro || 'khach_hang'
                }))
            );

            // Thêm tài khoản Admin chuẩn
            const adminPassHash = await bcrypt.hash('admin123', salt);
            usersWithHash.push({
                id: 'usr_admin_01',
                hoTen: 'Quản Trị Viên Hệ Thống',
                email: 'admin@laptopnew.vn',
                soDienThoai: '1900.8946',
                matKhau: adminPassHash,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                vaiTro: 'admin',
                hangThanhVien: 'Admin Toàn Quyền'
            });

            await NguoiDung.insertMany(usersWithHash);
            console.log(`  ➕ Đã nạp thành công ${usersWithHash.length} tài khoản người dùng (bao gồm Admin).`);
        }

        console.log('🎉 Hoàn tất nạp toàn bộ dữ liệu vào MongoDB Atlas!');
        await mongoose.disconnect();
        console.log('👋 Đã ngắt kết nối cơ sở dữ liệu an toàn.');
        process.exit(0);
    } catch (loi) {
        console.error('❌ Lỗi trong quá trình nạp dữ liệu:', loi.message);
        console.log('======================================================================');
        console.log('💡 HƯỚNG DẪN MỞ KẾT NỐI MONGODB ATLAS:');
        console.log('1. Đăng nhập https://cloud.mongodb.com');
        console.log('2. Vào mục "Network Access" (bên menu trái -> Security)');
        console.log('3. Bấm "Add IP Address" -> Chọn "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) -> Bấm "Confirm"');
        console.log('4. Nếu Cluster đang ở trạng thái "Paused", hãy bấm "Resume"');
        console.log('5. Sau khi lưu xong, chạy lại lệnh: npm run seed');
        console.log('======================================================================');
        process.exit(1);
    }
};

napDuLieu();
