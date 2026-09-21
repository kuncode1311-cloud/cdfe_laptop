const mongoose = require('mongoose');
const taoSlug = require('../utils/tao-slug');

const TinTucSchema = new mongoose.Schema(
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
        tieu_de: {
            type: String,
            required: true,
            trim: true
        },
        tom_tat: {
            type: String,
            required: true,
            trim: true
        },
        noi_dung: {
            type: String,
            default: ''
        },
        hinh_anh: {
            type: String,
            required: true,
            default: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'
        },
        ngay_dang: {
            type: String,
            default: () => new Date().toLocaleDateString('vi-VN')
        },
        tac_gia: {
            type: String,
            default: 'Ban Biên Tập TNT Laptop'
        },
        chuyen_muc: {
            type: String,
            default: 'Tư Vấn Mua Sắm'
        },
        thoi_gian_doc: {
            type: String,
            default: '5 phút đọc'
        },
        luot_xem: {
            type: Number,
            default: 150
        },
        la_tieu_diem: {
            type: Boolean,
            default: false
        },
        xuat_ban: {
            type: Boolean,
            default: true
        },
        tags: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
        collection: 'tin_tuc'
    }
);

TinTucSchema.pre('validate', function () {
    if (!this.slug || this.isModified('tieu_de')) {
        this.slug = taoSlug(this.tieu_de) || this.id;
    }
});

module.exports = mongoose.models.TinTuc || mongoose.model('TinTuc', TinTucSchema);
