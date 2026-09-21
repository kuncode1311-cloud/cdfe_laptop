const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const NguoiDung = require('../models/nguoi-dung.model');
const DonHang = require('../models/don-hang.model');
const DanhGia = require('../models/danh-gia.model');
const SanPham = require('../models/san-pham.model');

async function boSungDanhGiaVaNguoiDung() {
    try {
        console.log('⏳ Đang kết nối tới MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB Atlas thành công!');

        const matKhauHash = await bcrypt.hash('123456', 10);

        // 1. Chuẩn bị 4 người dùng thực tế
        const danhSachNguoiDung = [
            {
                id: 'usr-01',
                hoTen: 'Nguyễn Văn An',
                email: 'nguyenvanan@gmail.com',
                soDienThoai: '0912345678',
                matKhau: matKhauHash,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                vaiTro: 'khach_hang',
                hangThanhVien: 'Thành Viên Vàng',
                diemTichLuy: 1200,
                viVoucher: ['GAMING500'],
                daKichHoat: true
            },
            {
                id: 'usr-02',
                hoTen: 'Trần Thị Mai',
                email: 'tranmai@gmail.com',
                soDienThoai: '0987654321',
                matKhau: matKhauHash,
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
                vaiTro: 'khach_hang',
                hangThanhVien: 'Thành Viên Bạc',
                diemTichLuy: 850,
                viVoucher: ['FREESHIP'],
                daKichHoat: true
            },
            {
                id: 'usr-03',
                hoTen: 'Lê Hoàng Long',
                email: 'lehoanglong.dev@gmail.com',
                soDienThoai: '0934567890',
                matKhau: matKhauHash,
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                vaiTro: 'khach_hang',
                hangThanhVien: 'Thành Viên Kim Cương',
                diemTichLuy: 2400,
                viVoucher: ['APPLEVIP', 'MACBOOK1000'],
                daKichHoat: true
            },
            {
                id: 'usr-04',
                hoTen: 'Phạm Minh Tuấn',
                email: 'minhtuan.tech@gmail.com',
                soDienThoai: '0976543210',
                matKhau: matKhauHash,
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                vaiTro: 'khach_hang',
                hangThanhVien: 'Thành Viên VIP',
                diemTichLuy: 1950,
                viVoucher: ['DELLVIP'],
                daKichHoat: true
            }
        ];

        console.log('\n👤 1. Cập nhật bảng [nguoi_dung]...');
        for (const user of danhSachNguoiDung) {
            await NguoiDung.findOneAndUpdate(
                { id: user.id },
                { $set: user },
                { upsert: true, new: true }
            );
            console.log(`  ✓ Đã cập nhật người dùng: [${user.id}] ${user.hoTen}`);
        }

        // 2. Chuẩn bị 4 đơn hàng đã hoàn thành (ĐÃ GIAO HÀNG & ĐÃ THANH TOÁN)
        const danhSachDonHang = [
            {
                id: 'dh-1719200000000',
                ma_don_hang: 'LPN-2026-8899',
                id_nguoi_dung: 'usr-01',
                ngay_tao: '14:30 20/08/2026',
                trang_thai: 'da_giao',
                thong_tin_giao_hang: {
                    ho_ten: 'Nguyễn Văn An',
                    so_dien_thoai: '0912345678',
                    email: 'nguyenvanan@gmail.com',
                    dia_chi_chi_tiet: 'Tòa Landmark 81, 720A Điện Biên Phủ, P.22, Q.Bình Thạnh, TP.HCM',
                    tinh_thanh: 'Hồ Chí Minh',
                    quan_huyen: 'Bình Thạnh',
                    ghi_chu: 'Giao giờ hành chính, gọi trước 15 phút'
                },
                danh_sach_san_pham: [
                    {
                        id_muc: 'muc-1',
                        san_pham_id: 'rog-scar-18-2026',
                        ten_san_pham: 'ASUS ROG Strix SCAR 18 (2026) Core i9-14900HX | RTX 4090',
                        hinh_anh: '/images/sp/asus_rog_scar18.jpg',
                        so_luong: 1,
                        gia_tai_thoi_diem_them: 109990000
                    }
                ],
                tam_tinh: 109990000,
                tien_giam_gia: 500000,
                ma_giam_gia: 'GAMING500',
                phi_van_chuyen: 0,
                tong_tien_thanh_toan: 109490000,
                hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
                da_thanh_toan: true,
                lich_trinh_giao_hang: [
                    { thoi_gian: '14:30 20/08/2026', tieu_de: 'Đặt hàng thành công', hoan_thanh: true },
                    { thoi_gian: '15:00 20/08/2026', tieu_de: 'Đã xác nhận đơn hàng', hoan_thanh: true },
                    { thoi_gian: '16:00 20/08/2026', tieu_de: 'Bàn giao vận chuyển', hoan_thanh: true },
                    { thoi_gian: '17:30 20/08/2026', tieu_de: 'Giao hàng thành công', hoan_thanh: true }
                ]
            },
            {
                id: 'dh-1719200000001',
                ma_don_hang: 'LPN-2026-8901',
                id_nguoi_dung: 'usr-02',
                ngay_tao: '09:15 21/08/2026',
                trang_thai: 'da_giao',
                thong_tin_giao_hang: {
                    ho_ten: 'Trần Thị Mai',
                    so_dien_thoai: '0987654321',
                    email: 'tranmai@gmail.com',
                    dia_chi_chi_tiet: 'Số 48 Cầu Giấy, P.Dịch Vọng, Q.Cầu Giấy, Hà Nội',
                    tinh_thanh: 'Hà Nội',
                    quan_huyen: 'Cầu Giấy',
                    ghi_chu: 'Kiểm tra máy kỹ trước khi nhận'
                },
                danh_sach_san_pham: [
                    {
                        id_muc: 'muc-2',
                        san_pham_id: 'legion-pro-7i-2026',
                        ten_san_pham: 'Lenovo Legion Pro 7i Gen 9 (2026) Core i9-14900HX | RTX 4080 12GB',
                        hinh_anh: '/images/sp/lenovo_legion_pro7.jpg',
                        so_luong: 1,
                        gia_tai_thoi_diem_them: 79990000
                    }
                ],
                tam_tinh: 79990000,
                tien_giam_gia: 0,
                phi_van_chuyen: 0,
                tong_tien_thanh_toan: 79990000,
                hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
                da_thanh_toan: true,
                lich_trinh_giao_hang: [
                    { thoi_gian: '09:15 21/08/2026', tieu_de: 'Đặt hàng thành công', hoan_thanh: true },
                    { thoi_gian: '11:00 21/08/2026', tieu_de: 'Giao hàng thành công', hoan_thanh: true }
                ]
            },
            {
                id: 'dh-1719200000002',
                ma_don_hang: 'LPN-2026-8902',
                id_nguoi_dung: 'usr-03',
                ngay_tao: '10:00 22/08/2026',
                trang_thai: 'da_giao',
                thong_tin_giao_hang: {
                    ho_ten: 'Lê Hoàng Long',
                    so_dien_thoai: '0934567890',
                    email: 'lehoanglong.dev@gmail.com',
                    dia_chi_chi_tiet: 'Số 120 Nguyễn Văn Linh, P.Nam Dương, Q.Hải Châu, TP.Đà Nẵng',
                    tinh_thanh: 'Đà Nẵng',
                    quan_huyen: 'Hải Châu',
                    ghi_chu: 'Giao tận tay, đồng kiểm hàng cao cấp'
                },
                danh_sach_san_pham: [
                    {
                        id_muc: 'muc-3',
                        san_pham_id: 'macbook-pro-16-m3-max',
                        ten_san_pham: 'Apple MacBook Pro 16 inch (2026) M3 Max (16-Core CPU, 40-Core GPU) | 48GB | 1TB',
                        hinh_anh: '/images/sp/macbook_pro_m3.jpg',
                        so_luong: 1,
                        gia_tai_thoi_diem_them: 96990000
                    }
                ],
                tam_tinh: 96990000,
                tien_giam_gia: 1000000,
                ma_giam_gia: 'MACBOOK1000',
                phi_van_chuyen: 0,
                tong_tien_thanh_toan: 95990000,
                hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
                da_thanh_toan: true,
                lich_trinh_giao_hang: [
                    { thoi_gian: '10:00 22/08/2026', tieu_de: 'Đặt hàng thành công', hoan_thanh: true },
                    { thoi_gian: '14:00 22/08/2026', tieu_de: 'Giao hàng hỏa tốc thành công', hoan_thanh: true }
                ]
            },
            {
                id: 'dh-1719200000003',
                ma_don_hang: 'LPN-2026-8903',
                id_nguoi_dung: 'usr-04',
                ngay_tao: '08:45 23/08/2026',
                trang_thai: 'da_giao',
                thong_tin_giao_hang: {
                    ho_ten: 'Phạm Minh Tuấn',
                    so_dien_thoai: '0976543210',
                    email: 'minhtuan.tech@gmail.com',
                    dia_chi_chi_tiet: 'Số 85 Đại Lộ Hòa Bình, P.Tân An, Q.Ninh Kiều, TP.Cần Thơ',
                    tinh_thanh: 'Cần Thơ',
                    quan_huyen: 'Ninh Kiều',
                    ghi_chu: 'Cần cài sẵn phần mềm đồ họa'
                },
                danh_sach_san_pham: [
                    {
                        id_muc: 'muc-4',
                        san_pham_id: 'dell-xps-16-9640',
                        ten_san_pham: 'Dell XPS 16 (9640) Intel Core Ultra 7 155H | RTX 4070 | 32GB | 1TB | 4K+ OLED',
                        hinh_anh: '/images/sp/dell_xps_16.jpg',
                        so_luong: 1,
                        gia_tai_thoi_diem_them: 74990000
                    }
                ],
                tam_tinh: 74990000,
                tien_giam_gia: 0,
                phi_van_chuyen: 0,
                tong_tien_thanh_toan: 74990000,
                hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
                da_thanh_toan: true,
                lich_trinh_giao_hang: [
                    { thoi_gian: '08:45 23/08/2026', tieu_de: 'Đặt hàng thành công', hoan_thanh: true },
                    { thoi_gian: '15:20 23/08/2026', tieu_de: 'Giao hàng thành công', hoan_thanh: true }
                ]
            }
        ];

        console.log('\n📦 2. Cập nhật bảng [don_hang] (chứng minh khách hàng đã mua sản phẩm)...');
        for (const order of danhSachDonHang) {
            await DonHang.findOneAndUpdate(
                { id: order.id },
                { $set: order },
                { upsert: true, new: true }
            );
            console.log(`  ✓ Đã cập nhật đơn hàng: [${order.id}] ${order.thong_tin_giao_hang.ho_ten} -> ${order.danh_sach_san_pham[0]?.ten_san_pham}`);
        }

        // 3. Chuẩn bị 4 đánh giá chuẩn xác tương ứng 4 người dùng và 4 sản phẩm
        const danhSachDanhGia = [
            {
                id: 'dg-01',
                id_san_pham: 'rog-scar-18-2026',
                id_nguoi_dung: 'usr-01',
                ho_ten: 'Nguyễn Văn An',
                ngheNghiep: '3D Artist & KTS',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                so_sao: 5,
                noi_dung: 'Máy build cực kỳ chắc chắn, tản nhiệt kim loại lỏng mát rượi khi render 3D nặng. Giao hàng hỏa tốc trong 2h rất hài lòng!',
                ngay_danh_gia: '25/08/2026',
                da_mua_hang: true,
                diaDiemMua: 'Q.1, TP.HCM',
                luot_thich: 24,
                createdAt: new Date('2026-08-25T14:30:00Z')
            },
            {
                id: 'dg-02',
                id_san_pham: 'legion-pro-7i-2026',
                id_nguoi_dung: 'usr-02',
                ho_ten: 'Trần Thị Mai',
                ngheNghiep: 'Data Analyst & Gamer',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
                so_sao: 5,
                noi_dung: 'Màn hình OLED 240Hz màu sắc chuẩn xác, phím gõ êm, nhân viên hỗ trợ nhiệt tình.',
                ngay_danh_gia: '24/08/2026',
                da_mua_hang: true,
                diaDiemMua: 'Cầu Giấy, Hà Nội',
                luot_thich: 19,
                createdAt: new Date('2026-08-24T10:15:00Z')
            },
            {
                id: 'dg-03',
                id_san_pham: 'macbook-pro-16-m3-max',
                id_nguoi_dung: 'usr-03',
                ho_ten: 'Lê Hoàng Long',
                ngheNghiep: 'Senior Tech Lead',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                so_sao: 5,
                noi_dung: 'Chip M3 Max compile code siêu nhanh, pin 16 tiếng cả ngày không cần sạc. Màn hình Liquid Retina XDR chuẩn màu điện ảnh!',
                ngay_danh_gia: '23/08/2026',
                da_mua_hang: true,
                diaDiemMua: 'Hải Châu, Đà Nẵng',
                luot_thich: 32,
                createdAt: new Date('2026-08-23T11:00:00Z')
            },
            {
                id: 'dg-04',
                id_san_pham: 'dell-xps-16-9640',
                id_nguoi_dung: 'usr-04',
                ho_ten: 'Phạm Minh Tuấn',
                ngheNghiep: 'AI & Creative Director',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                so_sao: 5,
                noi_dung: 'Thiết kế nhôm CNC và kính vô cực cực kỳ sang chảnh, màn 4K OLED vuốt chạm mượt mà. Chip Core Ultra AI hỗ trợ đắc lực.',
                ngay_danh_gia: '22/08/2026',
                da_mua_hang: true,
                diaDiemMua: 'Ninh Kiều, Cần Thơ',
                luot_thich: 15,
                createdAt: new Date('2026-08-22T09:30:00Z')
            }
        ];

        console.log('\n⭐ 3. Cập nhật bảng [danh_gia] trên MongoDB Atlas...');
        // Xóa hoặc upsert chính xác 4 đánh giá
        for (const review of danhSachDanhGia) {
            await DanhGia.findOneAndUpdate(
                { id: review.id },
                { $set: review },
                { upsert: true, new: true }
            );
            console.log(`  ✓ Đã cập nhật đánh giá: [${review.id}] ${review.ho_ten} -> ${review.id_san_pham}`);
        }

        // 4. Đồng bộ file FE/db.json
        console.log('\n📁 4. Đồng bộ dữ liệu vào file FE/db.json...');
        const dbJsonPath = path.join(__dirname, '../../FE/db.json');
        if (fs.existsSync(dbJsonPath)) {
            const raw = fs.readFileSync(dbJsonPath, 'utf8');
            const dbData = JSON.parse(raw);

            // Cập nhật người dùng trong db.json
            for (const user of danhSachNguoiDung) {
                const idx = dbData.nguoi_dung.findIndex(u => u.id === user.id);
                const userCopy = { ...user };
                delete userCopy.matKhau; // không lưu mật khẩu hash vào json public
                if (idx >= 0) {
                    dbData.nguoi_dung[idx] = { ...dbData.nguoi_dung[idx], ...userCopy };
                } else {
                    dbData.nguoi_dung.push(userCopy);
                }
            }

            // Cập nhật đơn hàng trong db.json
            for (const order of danhSachDonHang) {
                const idx = dbData.don_hang.findIndex(o => o.id === order.id);
                if (idx >= 0) {
                    dbData.don_hang[idx] = order;
                } else {
                    dbData.don_hang.push(order);
                }
            }

            // Cập nhật danh_gia trong db.json
            dbData.danh_gia = danhSachDanhGia.map(dg => ({
                id: dg.id,
                id_san_pham: dg.id_san_pham,
                id_nguoi_dung: dg.id_nguoi_dung,
                ho_ten: dg.ho_ten,
                ngheNghiep: dg.ngheNghiep,
                avatar: dg.avatar,
                so_sao: dg.so_sao,
                noi_dung: dg.noi_dung,
                ngay_danh_gia: dg.ngay_danh_gia,
                da_mua_hang: dg.da_mua_hang,
                diaDiemMua: dg.diaDiemMua,
                luot_thich: dg.luot_thich
            }));

            fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
            console.log('  ✓ Đã đồng bộ thành công FE/db.json!');
        }

        console.log('\n🎉 HOÀN TẤT BỔ SUNG DỮ LIỆU ĐÁNH GIÁ CHUẨN XÁC VÀ ĐẦY ĐỦ 100%!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Lỗi khi thực thi:', err);
    }
}

boSungDanhGiaVaNguoiDung();
