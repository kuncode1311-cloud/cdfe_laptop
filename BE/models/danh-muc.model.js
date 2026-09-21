const mongoose = require('mongoose');
const taoSlug = require('../utils/tao-slug');

/**
 * Schema Mongoose cho Danh Mục & Thương Hiệu Laptop
 */
const DanhMucSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
            index: true
        },
        ma_danh_muc: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        ten_danh_muc: {
            type: String,
            required: true,
            trim: true
        },
        loai: {
            type: String,
            enum: ['thuong_hieu', 'nhu_cau', 'phan_khuc'],
            default: 'thuong_hieu'
        },
        logo: {
            type: String,
            default: '💻'
        },
        mo_ta: {
            type: String,
            default: ''
        },
        xuat_xu: {
            type: String,
            default: 'Chính Hãng'
        },
        kich_hoat: {
            type: Boolean,
            default: true
        },
        thu_tu_hien_thi: {
            type: Number,
            default: 1
        }
    },
    {
        timestamps: true,
        collection: 'danh-muc'
    }
);

DanhMucSchema.pre('validate', function () {
    if (!this.slug || this.isModified('ten_danh_muc')) {
        this.slug = taoSlug(this.ten_danh_muc) || this.ma_danh_muc;
    }
});

module.exports = mongoose.models.DanhMuc || mongoose.model('DanhMuc', DanhMucSchema);
