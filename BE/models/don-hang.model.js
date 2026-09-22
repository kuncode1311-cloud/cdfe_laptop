const mongoose = require('mongoose');

/**
 * Schema Đơn hàng Laptop
 * Dựa trên cấu trúc dữ liệu thực tế từ FE/db.json
 */
const DonHangSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        ma_don_hang: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        id_nguoi_dung: {
            type: String,
            default: ''
        },
        ngay_tao: {
            type: String,
            required: true
        },
        trang_thai: {
            type: String,
            enum: ['cho_xac_nhan', 'da_xac_nhan', 'dang_giao', 'da_giao', 'da_huy'],
            default: 'cho_xac_nhan'
        },
        thong_tin_giao_hang: {
            ho_ten: { type: String, default: '' },
            ho_va_ten: { type: String, default: '' },
            so_dien_thoai: { type: String, required: true },
            email: { type: String, default: '' },
            dia_chi_chi_tiet: { type: String, default: '' },
            tinh_thanh: { type: String, default: '' },
            quan_huyen: { type: String, default: '' },
            phuong_xa: { type: String, default: '' },
            ghi_chu: { type: String, default: '' }
        },
        danh_sach_san_pham: [
            {
                id_muc: { type: String },
                san_pham: { type: mongoose.Schema.Types.Mixed },
                san_pham_id: { type: String },
                ten_san_pham: { type: String },
                hinh_anh: { type: String },
                so_luong: { type: Number, default: 1 },
                gia_tai_thoi_diem_them: { type: Number },
                gia_hien_tai: { type: Number },
                tong_tien_muc: { type: Number },
                gia: { type: Number },
                tuy_chon_chon: { type: mongoose.Schema.Types.Mixed }
            }
        ],
        tam_tinh: {
            type: Number,
            required: true,
            default: 0
        },
        tien_giam_gia: {
            type: Number,
            default: 0
        },
        ma_giam_gia: {
            type: String,
            default: ''
        },
        phi_van_chuyen: {
            type: Number,
            default: 0
        },
        tong_tien_thanh_toan: {
            type: Number,
            required: true
        },
        hinh_thuc_thanh_toan: {
            type: String,
            default: 'tien_mat_cod'
        },
        da_thanh_toan: {
            type: Boolean,
            default: false
        },
        trang_thai_thanh_toan: {
            type: String,
            enum: ['chua_thanh_toan', 'cho_thanh_toan', 'da_thanh_toan', 'that_bai', 'thanh_toan_khi_nhan_hang'],
            default: 'chua_thanh_toan'
        },
        payos_order_code: {
            type: Number,
            default: null,
            index: true
        },
        noi_dung_chuyen_khoan: {
            type: String,
            default: ''
        },
        da_tru_ton_kho: {
            type: Boolean,
            default: false
        },
        lich_trinh_giao_hang: [
            {
                thoi_gian: { type: String },
                tieu_de: { type: String },
                mo_ta_chi_tiet: { type: String },
                hoan_thanh: { type: Boolean, default: false }
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Đánh Index tăng tốc độ truy vấn kiểm tra thanh toán tức thì
DonHangSchema.index({ payos_order_code: 1 });
DonHangSchema.index({ ma_don_hang: 1 });
DonHangSchema.index({ id_nguoi_dung: 1 });
DonHangSchema.index({ da_thanh_toan: 1 });

const DonHang = mongoose.model('DonHang', DonHangSchema, 'don_hang');

module.exports = DonHang;
