const mongoose = require('mongoose');
const taoSlug = require('../utils/tao-slug');

/**
 * Schema Sản phẩm Laptop
 * Dựa trên cấu trúc dữ liệu thực tế từ FE/db.json
 */
const SanPhamSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
            index: true
        },
        ma_san_pham: {
            type: String,
            required: true,
            trim: true
        },
        ten_san_pham: {
            type: String,
            required: true,
            trim: true
        },
        hang_san_xuat: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        danh_muc: {
            type: [String],
            default: []
        },
        gia_goc: {
            type: Number,
            default: 0
        },
        gia_khuyen_mai: {
            type: Number,
            required: true
        },
        phan_tram_giam_gia: {
            type: Number,
            default: 0
        },
        hinh_anh_chinh: {
            type: String,
            required: true
        },
        thu_vien_hinh_anh: {
            type: [String],
            default: []
        },
        video_demo: {
            type: String,
            default: ''
        },
        thong_so: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        tuy_chon_phien_ban: [
            {
                ma_tuy_chon: String,
                ten_tuy_chon: String,
                ram: String,
                o_cung: String,
                chenh_lech_gia: { type: Number, default: 0 },
                hinh_anh: { type: String, default: '' }
            }
        ],
        qua_tang: [
            {
                ten_qua_tang: String,
                gia_tri: Number
            }
        ],
        ton_kho: [
            {
                ten_chi_nhanh: String,
                dia_chi: String,
                so_dien_thoai: String,
                so_luong_con: { type: Number, default: 2 }
            }
        ],
        danh_gia: [
            {
                id: String,
                ten_nguoi_dung: String,
                ho_ten: String,
                so_sao: { type: Number, default: 5 },
                tieu_de: String,
                noi_dung: String,
                ngay_danh_gia: String,
                da_mua_hang: { type: Boolean, default: true }
            }
        ],
        dac_diem_noi_bat: {
            type: [String],
            default: []
        },
        mo_ta_chi_tiet: {
            type: String,
            default: ''
        },
        con_hang: {
            type: Boolean,
            default: true
        },
        so_luong_ton_kho: {
            type: Number,
            default: 10
        },
        so_luong_da_ban: {
            type: Number,
            default: 0
        },
        diem_danh_gia_tb: {
            type: Number,
            default: 5
        },
        so_luong_danh_gia: {
            type: Number,
            default: 0
        },
        la_flash_sale: {
            type: Boolean,
            default: false
        },
        la_ban_chay: {
            type: Boolean,
            default: false
        },
        la_san_pham_moi: {
            type: Boolean,
            default: false
        },
        ho_tro_tra_gop_0_phan_tram: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

SanPhamSchema.pre('validate', function () {
    if (!this.slug || this.isModified('ten_san_pham')) {
        this.slug = taoSlug(this.ten_san_pham) || this.id;
    }
});

const SanPham = mongoose.model('SanPham', SanPhamSchema, 'san_pham');

module.exports = SanPham;
