const mongoose = require('mongoose');

/**
 * Schema Mã giảm giá (Voucher)
 * Dựa trên cấu trúc dữ liệu MongoDB của hệ thống
 */
const MaGiamGiaSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            trim: true
        },
        ma_code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        tieu_de: {
            type: String,
            required: true
        },
        mo_ta: {
            type: String,
            default: ''
        },
        loai_giam: {
            type: String,
            enum: ['tien_mat', 'phan_tram'],
            default: 'tien_mat'
        },
        gia_tri_giam: {
            type: Number,
            required: true
        },
        giam_toi_da: {
            type: Number,
            default: 0
        },
        don_hang_toi_thieu: {
            type: Number,
            default: 0
        },
        ngay_het_han: {
            type: String,
            default: ''
        },
        kich_hoat: {
            type: Boolean,
            default: true
        },
        chuyen_muc: {
            type: String,
            default: 'toan_san'
        },
        phan_tram_da_dung: {
            type: Number,
            default: 65
        },
        so_luong_con_lai: {
            type: Number,
            default: 120
        },
        so_luong_phat_hanh: {
            type: Number,
            default: 500
        },
        khung_gio_san: {
            type: String,
            default: '12:00'
        },
        badge: {
            type: String,
            default: ''
        },
        hot_deal: {
            type: Boolean,
            default: false
        },
        mau_sac: {
            type: String,
            default: 'red'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const MaGiamGia = mongoose.model('MaGiamGia', MaGiamGiaSchema, 'ma_giam_gia');

module.exports = MaGiamGia;
