const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const DonHang = require('../models/don-hang.model');

const danhSachDonHangMau = [
    {
        id: 'dh-2026-001',
        ma_don_hang: 'LPN-2026-9101',
        id_nguoi_dung: 'usr-101',
        ngay_tao: '09:30 21/09/2026',
        trang_thai: 'cho_xac_nhan',
        thong_tin_giao_hang: {
            ho_ten: 'Đỗ Minh Quân',
            ho_va_ten: 'Đỗ Minh Quân',
            so_dien_thoai: '0918765432',
            email: 'quan.dominh@gmail.com',
            dia_chi_chi_tiet: 'Số 18 Hoàng Diệu, P.Quán Thánh',
            quan_huyen: 'Ba Đình',
            tinh_thanh: 'Hà Nội',
            ghi_chu: 'Gọi xác nhận trước khi gửi hàng'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-101',
                san_pham_id: 'asus-zenbook-14-oled-ai',
                ten_san_pham: 'ASUS Zenbook 14 OLED (2026) Intel Core Ultra 7 155H | 32GB | 1TB | 14" 3K OLED 120Hz',
                hinh_anh: '/images/sp/asus_zenbook_oled.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 29990000
            }
        ],
        tam_tinh: 29990000,
        tien_giam_gia: 0,
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 29990000,
        hinh_thuc_thanh_toan: 'cod',
        da_thanh_toan: false,
        lich_trinh_giao_hang: [
            { thoi_gian: '09:30 21/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-002',
        ma_don_hang: 'LPN-2026-9102',
        id_nguoi_dung: 'usr-102',
        ngay_tao: '10:15 21/09/2026',
        trang_thai: 'cho_xac_nhan',
        thong_tin_giao_hang: {
            ho_ten: 'Hoàng Bích Thủy',
            ho_va_ten: 'Hoàng Bích Thủy',
            so_dien_thoai: '0982345678',
            email: 'thuy.hoang@vinfast.vn',
            dia_chi_chi_tiet: 'Chung cư Vinhomes Central Park, 208 Nguyễn Hữu Cảnh, P.22',
            quan_huyen: 'Bình Thạnh',
            tinh_thanh: 'Hồ Chí Minh',
            ghi_chu: 'Giao trong giờ hành chính, bọc chống sốc kỹ'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-102',
                san_pham_id: 'macbook-pro-16-m3-max',
                ten_san_pham: 'Apple MacBook Pro 16 inch (2026) M3 Max (16-Core CPU, 40-Core GPU) | 48GB | 1TB',
                hinh_anh: '/images/sp/macbook_pro_m3.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 96990000
            }
        ],
        tam_tinh: 96990000,
        tien_giam_gia: 1000000,
        ma_giam_gia: 'APPLEVIP',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 95990000,
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        da_thanh_toan: true,
        lich_trinh_giao_hang: [
            { thoi_gian: '10:15 21/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-003',
        ma_don_hang: 'LPN-2026-9103',
        id_nguoi_dung: 'usr-103',
        ngay_tao: '11:45 21/09/2026',
        trang_thai: 'cho_xac_nhan',
        thong_tin_giao_hang: {
            ho_ten: 'Vũ Đức Nam',
            ho_va_ten: 'Vũ Đức Nam',
            so_dien_thoai: '0909123456',
            email: 'nam.vuduc@fpt.com.vn',
            dia_chi_chi_tiet: 'Số 45 Đường 30/4, P.An Lạc',
            quan_huyen: 'Ninh Kiều',
            tinh_thanh: 'Cần Thơ',
            ghi_chu: 'Cho kiểm tra máy trước khi thanh toán'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-103',
                san_pham_id: 'hp-omen-transcend-14-ai',
                ten_san_pham: 'HP OMEN Transcend 14 (2026) Core Ultra 9 185H | RTX 4070 | 32GB | 1TB | 2.8K OLED',
                hinh_anh: '/images/sp/hp_omen_14.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 52990000
            }
        ],
        tam_tinh: 52990000,
        tien_giam_gia: 0,
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 52990000,
        hinh_thuc_thanh_toan: 'cod',
        da_thanh_toan: false,
        lich_trinh_giao_hang: [
            { thoi_gian: '11:45 21/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-004',
        ma_don_hang: 'LPN-2026-9114',
        id_nguoi_dung: 'usr-104',
        ngay_tao: '08:10 21/09/2026',
        trang_thai: 'da_xac_nhan',
        thong_tin_giao_hang: {
            ho_ten: 'Ngô Thanh Tùng',
            ho_va_ten: 'Ngô Thanh Tùng',
            so_dien_thoai: '0971999888',
            email: 'thanhtung.ngo@vtv.vn',
            dia_chi_chi_tiet: 'Số 32 Nguyễn Thái Học, P.Điện Biên',
            quan_huyen: 'Ba Đình',
            tinh_thanh: 'Hà Nội',
            ghi_chu: 'Giao hỏa tốc trong ngày, gọi trước khi đến'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-104',
                san_pham_id: 'rog-scar-18-2026',
                ten_san_pham: 'ASUS ROG Strix SCAR 18 (2026) Core i9-14900HX | RTX 4090 | 64GB | 2TB | 18" 2.5K 240Hz',
                hinh_anh: '/images/sp/asus_rog_scar18.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 109990000
            }
        ],
        tam_tinh: 109990000,
        tien_giam_gia: 500000,
        ma_giam_gia: 'GAMINGVIP',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 109490000,
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        da_thanh_toan: true,
        lich_trinh_giao_hang: [
            { thoi_gian: '08:10 21/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '09:00 21/09/2026', tieu_de: 'Đã xác nhận & đang đóng gói', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-1719200000003',
        ma_don_hang: 'LPN-2026-8903',
        id_nguoi_dung: 'usr-04',
        ngay_tao: '08:45 20/09/2026',
        trang_thai: 'da_xac_nhan',
        thong_tin_giao_hang: {
            ho_ten: 'Phạm Minh Tuấn',
            ho_va_ten: 'Phạm Minh Tuấn',
            so_dien_thoai: '0976543210',
            email: 'minhtuan.tech@gmail.com',
            dia_chi_chi_tiet: 'Số 85 Đại Lộ Hòa Bình, P.Tân An',
            quan_huyen: 'Ninh Kiều',
            tinh_thanh: 'Cần Thơ',
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
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 74990000,
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        da_thanh_toan: true,
        lich_trinh_giao_hang: [
            { thoi_gian: '08:45 20/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '09:30 20/09/2026', tieu_de: 'Đã xác nhận & đang đóng gói', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-005',
        ma_don_hang: 'LPN-2026-9104',
        id_nguoi_dung: 'usr-105',
        ngay_tao: '14:20 20/09/2026',
        trang_thai: 'da_xac_nhan',
        thong_tin_giao_hang: {
            ho_ten: 'Nguyễn Tuấn Kiệt',
            ho_va_ten: 'Nguyễn Tuấn Kiệt',
            so_dien_thoai: '0935123987',
            email: 'tuankiet.danang@gmail.com',
            dia_chi_chi_tiet: 'Số 234 Lê Duẩn, P.Tân Chính',
            quan_huyen: 'Thanh Khê',
            tinh_thanh: 'Đà Nẵng',
            ghi_chu: 'Đồng kiểm máy cẩn thận'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-105',
                san_pham_id: 'acer-predator-helios-18-ai',
                ten_san_pham: 'Acer Predator Helios 18 (2026) Core i9-14900HX | RTX 4080 12GB | 32GB | 1TB',
                hinh_anh: '/images/sp/acer_predator_helios.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 79990000
            }
        ],
        tam_tinh: 79990000,
        tien_giam_gia: 0,
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 79990000,
        hinh_thuc_thanh_toan: 'cod',
        da_thanh_toan: false,
        lich_trinh_giao_hang: [
            { thoi_gian: '14:20 20/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '15:00 20/09/2026', tieu_de: 'Đã xác nhận & đang đóng gói', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-006',
        ma_don_hang: 'LPN-2026-9105',
        id_nguoi_dung: 'usr-106',
        ngay_tao: '16:00 20/09/2026',
        trang_thai: 'da_xac_nhan',
        thong_tin_giao_hang: {
            ho_ten: 'Phan Thanh Hà',
            ho_va_ten: 'Phan Thanh Hà',
            so_dien_thoai: '0944888999',
            email: 'thanhha.hp@gmail.com',
            dia_chi_chi_tiet: 'Số 12 Lạch Tray, P.Lạch Tray',
            quan_huyen: 'Ngô Quyền',
            tinh_thanh: 'Hải Phòng',
            ghi_chu: 'Đóng hộp linh kiện nguyên seal'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-106a',
                san_pham_id: 'samsung-990-pro-2tb',
                ten_san_pham: 'Ổ Cứng SSD Samsung 990 PRO 2TB M.2 NVMe PCIe 4.0 Heatsink',
                hinh_anh: '/images/sp/samsung_990_ssd.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 4690000
            },
            {
                id_muc: 'muc-106b',
                san_pham_id: 'kingston-fury-renegade-rgb-32gb',
                ten_san_pham: 'Bộ Nhớ RAM Kingston FURY Renegade DDR5 RGB 32GB (2x16GB) Bus 6400MHz',
                hinh_anh: '/images/sp/kingston_fury_ram.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 3690000
            }
        ],
        tam_tinh: 8380000,
        tien_giam_gia: 200000,
        ma_giam_gia: 'UPGRADE200',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 8180000,
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        da_thanh_toan: true,
        lich_trinh_giao_hang: [
            { thoi_gian: '16:00 20/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '16:30 20/09/2026', tieu_de: 'Đã xác nhận đơn linh kiện', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-007',
        ma_don_hang: 'LPN-2026-9106',
        id_nguoi_dung: 'usr-107',
        ngay_tao: '08:30 19/09/2026',
        trang_thai: 'dang_giao',
        thong_tin_giao_hang: {
            ho_ten: 'Trần Quang Khải',
            ho_va_ten: 'Trần Quang Khải',
            so_dien_thoai: '0913555777',
            email: 'quangkhai.ceo@gmail.com',
            dia_chi_chi_tiet: 'Biệt thự Thảo Điền, Số 15 Nguyễn Văn Hưởng, P.Thảo Điền',
            quan_huyen: 'Thủ Đức',
            tinh_thanh: 'Hồ Chí Minh',
            ghi_chu: 'Hàng giá trị cao giao tận tay chính chủ'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-107',
                san_pham_id: 'msi-titan-18-hx-a14v',
                ten_san_pham: 'MSI Titan 18 HX A14VIG Core i9-14900HX | RTX 4090 16GB | 128GB RAM | 4TB SSD',
                hinh_anh: '/images/sp/msi_titan_18.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 139990000
            }
        ],
        tam_tinh: 139990000,
        tien_giam_gia: 2000000,
        ma_giam_gia: 'TITAN2M',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 137990000,
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        da_thanh_toan: true,
        lich_trinh_giao_hang: [
            { thoi_gian: '08:30 19/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '09:00 19/09/2026', tieu_de: 'Đã xác nhận đơn', hoan_thanh: true },
            { thoi_gian: '10:00 19/09/2026', tieu_de: 'Đã xuất kho & bàn giao bưu tá', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-008',
        ma_don_hang: 'LPN-2026-9107',
        id_nguoi_dung: 'usr-108',
        ngay_tao: '10:50 19/09/2026',
        trang_thai: 'dang_giao',
        thong_tin_giao_hang: {
            ho_ten: 'Lê Thu Trang',
            ho_va_ten: 'Lê Thu Trang',
            so_dien_thoai: '0977222333',
            email: 'thutrang.le@bd.edu.vn',
            dia_chi_chi_tiet: 'Số 56 Đại Lộ Bình Dương, P.Phú Hòa',
            quan_huyen: 'Thủ Dầu Một',
            tinh_thanh: 'Bình Dương',
            ghi_chu: 'Giao trước 17h chiều'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-108',
                san_pham_id: 'asus-zenbook-14-oled-ai',
                ten_san_pham: 'ASUS Zenbook 14 OLED (2026) Intel Core Ultra 7 155H | 32GB | 1TB | 14" 3K OLED',
                hinh_anh: '/images/sp/asus_zenbook_oled.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 29990000
            }
        ],
        tam_tinh: 29990000,
        tien_giam_gia: 1000000,
        ma_giam_gia: 'GIAM1000',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 28990000,
        hinh_thuc_thanh_toan: 'cod',
        da_thanh_toan: false,
        lich_trinh_giao_hang: [
            { thoi_gian: '10:50 19/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '11:30 19/09/2026', tieu_de: 'Đã xác nhận đơn', hoan_thanh: true },
            { thoi_gian: '14:00 19/09/2026', tieu_de: 'Đang vận chuyển hỏa tốc', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-009',
        ma_don_hang: 'LPN-2026-9108',
        id_nguoi_dung: 'usr-109',
        ngay_tao: '15:10 18/09/2026',
        trang_thai: 'dang_giao',
        thong_tin_giao_hang: {
            ho_ten: 'Bùi Quốc Huy',
            ho_va_ten: 'Bùi Quốc Huy',
            so_dien_thoai: '0988666555',
            email: 'quochuy.bui@dongnai.vn',
            dia_chi_chi_tiet: 'Số 102 Võ Thị Sáu, P.Quyết Thắng',
            quan_huyen: 'Biên Hòa',
            tinh_thanh: 'Đồng Nai',
            ghi_chu: 'Cho bật máy kiểm tra màn hình không điểm chết'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-109',
                san_pham_id: 'legion-pro-7i-2026',
                ten_san_pham: 'Lenovo Legion Pro 7i Gen 9 (2026) Core i9-14900HX | RTX 4080 12GB | 32GB | 1TB',
                hinh_anh: '/images/sp/lenovo_legion_pro7.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 79990000
            }
        ],
        tam_tinh: 79990000,
        tien_giam_gia: 0,
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 79990000,
        hinh_thuc_thanh_toan: 'cod',
        da_thanh_toan: false,
        lich_trinh_giao_hang: [
            { thoi_gian: '15:10 18/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '16:00 18/09/2026', tieu_de: 'Đã xác nhận đơn', hoan_thanh: true },
            { thoi_gian: '08:00 19/09/2026', tieu_de: 'Bưu tá Viettel Post đang giao', hoan_thanh: true }
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
            ho_va_ten: 'Lê Hoàng Long',
            so_dien_thoai: '0934567890',
            email: 'lehoanglong.dev@gmail.com',
            dia_chi_chi_tiet: 'Số 120 Nguyễn Văn Linh, P.Nam Dương',
            quan_huyen: 'Hải Châu',
            tinh_thanh: 'Đà Nẵng',
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
            { thoi_gian: '10:00 22/08/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '14:00 22/08/2026', tieu_de: 'Giao hàng thành công', hoan_thanh: true }
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
            ho_va_ten: 'Trần Thị Mai',
            so_dien_thoai: '0987654321',
            email: 'tranmai@gmail.com',
            dia_chi_chi_tiet: 'Số 48 Cầu Giấy, P.Dịch Vọng',
            quan_huyen: 'Cầu Giấy',
            tinh_thanh: 'Hà Nội',
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
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 79990000,
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        da_thanh_toan: true,
        lich_trinh_giao_hang: [
            { thoi_gian: '09:15 21/08/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '11:00 21/08/2026', tieu_de: 'Giao hàng thành công', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-1719200000000',
        ma_don_hang: 'LPN-2026-8899',
        id_nguoi_dung: 'usr-01',
        ngay_tao: '14:30 20/08/2026',
        trang_thai: 'da_giao',
        thong_tin_giao_hang: {
            ho_ten: 'Nguyễn Văn An',
            ho_va_ten: 'Nguyễn Văn An',
            so_dien_thoai: '0912345678',
            email: 'nguyenvanan@gmail.com',
            dia_chi_chi_tiet: 'Tòa Landmark 81, 720A Điện Biên Phủ, P.22',
            quan_huyen: 'Bình Thạnh',
            tinh_thanh: 'Hồ Chí Minh',
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
            { thoi_gian: '14:30 20/08/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '17:30 20/08/2026', tieu_de: 'Giao hàng thành công', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-010',
        ma_don_hang: 'LPN-2026-9109',
        id_nguoi_dung: 'usr-110',
        ngay_tao: '11:20 15/09/2026',
        trang_thai: 'da_giao',
        thong_tin_giao_hang: {
            ho_ten: 'Võ Thị Mỹ Duyên',
            ho_va_ten: 'Võ Thị Mỹ Duyên',
            so_dien_thoai: '0908777888',
            email: 'myduyen.vo@vungtau.vn',
            dia_chi_chi_tiet: 'Số 78 Trần Phú, P.5',
            quan_huyen: 'Vũng Tàu',
            tinh_thanh: 'Bà Rịa - Vũng Tàu',
            ghi_chu: 'Giao buổi sáng'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-110',
                san_pham_id: 'asus-zenbook-14-oled-ai',
                ten_san_pham: 'ASUS Zenbook 14 OLED (2026) Intel Core Ultra 7 155H | 32GB | 1TB',
                hinh_anh: '/images/sp/asus_zenbook_oled.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 29990000
            }
        ],
        tam_tinh: 29990000,
        tien_giam_gia: 0,
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 29990000,
        hinh_thuc_thanh_toan: 'cod',
        da_thanh_toan: true,
        lich_trinh_giao_hang: [
            { thoi_gian: '11:20 15/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '16:00 16/09/2026', tieu_de: 'Giao hàng thành công', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-011',
        ma_don_hang: 'LPN-2026-9110',
        id_nguoi_dung: 'usr-111',
        ngay_tao: '16:45 10/09/2026',
        trang_thai: 'da_giao',
        thong_tin_giao_hang: {
            ho_ten: 'Đặng Hữu Tài',
            ho_va_ten: 'Đặng Hữu Tài',
            so_dien_thoai: '0919333444',
            email: 'huutai.dang@ag.vn',
            dia_chi_chi_tiet: 'Số 89 Thoại Ngọc Hầu, P.Mỹ Long',
            quan_huyen: 'Long Xuyên',
            tinh_thanh: 'An Giang',
            ghi_chu: 'Giao tại cơ quan'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-111',
                san_pham_id: 'hp-omen-transcend-14-ai',
                ten_san_pham: 'HP OMEN Transcend 14 (2026) Core Ultra 9 185H | RTX 4070',
                hinh_anh: '/images/sp/hp_omen_14.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 52990000
            }
        ],
        tam_tinh: 52990000,
        tien_giam_gia: 1000000,
        ma_giam_gia: 'OMENVIP',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 51990000,
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        da_thanh_toan: true,
        lich_trinh_giao_hang: [
            { thoi_gian: '16:45 10/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '15:00 12/09/2026', tieu_de: 'Giao hàng thành công', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-012',
        ma_don_hang: 'LPN-2026-9111',
        id_nguoi_dung: 'usr-112',
        ngay_tao: '09:00 05/09/2026',
        trang_thai: 'da_giao',
        thong_tin_giao_hang: {
            ho_ten: 'Lâm Gia Bảo',
            ho_va_ten: 'Lâm Gia Bảo',
            so_dien_thoai: '0939111222',
            email: 'giabao.lam@ct.edu.vn',
            dia_chi_chi_tiet: 'Số 150 Trần Hưng Đạo, P.An Nghiệp',
            quan_huyen: 'Ninh Kiều',
            tinh_thanh: 'Cần Thơ',
            ghi_chu: 'Giao giờ hành chính'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-112',
                san_pham_id: 'acer-predator-helios-18-ai',
                ten_san_pham: 'Acer Predator Helios 18 (2026) Core i9-14900HX | RTX 4080',
                hinh_anh: '/images/sp/acer_predator_helios.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 79990000
            }
        ],
        tam_tinh: 79990000,
        tien_giam_gia: 0,
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 79990000,
        hinh_thuc_thanh_toan: 'cod',
        da_thanh_toan: true,
        lich_trinh_giao_hang: [
            { thoi_gian: '09:00 05/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '14:30 06/09/2026', tieu_de: 'Giao hàng thành công', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-013',
        ma_don_hang: 'LPN-2026-9112',
        id_nguoi_dung: 'usr-113',
        ngay_tao: '13:30 17/09/2026',
        trang_thai: 'da_huy',
        thong_tin_giao_hang: {
            ho_ten: 'Cao Văn Thắng',
            ho_va_ten: 'Cao Văn Thắng',
            so_dien_thoai: '0985444333',
            email: 'thang.cao@vsip.com',
            dia_chi_chi_tiet: 'Khu công nghiệp VSIP',
            quan_huyen: 'Từ Sơn',
            tinh_thanh: 'Bắc Ninh',
            ghi_chu: 'Khách gọi hotline xin hủy đơn do trùng đơn hàng'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-113',
                san_pham_id: 'dell-xps-16-9640',
                ten_san_pham: 'Dell XPS 16 (9640) Intel Core Ultra 7 155H | RTX 4070',
                hinh_anh: '/images/sp/dell_xps_16.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 74990000
            }
        ],
        tam_tinh: 74990000,
        tien_giam_gia: 0,
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 74990000,
        hinh_thuc_thanh_toan: 'cod',
        da_thanh_toan: false,
        lich_trinh_giao_hang: [
            { thoi_gian: '13:30 17/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '14:00 17/09/2026', tieu_de: 'Đã hủy đơn theo yêu cầu', hoan_thanh: true }
        ]
    },
    {
        id: 'dh-2026-014',
        ma_don_hang: 'LPN-2026-9113',
        id_nguoi_dung: 'usr-114',
        ngay_tao: '17:15 12/09/2026',
        trang_thai: 'da_huy',
        thong_tin_giao_hang: {
            ho_ten: 'Huỳnh Ngọc Thảo',
            ho_va_ten: 'Huỳnh Ngọc Thảo',
            so_dien_thoai: '0903888222',
            email: 'ngocthao.huynh@sg.com',
            dia_chi_chi_tiet: 'Số 12 Pasteur, P.Bến Nghé',
            quan_huyen: 'Quận 1',
            tinh_thanh: 'Hồ Chí Minh',
            ghi_chu: 'Khách đổi ý chờ phiên bản màu Silver'
        },
        danh_sach_san_pham: [
            {
                id_muc: 'muc-114',
                san_pham_id: 'macbook-pro-16-m3-max',
                ten_san_pham: 'Apple MacBook Pro 16 inch (2026) M3 Max (16-Core CPU, 40-Core GPU) | 48GB | 1TB',
                hinh_anh: '/images/sp/macbook_pro_m3.jpg',
                so_luong: 1,
                gia_tai_thoi_diem_them: 96990000
            }
        ],
        tam_tinh: 96990000,
        tien_giam_gia: 0,
        ma_giam_gia: '',
        phi_van_chuyen: 0,
        tong_tien_thanh_toan: 96990000,
        hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
        da_thanh_toan: false,
        lich_trinh_giao_hang: [
            { thoi_gian: '17:15 12/09/2026', tieu_de: 'Đặt đơn thành công', hoan_thanh: true },
            { thoi_gian: '18:00 12/09/2026', tieu_de: 'Đã hủy đơn theo yêu cầu', hoan_thanh: true }
        ]
    }
];

async function chay() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('❌ MONGODB_URI missing');
            process.exit(1);
        }

        console.log('⏳ Kết nối MongoDB Atlas...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
        console.log('✅ Đã kết nối MongoDB Atlas!');

        // 1. Cập nhật MongoDB
        await DonHang.deleteMany({});
        await DonHang.insertMany(danhSachDonHangMau);
        console.log(`✅ Đã nạp thành công ${danhSachDonHangMau.length} đơn hàng phong phú vào MongoDB Atlas!`);

        // 2. Cập nhật đồng bộ vào FE/db.json
        const pathDbJson = path.join(__dirname, '..', '..', 'FE', 'db.json');
        if (fs.existsSync(pathDbJson)) {
            const dbData = JSON.parse(fs.readFileSync(pathDbJson, 'utf-8'));
            dbData.don_hang = danhSachDonHangMau;
            fs.writeFileSync(pathDbJson, JSON.stringify(dbData, null, 2), 'utf-8');
            console.log(`✅ Đã đồng bộ ${danhSachDonHangMau.length} đơn hàng vào FE/db.json!`);
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Lỗi:', err);
        process.exit(1);
    }
}

chay();
