const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const DanhGia = require('../models/danh-gia.model');
const SanPham = require('../models/san-pham.model');

async function dongBoDanhGiaToanDien() {
    try {
        console.log('⏳ Đang kết nối tới MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB Atlas thành công!');

        // 1. Danh sách 10 đánh giá chi tiết với đầy đủ mọi trường dữ liệu
        // Phân bổ cả KHÁCH ĐÃ MUA HÀNG (da_mua_hang: true) và KHÁCH VÃNG LAI (da_mua_hang: false)
        const danhSachDanhGia = [
            {
                id: 'dg-01',
                id_san_pham: 'macbook-pro-16-m3-max',
                id_nguoi_dung: 'usr-03',
                ho_ten: 'Lê Hoàng Long',
                so_dien_thoai: '0934567890',
                so_sao: 5,
                tieu_de: 'Hiệu năng vô đối cho lập trình viên',
                noi_dung: 'Chip M3 Max compile code siêu nhanh, pin 16 tiếng cả ngày không cần sạc. Màn hình Liquid Retina XDR chuẩn màu điện ảnh!',
                ngheNghiep: 'Senior Tech Lead',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Hải Châu, Đà Nẵng',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: ['/images/sp/macbook_pro_m3.jpg'],
                luot_thich: 32,
                da_mua_hang: true,
                ngay_danh_gia: '26/08/2026',
                createdAt: new Date('2026-08-26T15:00:00Z')
            },
            {
                id: 'dg-02',
                id_san_pham: 'dell-xps-16-9640',
                id_nguoi_dung: null,
                ho_ten: 'Hoàng Quốc Bảo',
                so_dien_thoai: '0901234888',
                so_sao: 5,
                tieu_de: 'Trải nghiệm màn OLED 4K quá ấn tượng',
                noi_dung: 'Ghé showroom trải nghiệm thử máy, nhân viên tư vấn rất chu đáo. Màn hình 4K OLED vuốt chạm cực nhạy, bàn phím gõ êm tay, thiết kế viền mỏng vô cực siêu đẹp!',
                ngheNghiep: 'Kiến Trúc Sư Tự Do',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Showroom Cầu Giấy, Hà Nội',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 28,
                da_mua_hang: false, // KHÁCH VÃNG LAI (MỚI THỨ 2 -> SẼ LÊN TRANG CHỦ)
                ngay_danh_gia: '25/08/2026',
                createdAt: new Date('2026-08-25T16:30:00Z')
            },
            {
                id: 'dg-03',
                id_san_pham: 'rog-scar-18-2026',
                id_nguoi_dung: 'usr-01',
                ho_ten: 'Nguyễn Văn An',
                so_dien_thoai: '0912345678',
                so_sao: 5,
                tieu_de: 'Quái vật gaming và render đồ họa',
                noi_dung: 'Máy build cực kỳ chắc chắn, tản nhiệt kim loại lỏng mát rượi khi render 3D nặng. Giao hàng hỏa tốc trong 2h rất hài lòng!',
                ngheNghiep: '3D Artist & KTS',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: ['/images/sp/asus_rog_scar18.jpg'],
                luot_thich: 24,
                da_mua_hang: true,
                ngay_danh_gia: '25/08/2026',
                createdAt: new Date('2026-08-25T10:15:00Z')
            },
            {
                id: 'dg-04',
                id_san_pham: 'legion-pro-7i-2026',
                id_nguoi_dung: 'usr-02',
                ho_ten: 'Trần Thị Mai',
                so_dien_thoai: '0987654321',
                so_sao: 5,
                tieu_de: 'Màn hình đẹp, bàn phím gõ êm',
                noi_dung: 'Màn hình OLED 240Hz màu sắc chuẩn xác, phím gõ êm, tản nhiệt buồng hơi vapor chamber rất mát, chơi game AAA mượt mà.',
                ngheNghiep: 'Data Analyst & Gamer',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Cầu Giấy, Hà Nội',
                thoi_gian_dung: 'Đã dùng 2 tuần',
                hinh_anh_dinh_kem: ['/images/sp/lenovo_legion_pro7.jpg'],
                luot_thich: 19,
                da_mua_hang: true,
                ngay_danh_gia: '24/08/2026',
                createdAt: new Date('2026-08-24T09:00:00Z')
            },
            {
                id: 'dg-05',
                id_san_pham: 'samsung-990-pro-2tb',
                id_nguoi_dung: 'usr-04',
                ho_ten: 'Phạm Minh Tuấn',
                so_dien_thoai: '0976543210',
                so_sao: 5,
                tieu_de: 'Tốc độ đọc ghi cực nhanh 7.450 MB/s',
                noi_dung: 'Nâng cấp cho dàn máy render AI, tốc độ load dataset và model dung lượng lớn cực kỳ ấn tượng. Heatsink nhôm tản nhiệt rất mát khi hoạt động liên tục.',
                ngheNghiep: 'Chuyên Viên AI',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Ninh Kiều, Cần Thơ',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 18,
                da_mua_hang: true,
                ngay_danh_gia: '23/08/2026',
                createdAt: new Date('2026-08-23T14:00:00Z')
            },
            {
                id: 'dg-06',
                id_san_pham: 'samsung-990-pro-2tb',
                id_nguoi_dung: null,
                ho_ten: 'Lê Hải Nam',
                so_dien_thoai: '0933889900',
                so_sao: 5,
                tieu_de: 'Tốc độ đọc ghi kinh hoàng!',
                noi_dung: 'Gắn vào laptop boot win mất đúng 3 giây, mở file Photoshop 4GB trong nháy mắt. Tản nhiệt heatsink rất mát.',
                ngheNghiep: 'Game Streamer',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 12,
                da_mua_hang: false, // KHÁCH VÃNG LAI TRÊN TRANG CHI TIẾT
                ngay_danh_gia: '19/08/2026',
                createdAt: new Date('2026-08-19T10:00:00Z')
            },
            {
                id: 'dg-07',
                id_san_pham: 'macbook-pro-16-m3-max',
                id_nguoi_dung: null,
                ho_ten: 'Đặng Thu Hà',
                so_dien_thoai: '0977665544',
                so_sao: 5,
                tieu_de: 'Render 8K ProRes mượt không tưởng',
                noi_dung: 'Đến showroom trải nghiệm thử DaVinci Resolve dựng timeline 8K nhiều layer máy chạy mát rượi, loa ngoài nghe như rạp hát mini.',
                ngheNghiep: 'Video Editor & Colorist',
                avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Hải Châu, Đà Nẵng',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 21,
                da_mua_hang: false, // KHÁCH VÃNG LAI
                ngay_danh_gia: '22/08/2026',
                createdAt: new Date('2026-08-22T08:00:00Z')
            },
            {
                id: 'dg-08',
                id_san_pham: 'dell-xps-16-9640',
                id_nguoi_dung: 'usr-04',
                ho_ten: 'Phạm Minh Tuấn',
                so_dien_thoai: '0976543210',
                so_sao: 5,
                tieu_de: 'Đẳng cấp laptop doanh nhân và sáng tạo',
                noi_dung: 'Thiết kế nhôm CNC và kính vô cực cực kỳ sang chảnh, màn 4K OLED vuốt chạm mượt mà. Chip Core Ultra AI hỗ trợ đắc lực công việc đồ họa.',
                ngheNghiep: 'AI & Creative Director',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Ninh Kiều, Cần Thơ',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: ['/images/sp/dell_xps_16.jpg'],
                luot_thich: 15,
                da_mua_hang: true,
                ngay_danh_gia: '21/08/2026',
                createdAt: new Date('2026-08-21T09:30:00Z')
            },
            {
                id: 'dg-09',
                id_san_pham: 'kingston-fury-renegade-rgb-32gb',
                id_nguoi_dung: 'usr-01',
                ho_ten: 'Nguyễn Văn An',
                so_dien_thoai: '0912345678',
                so_sao: 5,
                tieu_de: 'Bus 6000MHz chạy XMP nhận ngay',
                noi_dung: 'Lắp vào mainboard bật Intel XMP nhận luôn bus 6000MHz cực kỳ ổn định, LED RGB đồng bộ rất lung linh.',
                ngheNghiep: '3D Artist',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 2 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 9,
                da_mua_hang: true,
                ngay_danh_gia: '20/08/2026',
                createdAt: new Date('2026-08-20T11:00:00Z')
            },
            {
                id: 'dg-10',
                id_san_pham: 'rog-scar-18-2026',
                id_nguoi_dung: null,
                ho_ten: 'Vũ Hoàng Nam',
                so_dien_thoai: '0945667788',
                so_sao: 5,
                tieu_de: 'Màn hình 18 inch 2.5K 240Hz quá đã',
                noi_dung: 'Đến showroom trải nghiệm thử màn hình Nebula HDR 240Hz độ sáng 1100 nits xem phim và chơi game quá phê. Rất đáng đồng tiền.',
                ngheNghiep: 'Kỹ Sư Phần Mềm',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                diaDiemMua: 'Showroom Q.1, TP.HCM',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 14,
                da_mua_hang: false, // KHÁCH VÃNG LAI
                ngay_danh_gia: '18/08/2026',
                createdAt: new Date('2026-08-18T15:00:00Z')
            }
        ];

        console.log('\n⭐ 1. Cập nhật bảng [danh_gia] trên MongoDB Atlas...');
        // Xóa bảng danh_gia cũ và nạp lại toàn bộ 10 bản ghi chuẩn
        await DanhGia.deleteMany({});
        const ketQuaNap = await DanhGia.insertMany(danhSachDanhGia);
        console.log(`  ✓ Đã nạp thành công ${ketQuaNap.length} đánh giá vào MongoDB Atlas!`);

        // 2. Tính toán lại đúng số lượng đánh giá và điểm trung bình cho từng sản phẩm trong san_pham
        console.log('\n📊 2. Cập nhật số lượng và điểm trung bình chuẩn xác cho từng sản phẩm trong [san_pham]...');
        const tatCaSanPham = await SanPham.find({});
        for (const sp of tatCaSanPham) {
            const cacDanhGia = danhSachDanhGia.filter(d => d.id_san_pham === sp.id);
            const soLuong = cacDanhGia.length;
            const tongDiem = cacDanhGia.reduce((sum, item) => sum + item.so_sao, 0);
            const diemTB = soLuong > 0 ? Math.round((tongDiem / soLuong) * 10) / 10 : 5;

            await SanPham.updateOne(
                { id: sp.id },
                {
                    $set: {
                        so_luong_danh_gia: soLuong,
                        diem_danh_gia_tb: diemTB
                    }
                }
            );
            if (soLuong > 0) {
                console.log(`  ✓ Sản phẩm [${sp.id}]: ${soLuong} đánh giá, điểm TB: ${diemTB}`);
            }
        }

        // 3. Đồng bộ vào FE/db.json
        console.log('\n📁 3. Đồng bộ dữ liệu vào file FE/db.json...');
        const dbJsonPath = path.join(__dirname, '../../FE/db.json');
        if (fs.existsSync(dbJsonPath)) {
            const raw = fs.readFileSync(dbJsonPath, 'utf8');
            const dbData = JSON.parse(raw);

            // Cập nhật danh_gia trong db.json
            dbData.danh_gia = danhSachDanhGia;

            // Cập nhật so_luong_danh_gia trong danh_sach san_pham của db.json
            dbData.san_pham = dbData.san_pham.map(sp => {
                const cacDanhGia = danhSachDanhGia.filter(d => d.id_san_pham === sp.id);
                const soLuong = cacDanhGia.length;
                const tongDiem = cacDanhGia.reduce((sum, item) => sum + item.so_sao, 0);
                const diemTB = soLuong > 0 ? Math.round((tongDiem / soLuong) * 10) / 10 : 5;
                return {
                    ...sp,
                    so_luong_danh_gia: soLuong,
                    diem_danh_gia_tb: diemTB,
                    danh_gia: cacDanhGia
                };
            });

            fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
            console.log('  ✓ Đã đồng bộ thành công FE/db.json!');
        }

        console.log('\n🎉 HOÀN TẤT ĐỒNG BỘ 100%! TOÀN BỘ SỐ LIỆU ĐÃ CHUẨN XÁC VÀ KHỚP VỚI DB!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Lỗi:', err);
    }
}

dongBoDanhGiaToanDien();
