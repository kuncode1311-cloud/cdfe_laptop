const mongoose = require('mongoose');

/**
 * Giỏ hàng của người dùng đã đăng nhập (mỗi tài khoản một giỏ) — giỏ đi theo tài khoản giữa các thiết bị.
 *
 * Chỉ lưu "mã sản phẩm + tùy chọn + số lượng". GIÁ KHÔNG ĐƯỢC LƯU: mỗi lần đọc giỏ, server lấy giá và tồn kho
 * hiện tại từ bảng sản phẩm nên Admin đổi giá / ẩn / hết hàng thì giỏ luôn đúng, không bị giá cũ.
 */
const MucGioHangSchema = new mongoose.Schema(
    {
        san_pham_id: { type: String, required: true, trim: true },
        ma_tuy_chon: { type: String, default: '', trim: true },
        so_luong: { type: Number, required: true, min: 1, max: 10 }
    },
    { _id: false }
);

const GioHangSchema = new mongoose.Schema(
    {
        id_nguoi_dung: { type: String, required: true, unique: true, trim: true },
        danh_sach_muc: { type: [MucGioHangSchema], default: [] }
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.models.GioHang || mongoose.model('GioHang', GioHangSchema, 'gio_hang');
