const mongoose = require('mongoose');

/**
 * Lưu các giá trị Admin ghi đè thủ công cho 1 sản phẩm trong 1 đơn hàng cụ thể
 * (số serial thật, số tháng bảo hành khác mặc định) — KHÔNG phải hồ sơ bảo hành độc lập,
 * bảo hành vẫn được tính tự động từ đơn hàng đã giao trong bao-hanh.controller.js.
 */
const BaoHanhGhiDeSchema = new mongoose.Schema(
    {
        ma_don_hang: { type: String, required: true, trim: true },
        id_muc: { type: String, required: true, trim: true },
        so_serial: { type: String, trim: true, default: '' },
        thoi_han_bao_hanh_thang: { type: Number, default: null }
    },
    { timestamps: true, versionKey: false }
);

BaoHanhGhiDeSchema.index({ ma_don_hang: 1, id_muc: 1 }, { unique: true });

const BaoHanhGhiDe = mongoose.model('BaoHanhGhiDe', BaoHanhGhiDeSchema, 'bao_hanh_ghi_de');

module.exports = BaoHanhGhiDe;
