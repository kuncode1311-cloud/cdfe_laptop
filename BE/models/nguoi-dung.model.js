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
            default: ''
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
        viVoucher: {
            type: [String],
            default: []
        },
        gioiTinh: {
            type: String,
            enum: ['nam', 'nu', 'khac'],
            default: 'nam'
        },
        ngaySinh: {
            type: String,
            default: ''
        },
        danhSachDiaChi: [
            {
                id: { type: String, default: () => `dc_${Date.now()}` },
                hoTen: { type: String, default: '' },
                soDienThoai: { type: String, default: '' },
                diaChiChiTiet: { type: String, default: '' },
                tinhThanh: { type: String, default: '' },
                quanHuyen: { type: String, default: '' },
                phuongXa: { type: String, default: '' },
                macDinh: { type: Boolean, default: false },
                loaiDiaChi: { type: String, enum: ['nha_rieng', 'van_phong'], default: 'nha_rieng' }
            }
        ],
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
        },
        trangThai: {
            type: String,
            enum: ['hoat_dong', 'bi_khoa'],
            default: 'hoat_dong'
        },
        biKhoa: {
            type: Boolean,
            default: false
        },
        lyDoKhoa: {
            type: String,
            default: ''
        },
        ngayTao: {
            type: String,
            default: () => {
                const d = new Date();
                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            }
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
