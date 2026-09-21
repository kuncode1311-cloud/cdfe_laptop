const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const NguoiDung = require('../models/nguoi-dung.model');

const migrateUsers = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('❌ Lỗi: Chưa cấu hình MONGODB_URI trong file .env');
            process.exit(1);
        }

        console.log('⏳ Đang kết nối tới MongoDB Atlas để migrate tài khoản...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
        console.log('✅ Kết nối MongoDB Atlas thành công!');

        const danhSachUser = await NguoiDung.find({});
        console.log(`🔎 Tìm thấy ${danhSachUser.length} tài khoản trong CSDL.`);

        for (const user of danhSachUser) {
            let canCapNhat = false;

            // 1. Kiểm tra và băm mật khẩu nếu đang là plain text
            if (user.matKhau && !user.matKhau.startsWith('$2a$') && !user.matKhau.startsWith('$2b$')) {
                const salt = await bcrypt.genSalt(10);
                user.matKhau = await bcrypt.hash(user.matKhau, salt);
                canCapNhat = true;
                console.log(`  🔒 Đã mã hóa bảo mật mật khẩu cho user: ${user.email}`);
            }

            // 2. Gán vaiTro mặc định nếu chưa có
            if (!user.vaiTro) {
                user.vaiTro = user.email.includes('admin') ? 'admin' : 'khach_hang';
                canCapNhat = true;
            }

            if (canCapNhat) {
                await user.save();
            }
        }

        // 3. Đảm bảo luôn có 1 tài khoản Admin chính thức
        const adminDaCo = await NguoiDung.findOne({ email: 'admin@laptopnew.vn' });
        if (!adminDaCo) {
            const salt = await bcrypt.genSalt(10);
            const adminPassHash = await bcrypt.hash('admin123', salt);

            const adminMoi = new NguoiDung({
                id: 'usr_admin_01',
                hoTen: 'Quản Trị Viên Hệ Thống',
                email: 'admin@laptopnew.vn',
                soDienThoai: '1900.8946',
                matKhau: adminPassHash,
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                vaiTro: 'admin',
                hangThanhVien: 'Admin Toàn Quyền',
                diemTichLuy: 99999
            });

            await adminMoi.save();
            console.log('  👑 Đã khởi tạo tài khoản Admin mặc định: admin@laptopnew.vn (Mật khẩu: admin123)');
        } else if (adminDaCo.vaiTro !== 'admin') {
            adminDaCo.vaiTro = 'admin';
            await adminDaCo.save();
            console.log('  👑 Đã cấp quyền Admin cho tài khoản: admin@laptopnew.vn');
        }

        console.log('🎉 Hoàn tất migration dữ liệu người dùng an toàn!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (loi) {
        console.error('❌ Lỗi migration:', loi);
        process.exit(1);
    }
};

migrateUsers();
