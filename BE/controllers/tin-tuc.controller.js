const mongoose = require('mongoose');
const taoSlug = require('../utils/tao-slug');
const TinTuc = require('../models/tin-tuc.model');

const timTheoDinhDanh = id => ({ $or: [{ slug: id }, { id }, { _id: mongoose.isValidObjectId(id) ? id : null }] });

const layDanhSachTinTuc = async (req, res) => {
    try {
        const { chuyen_muc, q, la_tieu_diem, tat_ca } = req.query;
        const filter = tat_ca ? {} : { xuat_ban: true };
        if (chuyen_muc && !['all', 'tat_ca'].includes(chuyen_muc)) filter.chuyen_muc = new RegExp(chuyen_muc, 'i');
        if (la_tieu_diem === 'true') filter.la_tieu_diem = true;
        if (q) filter.$or = ['tieu_de', 'tom_tat', 'chuyen_muc'].map(field => ({ [field]: { $regex: q, $options: 'i' } }));
        return res.json({ thanhCong: true, duLieu: await TinTuc.find(filter).sort({ createdAt: -1 }) });
    } catch (err) {
        return res.status(500).json({ thanhCong: false, thongBao: err.message });
    }
};

const layTinTucTheoIdHoacSlug = async (req, res) => {
    try {
        const tin = await TinTuc.findOneAndUpdate(timTheoDinhDanh(req.params.id), { $inc: { luot_xem: 1 } }, { new: true });
        return tin ? res.json({ thanhCong: true, duLieu: tin }) : res.status(404).json({ thanhCong: false, thongBao: 'Không tìm thấy bài viết!' });
    } catch (err) {
        return res.status(500).json({ thanhCong: false, thongBao: err.message });
    }
};

const themTinTuc = async (req, res) => {
    try {
        const duLieu = { ...req.body };
        duLieu.id ||= `tin-${Date.now().toString().slice(-6)}`;
        if (duLieu.tieu_de) duLieu.slug ||= taoSlug(duLieu.tieu_de);
        return res.status(201).json({ thanhCong: true, thongBao: 'Tạo bài viết mới thành công!', duLieu: await TinTuc.create(duLieu) });
    } catch (err) {
        return res.status(500).json({ thanhCong: false, thongBao: err.message });
    }
};

const capNhatTinTuc = async (req, res) => {
    try {
        const duLieu = { ...req.body };
        if (duLieu.tieu_de && !duLieu.slug) duLieu.slug = taoSlug(duLieu.tieu_de);
        const tin = await TinTuc.findOneAndUpdate(timTheoDinhDanh(req.params.id), { $set: duLieu }, { new: true, runValidators: true });
        return tin ? res.json({ thanhCong: true, thongBao: 'Cập nhật bài viết thành công!', duLieu: tin }) : res.status(404).json({ thanhCong: false, thongBao: 'Không tìm thấy bài viết!' });
    } catch (err) {
        return res.status(500).json({ thanhCong: false, thongBao: err.message });
    }
};

const xoaTinTuc = async (req, res) => {
    try {
        const tin = await TinTuc.findOneAndDelete(timTheoDinhDanh(req.params.id));
        return tin ? res.json({ thanhCong: true, thongBao: 'Đã xóa bài viết thành công!' }) : res.status(404).json({ thanhCong: false, thongBao: 'Không tìm thấy bài viết!' });
    } catch (err) {
        return res.status(500).json({ thanhCong: false, thongBao: err.message });
    }
};

module.exports = { layDanhSachTinTuc, layTinTucTheoIdHoacSlug, themTinTuc, capNhatTinTuc, xoaTinTuc };
