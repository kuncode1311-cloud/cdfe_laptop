const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../.env') });

const DanhGia = require('../models/danh-gia.model');
const SanPham = require('../models/san-pham.model');
const NguoiDung = require('../models/nguoi-dung.model');
const DonHang = require('../models/don-hang.model');

// Danh sách avatar đẹp, phong phú
const AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
];

async function napSieuDuLieuDanhGia() {
    try {
        console.log('⏳ Đang kết nối tới MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Kết nối MongoDB Atlas thành công!');

        // 45 Đánh giá chất lượng cao phân bổ đều cho Laptop, Linh kiện, Bàn phím, Chuột, Tai nghe...
        const danhSachDanhGia = [
            // --- 4 ĐÁNH GIÁ MỚI NHẤT (SẼ HIỂN THỊ TRÊN TRANG CHỦ) ---
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
                avatar: AVATARS[1],
                diaDiemMua: 'Hải Châu, Đà Nẵng',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: ['/images/sp/macbook_pro_m3.jpg'],
                luot_thich: 32,
                da_mua_hang: true, // [ĐÃ MUA]
                ngay_danh_gia: '15/09/2026',
                createdAt: new Date('2026-09-15T15:00:00Z')
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
                avatar: AVATARS[3],
                diaDiemMua: 'Showroom Cầu Giấy, Hà Nội',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 28,
                da_mua_hang: false, // [KHÁCH VÃNG LAI]
                ngay_danh_gia: '14/09/2026',
                createdAt: new Date('2026-09-14T16:30:00Z')
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
                avatar: AVATARS[0],
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: ['/images/sp/asus_rog_scar18.jpg'],
                luot_thich: 24,
                da_mua_hang: true, // [ĐÃ MUA]
                ngay_danh_gia: '14/09/2026',
                createdAt: new Date('2026-09-14T10:15:00Z')
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
                avatar: AVATARS[2],
                diaDiemMua: 'Cầu Giấy, Hà Nội',
                thoi_gian_dung: 'Đã dùng 2 tuần',
                hinh_anh_dinh_kem: ['/images/sp/lenovo_legion_pro7.jpg'],
                luot_thich: 19,
                da_mua_hang: true, // [ĐÃ MUA]
                ngay_danh_gia: '13/09/2026',
                createdAt: new Date('2026-09-13T09:00:00Z')
            },

            // --- CÁC ĐÁNH GIÁ CHI TIẾT SẢN PHẨM KHÁC ---
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
                avatar: AVATARS[3],
                diaDiemMua: 'Ninh Kiều, Cần Thơ',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 18,
                da_mua_hang: true,
                ngay_danh_gia: '12/09/2026',
                createdAt: new Date('2026-09-12T14:00:00Z')
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
                avatar: AVATARS[0],
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 12,
                da_mua_hang: false, // [KHÁCH VÃNG LAI]
                ngay_danh_gia: '11/09/2026',
                createdAt: new Date('2026-09-11T10:00:00Z')
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
                avatar: AVATARS[4],
                diaDiemMua: 'Hải Châu, Đà Nẵng',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 21,
                da_mua_hang: false, // [KHÁCH VÃNG LAI]
                ngay_danh_gia: '10/09/2026',
                createdAt: new Date('2026-09-10T08:00:00Z')
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
                avatar: AVATARS[3],
                diaDiemMua: 'Ninh Kiều, Cần Thơ',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: ['/images/sp/dell_xps_16.jpg'],
                luot_thich: 15,
                da_mua_hang: true,
                ngay_danh_gia: '09/09/2026',
                createdAt: new Date('2026-09-09T09:30:00Z')
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
                avatar: AVATARS[0],
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 2 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 9,
                da_mua_hang: true,
                ngay_danh_gia: '08/09/2026',
                createdAt: new Date('2026-09-08T11:00:00Z')
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
                avatar: AVATARS[7],
                diaDiemMua: 'Showroom Q.1, TP.HCM',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 14,
                da_mua_hang: false, // [KHÁCH VÃNG LAI]
                ngay_danh_gia: '07/09/2026',
                createdAt: new Date('2026-09-07T15:00:00Z')
            },
            {
                id: 'dg-11',
                id_san_pham: 'asus-zephyrus-g16-2026',
                id_nguoi_dung: 'usr-05',
                ho_ten: 'Đỗ Minh Đức',
                so_dien_thoai: '0961122334',
                so_sao: 5,
                tieu_de: 'Mỏng nhẹ mà cấu hình RTX 4080 quá khủng',
                noi_dung: 'Máy chỉ dày 1.49cm nhưng cân mượt Black Myth Wukong mức Ray Tracing cao nhất. Loa 6 driver nghe nhạc bass cực sâu.',
                ngheNghiep: 'Game Developer',
                avatar: AVATARS[5],
                diaDiemMua: 'Cầu Giấy, Hà Nội',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 25,
                da_mua_hang: true,
                ngay_danh_gia: '06/09/2026',
                createdAt: new Date('2026-09-06T14:20:00Z')
            },
            {
                id: 'dg-12',
                id_san_pham: 'lenovo-legion-9i-gen9',
                id_nguoi_dung: 'usr-06',
                ho_ten: 'Trần Đình Trọng',
                so_dien_thoai: '0919988776',
                so_sao: 5,
                tieu_de: 'Tản nhiệt nước tích hợp đỉnh của chóp',
                noi_dung: 'Vỏ carbon rèn đúc mỗi chiếc máy là một vân duy nhất không đụng hàng. Hệ thống tản nhiệt nước chạy cực kỳ êm ái.',
                ngheNghiep: 'CEO Công Nghệ',
                avatar: AVATARS[8],
                diaDiemMua: 'Hải Châu, Đà Nẵng',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: [],
                luot_thich: 37,
                da_mua_hang: true,
                ngay_danh_gia: '05/09/2026',
                createdAt: new Date('2026-09-05T10:00:00Z')
            },
            {
                id: 'dg-13',
                id_san_pham: 'chuot-logitech-mx-master-3s',
                id_nguoi_dung: 'usr-03',
                ho_ten: 'Lê Hoàng Long',
                so_dien_thoai: '0934567890',
                so_sao: 5,
                tieu_de: 'Con chuột văn phòng số 1 thế giới',
                noi_dung: 'Con lăn MagSpeed cuộn 1000 dòng/giây cực đã, bấm êm không tiếng ồn. Kết nối 3 thiết bị chuyển đổi tức thì rất tiện.',
                ngheNghiep: 'Senior Tech Lead',
                avatar: AVATARS[1],
                diaDiemMua: 'Hải Châu, Đà Nẵng',
                thoi_gian_dung: 'Đã dùng 2 tháng',
                hinh_anh_dinh_kem: [],
                luot_thich: 41,
                da_mua_hang: true,
                ngay_danh_gia: '04/09/2026',
                createdAt: new Date('2026-09-04T16:00:00Z')
            },
            {
                id: 'dg-14',
                id_san_pham: 'ban-phim-co-asus-rog-azoth',
                id_nguoi_dung: 'usr-01',
                ho_ten: 'Nguyễn Văn An',
                so_dien_thoai: '0912345678',
                so_sao: 5,
                tieu_de: 'Bàn phím cơ đỉnh cao có màn hình OLED',
                noi_dung: 'Switch NX đã được lube sẵn gõ cực đầm và mượt. Màn hình OLED hiển thị thông số CPU và bài hát đang phát rất tiện lợi.',
                ngheNghiep: '3D Artist & KTS',
                avatar: AVATARS[0],
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: [],
                luot_thich: 30,
                da_mua_hang: true,
                ngay_danh_gia: '03/09/2026',
                createdAt: new Date('2026-09-03T11:45:00Z')
            },
            {
                id: 'dg-15',
                id_san_pham: 'tai-nghe-sony-wh-1000xm5',
                id_nguoi_dung: 'usr-07',
                ho_ten: 'Ngô Thanh Vân',
                so_dien_thoai: '0988223344',
                so_sao: 5,
                tieu_de: 'Chống ồn đỉnh cao, đeo êm cả ngày',
                noi_dung: 'Đi máy bay hay ngồi quán cafe bật chống ồn ANC lên là không gian hoàn toàn yên tĩnh. Chất âm trầm ấm, mic đàm thoại trong trẻo.',
                ngheNghiep: 'Product Manager',
                avatar: AVATARS[6],
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 33,
                da_mua_hang: true,
                ngay_danh_gia: '02/09/2026',
                createdAt: new Date('2026-09-02T09:15:00Z')
            },
            {
                id: 'dg-16',
                id_san_pham: 'acer-predator-helios-18-ai',
                id_nguoi_dung: 'usr-08',
                ho_ten: 'Bùi Quốc Anh',
                so_dien_thoai: '0915667788',
                so_sao: 5,
                tieu_de: 'Quạt Aeroblade 3D thế hệ 5 mát bất ngờ',
                noi_dung: 'Máy to nạc đầm tay, màn hình 18 inch rộng thênh thang làm đồ họa và chơi game rất sướng. Đèn RGB viền đuôi máy phong cách sci-fi.',
                ngheNghiep: 'Họa Sĩ Concept 3D',
                avatar: AVATARS[9],
                diaDiemMua: 'Ninh Kiều, Cần Thơ',
                thoi_gian_dung: 'Đã dùng 2 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 17,
                da_mua_hang: true,
                ngay_danh_gia: '01/09/2026',
                createdAt: new Date('2026-09-01T15:30:00Z')
            },
            {
                id: 'dg-17',
                id_san_pham: 'asus-zenbook-14-oled-ai',
                id_nguoi_dung: 'usr-02',
                ho_ten: 'Trần Thị Mai',
                so_dien_thoai: '0987654321',
                so_sao: 5,
                tieu_de: 'Mỏng nhẹ 1.2kg, pin trâu 15 tiếng',
                noi_dung: 'Vác máy đi học và đi làm cả ngày không cần đem cục sạc. Màn hình Lumina OLED 3K 120Hz xem phim Netflix chuẩn màu cực nét.',
                ngheNghiep: 'Data Analyst',
                avatar: AVATARS[2],
                diaDiemMua: 'Cầu Giấy, Hà Nội',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: [],
                luot_thich: 26,
                da_mua_hang: true,
                ngay_danh_gia: '31/08/2026',
                createdAt: new Date('2026-08-31T14:00:00Z')
            },
            {
                id: 'dg-18',
                id_san_pham: 'msi-titan-18-hx-a14v',
                id_nguoi_dung: null,
                ho_ten: 'Dương Văn Khoa',
                so_dien_thoai: '0909887766',
                so_sao: 5,
                tieu_de: 'Trải nghiệm cỗ máy gaming mạnh nhất hành tinh',
                noi_dung: 'Đến trải nghiệm máy tại showroom TNTP, quạt tản nhiệt buồng hơi lớn nhất thị trường. Bàn phím cơ Cherry switch gõ sướng tê tay.',
                ngheNghiep: 'Lập Trình Viên Đồ Họa',
                avatar: AVATARS[7],
                diaDiemMua: 'Showroom Q.1, TP.HCM',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 19,
                da_mua_hang: false, // [KHÁCH VÃNG LAI]
                ngay_danh_gia: '30/08/2026',
                createdAt: new Date('2026-08-30T16:00:00Z')
            },
            {
                id: 'dg-19',
                id_san_pham: 'dell-alienware-m18-r2',
                id_nguoi_dung: 'usr-09',
                ho_ten: 'Nguyễn Tấn Phát',
                so_dien_thoai: '0938112233',
                so_sao: 5,
                tieu_de: 'Thiết kế người ngoài hành tinh quá cuốn hút',
                noi_dung: 'Logo đầu Alienware phát sáng đổi màu cực ngầu. Màn hình QHD+ 165Hz màu sắc trong trẻo, build khung magie chắc nịch.',
                ngheNghiep: 'Game Streamer',
                avatar: AVATARS[1],
                diaDiemMua: 'Hải Châu, Đà Nẵng',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 22,
                da_mua_hang: true,
                ngay_danh_gia: '29/08/2026',
                createdAt: new Date('2026-08-29T10:30:00Z')
            },
            {
                id: 'dg-20',
                id_san_pham: 'macbook-air-15-m3',
                id_nguoi_dung: 'usr-10',
                ho_ten: 'Lâm Gia Tuệ',
                so_dien_thoai: '0971239988',
                so_sao: 5,
                tieu_de: 'Chiếc laptop hoàn hảo cho công việc văn phòng',
                noi_dung: 'Không quạt tản nhiệt nên yên tĩnh tuyệt đối 100%. Màn hình 15.3 inch rộng rãi làm excel và đa nhiệm rất thoải mái.',
                ngheNghiep: 'Chuyên Viên Tài Chính',
                avatar: AVATARS[4],
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: [],
                luot_thich: 29,
                da_mua_hang: true,
                ngay_danh_gia: '28/08/2026',
                createdAt: new Date('2026-08-28T09:00:00Z')
            },
            {
                id: 'dg-21',
                id_san_pham: 'ban-phim-co-custom-glyph-75',
                id_nguoi_dung: 'usr-01',
                ho_ten: 'Nguyễn Văn An',
                so_dien_thoai: '0912345678',
                so_sao: 5,
                tieu_de: 'Gasket mount gõ êm tai như gõ bơ',
                noi_dung: 'Vỏ nhôm CNC anodized cực mịn, âm thanh thock trầm ấm gây nghiện. Núm xoay âm lượng kim loại xoay rất đã tay.',
                ngheNghiep: '3D Artist',
                avatar: AVATARS[0],
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 2 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 35,
                da_mua_hang: true,
                ngay_danh_gia: '27/08/2026',
                createdAt: new Date('2026-08-27T14:15:00Z')
            },
            {
                id: 'dg-22',
                id_san_pham: 'chuot-gaming-pro-air-8',
                id_nguoi_dung: null,
                ho_ten: 'Phan Minh Hoàng',
                so_dien_thoai: '0944556677',
                so_sao: 5,
                tieu_de: 'Siêu nhẹ 49g vẩy tâm CS2 cực chuẩn',
                noi_dung: 'Trải nghiệm thử tại showroom, form cầm đối xứng ôm sát lòng bàn tay, cảm biến 8K Polling Rate di chuyển không có một chút độ trễ.',
                ngheNghiep: 'Game Thủ FPS',
                avatar: AVATARS[7],
                diaDiemMua: 'Showroom Cầu Giấy, Hà Nội',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 16,
                da_mua_hang: false, // [KHÁCH VÃNG LAI]
                ngay_danh_gia: '26/08/2026',
                createdAt: new Date('2026-08-26T17:00:00Z')
            },
            {
                id: 'dg-23',
                id_san_pham: 'balo-gaming-rog-ranger-18',
                id_nguoi_dung: 'usr-01',
                ho_ten: 'Nguyễn Văn An',
                so_dien_thoai: '0912345678',
                so_sao: 5,
                tieu_de: 'Đựng vừa vặn laptop 18 inch khổng lồ',
                noi_dung: 'Vải chống nước tốt, đệm lưng thoát khí êm ái khi đeo nặng. Nhiều ngăn phụ đựng sạc, chuột, bàn phím rất khoa học.',
                ngheNghiep: '3D Artist',
                avatar: AVATARS[0],
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 18,
                da_mua_hang: true,
                ngay_danh_gia: '25/08/2026',
                createdAt: new Date('2026-08-25T08:30:00Z')
            },
            {
                id: 'dg-24',
                id_san_pham: 'cu-sac-gan-anker-140w-pd31',
                id_nguoi_dung: 'usr-03',
                ho_ten: 'Lê Hoàng Long',
                so_dien_thoai: '0934567890',
                so_sao: 5,
                tieu_de: 'Sạc đầy MacBook Pro 16 trong 1 tiếng',
                noi_dung: 'Chuẩn PD 3.1 công suất 140W cực mạnh mà củ sạc nhỏ bằng nửa củ sạc zin của Apple. Đi công tác chỉ cần mang đúng 1 củ sạc này.',
                ngheNghiep: 'Senior Tech Lead',
                avatar: AVATARS[1],
                diaDiemMua: 'Hải Châu, Đà Nẵng',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: [],
                luot_thich: 27,
                da_mua_hang: true,
                ngay_danh_gia: '24/08/2026',
                createdAt: new Date('2026-08-24T12:00:00Z')
            },
            {
                id: 'dg-25',
                id_san_pham: 'gia-do-tan-nhiet-so-lanh-icepro',
                id_nguoi_dung: null,
                ho_ten: 'Trịnh Quốc Thắng',
                so_dien_thoai: '0912998877',
                so_sao: 5,
                tieu_de: 'Hạ nhiệt độ laptop tức thì 15 độ C',
                noi_dung: 'Showroom có bật thử cho khách test, sò lạnh mát lạnh đóng sương trên bề mặt nhôm. Rất hữu ích cho mùa hè nóng nực.',
                ngheNghiep: 'Sinh Viên Đại Học Bách Khoa',
                avatar: AVATARS[5],
                diaDiemMua: 'Showroom Q.1, TP.HCM',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 13,
                da_mua_hang: false, // [KHÁCH VÃNG LAI]
                ngay_danh_gia: '23/08/2026',
                createdAt: new Date('2026-08-23T11:00:00Z')
            },
            {
                id: 'dg-26',
                id_san_pham: 'hp-omen-transcend-14-ai',
                id_nguoi_dung: 'usr-11',
                ho_ten: 'Bùi Phương Linh',
                so_dien_thoai: '0988776655',
                so_sao: 5,
                tieu_de: 'Màn hình OLED 120Hz đẹp mê hồn',
                noi_dung: 'Thiết kế trắng tinh khôi gốm nhôm ceramic rất sang. Bàn phím có viền trong suốt hắt sáng RGB cực kỳ lung linh trong đêm.',
                ngheNghiep: 'UI/UX Designer',
                avatar: AVATARS[6],
                diaDiemMua: 'Cầu Giấy, Hà Nội',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 20,
                da_mua_hang: true,
                ngay_danh_gia: '22/08/2026',
                createdAt: new Date('2026-08-22T16:20:00Z')
            },
            {
                id: 'dg-27',
                id_san_pham: 'ssd-wd-black-sn850x-2tb',
                id_nguoi_dung: 'usr-01',
                ho_ten: 'Nguyễn Văn An',
                so_dien_thoai: '0912345678',
                so_sao: 5,
                tieu_de: 'Tốc độ 7300MB/s chuẩn game thủ',
                noi_dung: 'Gắn thêm vào khe M.2 thứ 2 của ASUS ROG Scar 18, phần mềm WD Dashboard tối ưu game mode chạy rất ổn định.',
                ngheNghiep: '3D Artist',
                avatar: AVATARS[0],
                diaDiemMua: 'Q.1, TP.HCM',
                thoi_gian_dung: 'Đã dùng 1 tháng',
                hinh_anh_dinh_kem: [],
                luot_thich: 15,
                da_mua_hang: true,
                ngay_danh_gia: '21/08/2026',
                createdAt: new Date('2026-08-21T15:00:00Z')
            },
            {
                id: 'dg-28',
                id_san_pham: 'loa-bluetooth-marshall-emberton-ii',
                id_nguoi_dung: 'usr-02',
                ho_ten: 'Trần Thị Mai',
                so_dien_thoai: '0987654321',
                so_sao: 5,
                tieu_de: 'Âm thanh 360 độ True Stereophonic nghe cực chill',
                noi_dung: 'Pin dùng 30 tiếng liên tục, chống nước IP67 mang đi dã ngoại hay đặt bàn làm việc đều cực kỳ thẩm mỹ.',
                ngheNghiep: 'Data Analyst',
                avatar: AVATARS[2],
                diaDiemMua: 'Cầu Giấy, Hà Nội',
                thoi_gian_dung: 'Đã dùng 2 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 22,
                da_mua_hang: true,
                ngay_danh_gia: '20/08/2026',
                createdAt: new Date('2026-08-20T17:30:00Z')
            },
            {
                id: 'dg-29',
                id_san_pham: 'asus-zenbook-duo-oled-2026',
                id_nguoi_dung: null,
                ho_ten: 'Ngô Kiến Huy',
                so_dien_thoai: '0903344556',
                so_sao: 5,
                tieu_de: '2 màn hình OLED 14 inch cảm ứng độc nhất vô nhị',
                noi_dung: 'Trải nghiệm thực tế tại TNTP Laptop: tháo bàn phím ra để lộ 2 màn hình xếp dọc dựng code và xem tài liệu cùng lúc siêu tiện.',
                ngheNghiep: 'Tech Reviewer',
                avatar: AVATARS[8],
                diaDiemMua: 'Showroom Q.1, TP.HCM',
                thoi_gian_dung: 'Trải nghiệm tại Showroom',
                hinh_anh_dinh_kem: [],
                luot_thich: 38,
                da_mua_hang: false, // [KHÁCH VÃNG LAI]
                ngay_danh_gia: '19/08/2026',
                createdAt: new Date('2026-08-19T14:00:00Z')
            },
            {
                id: 'dg-30',
                id_san_pham: 'de-tan-nhiet-iets-gt500',
                id_nguoi_dung: 'usr-04',
                ho_ten: 'Phạm Minh Tuấn',
                so_dien_thoai: '0976543210',
                so_sao: 5,
                tieu_de: 'Vua đế tản nhiệt laptop hiện nay',
                noi_dung: 'Vòng mút cao su kín khí hút gió cưỡng bức, quạt 5000 RPM ép nhiệt độ GPU giảm thẳng 18-20 độ C khi render video nặng.',
                ngheNghiep: 'Chuyên Viên AI',
                avatar: AVATARS[3],
                diaDiemMua: 'Ninh Kiều, Cần Thơ',
                thoi_gian_dung: 'Đã dùng 3 tuần',
                hinh_anh_dinh_kem: [],
                luot_thich: 19,
                da_mua_hang: true,
                ngay_danh_gia: '18/08/2026',
                createdAt: new Date('2026-08-18T10:00:00Z')
            }
        ];

        console.log(`\n⭐ 1. Nạp toàn bộ ${danhSachDanhGia.length} đánh giá chất lượng cao vào MongoDB Atlas...`);
        await DanhGia.deleteMany({});
        const ketQuaNap = await DanhGia.insertMany(danhSachDanhGia);
        console.log(`  ✓ Đã nạp thành công ${ketQuaNap.length} bản ghi vào collection [danh_gia]!`);

        // 2. Tính toán và cập nhật số lượng đánh giá thực tế cho tất cả sản phẩm
        console.log('\n📊 2. Cập nhật so_luong_danh_gia và diem_danh_gia_tb chuẩn xác cho từng sản phẩm...');
        const tatCaSp = await SanPham.find({});
        for (const sp of tatCaSp) {
            const cacDgCuaSp = danhSachDanhGia.filter(d => d.id_san_pham === sp.id);
            const soLuong = cacDgCuaSp.length;
            const tongDiem = cacDgCuaSp.reduce((s, it) => s + it.so_sao, 0);
            const diemTB = soLuong > 0 ? Math.round((tongDiem / soLuong) * 10) / 10 : 5;

            await SanPham.updateOne(
                { id: sp.id },
                {
                    $set: {
                        so_luong_danh_gia: soLuong,
                        diem_danh_gia_tb: diemTB,
                        danh_gia: cacDgCuaSp
                    }
                }
            );
            if (soLuong > 0) {
                console.log(`  ✓ Sản phẩm [${sp.id}]: ${soLuong} đánh giá (Điểm: ${diemTB})`);
            }
        }

        // 3. Đồng bộ vào FE/db.json
        console.log('\n📁 3. Đồng bộ hoàn chỉnh vào file FE/db.json...');
        const dbJsonPath = path.join(__dirname, '../../FE/db.json');
        if (fs.existsSync(dbJsonPath)) {
            const raw = fs.readFileSync(dbJsonPath, 'utf8');
            const dbData = JSON.parse(raw);

            dbData.danh_gia = danhSachDanhGia;
            dbData.san_pham = dbData.san_pham.map(sp => {
                const cacDg = danhSachDanhGia.filter(d => d.id_san_pham === sp.id);
                const soL = cacDg.length;
                const tongD = cacDg.reduce((s, it) => s + it.so_sao, 0);
                const dTB = soL > 0 ? Math.round((tongD / soL) * 10) / 10 : 5;
                return {
                    ...sp,
                    so_luong_danh_gia: soL,
                    diem_danh_gia_tb: dTB,
                    danh_gia: cacDg
                };
            });

            fs.writeFileSync(dbJsonPath, JSON.stringify(dbData, null, 2), 'utf8');
            console.log('  ✓ Đã đồng bộ thành công FE/db.json!');
        }

        console.log(`\n🎉 HOÀN TẤT THÊM DỮ LIỆU ĐÁNH GIÁ PHONG PHÚ! TỔNG CỘNG: ${danhSachDanhGia.length} ĐÁNH GIÁ!`);
        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Lỗi:', err);
    }
}

napSieuDuLieuDanhGia();
