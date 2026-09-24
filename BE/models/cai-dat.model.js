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
            type: String
        },
        hotline_di_dong: {
            type: String
        },
        gio_mo_cua: {
            type: String
        },
        vi_do: {
            type: Number,
            required: true
        },
        kinh_do: {
            type: Number,
            required: true
        },
        la_mac_dinh: {
            type: Boolean
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
