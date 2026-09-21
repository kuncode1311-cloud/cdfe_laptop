const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schema Người dùng / Tài khoản với Phân quyền RBAC & Mã hóa Bcrypt
 */
const NguoiDungSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        hoTen: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        soDienThoai: {
            type: String,
            default: ''
        },
        matKhau: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        },
        vaiTro: {
            type: String,
            enum: ['khach_hang', 'admin'],
            default: 'khach_hang'
        },
        hangThanhVien: {
            type: String,
            default: 'Thành Viên Mới'
        },
        diemTichLuy: {
            type: Number,
            default: 100
        },
        viVoucher: {
            type: [String],
            default: []
        },
        googleId: {
            type: String,
            default: ''
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local'
        },
        maOtp: {
            type: String,
            default: null
        },
        hanOtp: {
            type: Date,
            default: null
        },
        loaiOtp: {
            type: String,
            enum: ['quen_mat_khau', 'kich_hoat', null],
            default: null
        },
        daKichHoat: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// Phương thức so sánh mật khẩu plain text với hash
NguoiDungSchema.methods.soSanhMatKhau = async function (matKhauNhap) {
    if (!this.matKhau) return false;
    return await bcrypt.compare(matKhauNhap, this.matKhau);
};

// Loại bỏ trường matKhau khi serialize JSON sang client
NguoiDungSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.matKhau;
    return obj;
};

const NguoiDung = mongoose.model('NguoiDung', NguoiDungSchema, 'nguoi_dung');

module.exports = NguoiDung;
