import fs from 'fs';
import path from 'path';
import { DANH_SACH_LAPTOP } from '../du-lieu/danh-sach-laptop.js';
import { DANH_SACH_DANH_MUC } from '../du-lieu/danh-sach-danh-muc.js';
import { DANH_SACH_THUONG_HIEU } from '../du-lieu/danh-sach-thuong-hieu.js';
import { DANH_SACH_MA_GIAM_GIA } from '../du-lieu/danh-sach-ma-giam-gia.js';
import { DANH_SACH_TIN_TUC } from '../du-lieu/danh-sach-tin-tuc.js';
const db = {
    san_pham: DANH_SACH_LAPTOP,
    danh_muc: DANH_SACH_DANH_MUC,
    thuong_hieu: DANH_SACH_THUONG_HIEU,
    ma_giam_gia: DANH_SACH_MA_GIAM_GIA,
    tin_tuc: DANH_SACH_TIN_TUC,
    nguoi_dung: [
        {
            id: "usr-01",
            hoTen: "Nguyễn Văn An",
            email: "nguyenvanan@gmail.com",
            soDienThoai: "0912345678",
            matKhau: "123456",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            hangThanhVien: "VIP Gold",
            diemTichLuy: 850
        },
        {
            id: "usr-02",
            hoTen: "Trần Thị Mai",
            email: "tranmai@gmail.com",
            soDienThoai: "0987654321",
            matKhau: "123456",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
            hangThanhVien: "VIP Platinum",
            diemTichLuy: 2100
        }
    ],
    don_hang: [
        {
            id: "dh-1719200000000",
            ma_don_hang: "LPN-2026-8899",
            id_nguoi_dung: "usr-01",
            ngay_tao: "14:30 25/08/2026",
            trang_thai: "dang_giao",
            thong_tin_giao_hang: {
                ho_ten: "Nguyễn Văn An",
                so_dien_thoai: "0912345678",
                email: "nguyenvanan@gmail.com",
                dia_chi_chi_tiet: "Tòa Landmark 81, 720A Điện Biên Phủ, P.22, Q.Bình Thạnh, TP.HCM",
                ghi_chu: "Giao giờ hành chính, gọi trước 15 phút"
            },
            danh_sach_san_pham: [
                {
                    id_muc: "muc-1",
                    san_pham: {
                        id: "rog-scar-18-2026",
                        ma_san_pham: "G834JYR-R9054W",
                        ten_san_pham: "ASUS ROG Strix SCAR 18 (2026) Core i9-14900HX | RTX 4090",
                        hang_san_xuat: "asus",
                        gia_khuyen_mai: 109990000,
                        hinh_anh_chinh: "/images/asus_rog_scar18.jpg"
                    },
                    so_luong: 1,
                    gia_tai_thoi_diem_them: 109990000
                }
            ],
            tam_tinh: 109990000,
            tien_giam_gia: 500000,
            ma_giam_gia: "GAMING500",
            phi_van_chuyen: 0,
            tong_tien_thanh_toan: 109490000,
            hinh_thuc_thanh_toan: "chuyen_khoan_vietqr",
            da_thanh_toan: true,
            lich_trinh_giao_hang: [
                {
                    thoi_gian: "14:30 25/08/2026",
                    tieu_de: "Đặt hàng thành công",
                    mo_ta_chi_tiet: "Hệ thống đã tiếp nhận đơn hàng của quý khách.",
                    hoan_thanh: true
                },
                {
                    thoi_gian: "15:00 25/08/2026",
                    tieu_de: "Đã xác nhận đơn hàng",
                    mo_ta_chi_tiet: "Nhân viên kỹ thuật LaptopNew đang kiểm tra máy và đóng gói niêm phong chống sốc.",
                    hoan_thanh: true
                },
                {
                    thoi_gian: "16:00 25/08/2026",
                    tieu_de: "Bàn giao đơn vị vận chuyển",
                    mo_ta_chi_tiet: "Đang vận chuyển hỏa tốc tới địa chỉ người nhận.",
                    hoan_thanh: true
                },
                {
                    thoi_gian: "Dự kiến 1-2 giờ tới",
                    tieu_de: "Giao hàng thành công",
                    mo_ta_chi_tiet: "Quý khách kiểm tra máy trước khi thanh toán và nhận máy.",
                    hoan_thanh: false
                }
            ]
        }
    ],
    chi_tiet_don_hang: [
        {
            id: "ctdh-01",
            id_don_hang: "dh-1719200000000",
            ma_don_hang: "LPN-2026-8899",
            id_san_pham: "rog-scar-18-2026",
            ten_san_pham: "ASUS ROG Strix SCAR 18 (2026) Core i9-14900HX | RTX 4090",
            hinh_anh: "/images/asus_rog_scar18.jpg",
            so_luong: 1,
            don_gia: 109990000,
            thanh_tien: 109990000
        }
    ],
    danh_gia: [
        {
            id: "dg-01",
            id_san_pham: "rog-scar-18-2026",
            ho_ten: "Nguyễn Văn An",
            so_sao: 5,
            noi_dung: "Máy build cực kỳ chắc chắn, tản nhiệt kim loại lỏng mát rượi khi render 3D nặng. Giao hàng hỏa tốc trong 2h rất hài lòng!",
            ngay_danh_gia: "25/08/2026",
            da_mua_hang: true
        },
        {
            id: "dg-02",
            id_san_pham: "legion-pro-7i-2026",
            ho_ten: "Trần Thị Mai",
            so_sao: 5,
            noi_dung: "Màn hình OLED 240Hz màu sắc chuẩn xác, phím gõ êm, nhân viên hỗ trợ nhiệt tình.",
            ngay_danh_gia: "24/08/2026",
            da_mua_hang: true
        }
    ]
};
const outputPath = path.join(process.cwd(), 'db.json');
fs.writeFileSync(outputPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('✅ Đã tạo thành công file db.json tại:', outputPath);
