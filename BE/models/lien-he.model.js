const mongoose = require('mongoose');

/**
 * Schema lưu trữ yêu cầu liên hệ & tư vấn của khách hàng
 * Hỗ trợ phân loại chủ đề, theo dõi trạng thái xử lý CSKH
 */
const LienHeSchema = new mongoose.Schema(
    {
        ma_yeu_cau: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        ho_ten: {
            type: String,
            required: [true, 'Vui lòng cung cấp họ và tên'],
            trim: true
        },
        so_dien_thoai: {
            type: String,
            required: [true, 'Vui lòng cung cấp số điện thoại liên hệ'],
            trim: true
        },
        email: {
            type: String,
            trim: true,
            default: ''
        },
        chu_de: {
            type: String,
            default: 'Tư vấn mua Laptop Gaming & AI PC'
        },
        noi_dung: {
            type: String,
            required: [true, 'Vui lòng nhập nội dung yêu cầu tư vấn'],
            trim: true
        },
        trang_thai: {
            type: String,
            enum: ['chua_xu_ly', 'dang_xu_ly', 'da_hoan_thanh', 'da_huy'],
            default: 'chua_xu_ly',
            index: true
        },
        ghi_chu_noi_bo: {
            type: String,
            default: ''
        },
        nguon_tiep_nhan: {
            type: String,
            default: 'website_lien_he'
        }
    },
    {
        timestamps: {
            createdAt: 'ngay_tao',
            updatedAt: 'ngay_cap_nhat'
        }
    }
);

// Tạo index hỗ trợ tìm kiếm nhanh theo số điện thoại và trạng thái
LienHeSchema.index({ so_dien_thoai: 1, ngay_tao: -1 });

module.exports = mongoose.model('LienHe', LienHeSchema, 'lien_he');
