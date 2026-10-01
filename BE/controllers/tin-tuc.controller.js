const mongoose = require('mongoose');
const taoSlug = require('../utils/tao-slug');
const TinTuc = require('../models/tin-tuc.model');
const { escapeRegex, chuoiAnToan } = require('../utils/bao-mat');

const laAdmin = req => req.user && req.user.vaiTro === 'admin';

const timTheoDinhDanh = id => ({ $or: [{ slug: id }, { id }, { _id: mongoose.isValidObjectId(id) ? id : null }] });

const layDanhSachTinTuc = async (req, res) => {
    try {
        const { chuyen_muc, q, la_tieu_diem, tat_ca } = req.query;
        // Bản nháp (xuat_ban = false) chỉ Admin mới xem được
        const filter = (tat_ca && laAdmin(req)) ? {} : { xuat_ban: true };
        const chuyenMuc = chuoiAnToan(chuyen_muc, 50);
        const tuKhoa = chuoiAnToan(q, 100);
        if (chuyenMuc && !['all', 'tat_ca'].includes(chuyenMuc)) filter.chuyen_muc = new RegExp(escapeRegex(chuyenMuc), 'i');
        if (la_tieu_diem === 'true') filter.la_tieu_diem = true;
        // Escape từ khóa trước khi đưa vào $regex → chống Regex Injection / ReDoS
        if (tuKhoa) filter.$or = ['tieu_de', 'tom_tat', 'chuyen_muc'].map(field => ({ [field]: { $regex: escapeRegex(tuKhoa), $options: 'i' } }));
        return res.json({ thanhCong: true, duLieu: await TinTuc.find(filter).sort({ createdAt: -1 }) });
    } catch (err) {
        console.error('Lỗi tin tức:', err.message);
        return res.status(500).json({ thanhCong: false, thongBao: 'Lỗi máy chủ khi xử lý tin tức.' });
    }
};

const layTinTucTheoIdHoacSlug = async (req, res) => {
    try {
        const dieuKien = laAdmin(req) ? timTheoDinhDanh(req.params.id) : { ...timTheoDinhDanh(req.params.id), xuat_ban: true };
        const tin = await TinTuc.findOneAndUpdate(dieuKien, { $inc: { luot_xem: 1 } }, { new: true });
        return tin ? res.json({ thanhCong: true, duLieu: tin }) : res.status(404).json({ thanhCong: false, thongBao: 'Không tìm thấy bài viết!' });
    } catch (err) {
        console.error('Lỗi tin tức:', err.message);
        return res.status(500).json({ thanhCong: false, thongBao: 'Lỗi máy chủ khi xử lý tin tức.' });
    }
};

const themTinTuc = async (req, res) => {
    try {
        const duLieu = { ...req.body };
        duLieu.id ||= `tin-${Date.now().toString().slice(-6)}`;
        if (duLieu.tieu_de) duLieu.slug ||= taoSlug(duLieu.tieu_de);
        return res.status(201).json({ thanhCong: true, thongBao: 'Tạo bài viết mới thành công!', duLieu: await TinTuc.create(duLieu) });
    } catch (err) {
        console.error('Lỗi tin tức:', err.message);
        return res.status(500).json({ thanhCong: false, thongBao: 'Lỗi máy chủ khi xử lý tin tức.' });
    }
};

const capNhatTinTuc = async (req, res) => {
    try {
        const duLieu = { ...req.body };
        if (duLieu.tieu_de && !duLieu.slug) duLieu.slug = taoSlug(duLieu.tieu_de);
        const tin = await TinTuc.findOneAndUpdate(timTheoDinhDanh(req.params.id), { $set: duLieu }, { new: true, runValidators: true });
        return tin ? res.json({ thanhCong: true, thongBao: 'Cập nhật bài viết thành công!', duLieu: tin }) : res.status(404).json({ thanhCong: false, thongBao: 'Không tìm thấy bài viết!' });
    } catch (err) {
        console.error('Lỗi tin tức:', err.message);
        return res.status(500).json({ thanhCong: false, thongBao: 'Lỗi máy chủ khi xử lý tin tức.' });
    }
};

const xoaTinTuc = async (req, res) => {
    try {
        const tin = await TinTuc.findOneAndDelete(timTheoDinhDanh(req.params.id));
        return tin ? res.json({ thanhCong: true, thongBao: 'Đã xóa bài viết thành công!' }) : res.status(404).json({ thanhCong: false, thongBao: 'Không tìm thấy bài viết!' });
    } catch (err) {
        console.error('Lỗi tin tức:', err.message);
        return res.status(500).json({ thanhCong: false, thongBao: 'Lỗi máy chủ khi xử lý tin tức.' });
    }
};

module.exports = { layDanhSachTinTuc, layTinTucTheoIdHoacSlug, themTinTuc, capNhatTinTuc, xoaTinTuc };
