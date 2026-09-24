const mongoose = require('mongoose');

/**
 * Schema Đánh giá & Bình luận sản phẩm
 * Dựa trên cấu trúc dữ liệu MongoDB của hệ thống
 */
const DanhGiaSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            trim: true
        },
        id_san_pham: {
            type: String,
            required: true,
            trim: true
        },
        id_nguoi_dung: {
            type: String,
            trim: true
        },
        ho_ten: {
            type: String,
            required: true,
            trim: true
        },
        ngheNghiep: {
            type: String,
            trim: true
        },
        avatar: {
            type: String,
            trim: true
        },
        diaDiemMua: {
            type: String,
            trim: true
        },
        so_sao: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 5
        },
        noi_dung: {
            type: String,
            required: true
        },
        tieu_de: {
            type: String,
            trim: true
        },
        so_dien_thoai: {
            type: String,
            trim: true
        },
        thoi_gian_dung: {
            type: String,
            default: 'Khách vừa nhận hàng'
        },
        hinh_anh_dinh_kem: {
            type: [String],
            default: []
        },
        luot_thich: {
            type: Number,
            default: 0
        },
        ngay_danh_gia: {
            type: String,
            default: () => new Date().toLocaleDateString('vi-VN')
        },
        da_mua_hang: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const DanhGia = mongoose.model('DanhGia', DanhGiaSchema, 'danh_gia');

module.exports = DanhGia;
