const mongoose = require('mongoose');

const ShowroomSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true
        },
        ten: {
            type: String,
            required: true,
            trim: true
        },
        dia_chi: {
            type: String,
            required: true,
            trim: true
        },
        hotline: {
            type: String,
            default: '1900.8946'
        },
        hotline_di_dong: {
            type: String,
            default: '0948.37.79.79'
        },
        gio_mo_cua: {
            type: String,
            default: '08:30 - 21:30'
        },
        vi_do: {
            type: Number,
            required: true,
            default: 10.7601
        },
        kinh_do: {
            type: Number,
            required: true,
            default: 106.6632
        },
        la_mac_dinh: {
            type: Boolean,
            default: false
        }
    },
    { _id: false }
);

const CaiDatSchema = new mongoose.Schema(
    {
        khoa: {
            type: String,
            required: true,
            unique: true,
            default: 'he_thong'
        },
        danh_sach_showroom: {
            type: [ShowroomSchema],
            default: []
        }
    },
    {
        timestamps: {
            createdAt: 'ngay_tao',
            updatedAt: 'ngay_cap_nhat'
        }
    }
);

module.exports = mongoose.model('CaiDat', CaiDatSchema, 'cai_dat');
