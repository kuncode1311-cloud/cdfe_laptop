const DanhMuc = require('../models/danh-muc.model');
const taoSlug = require('../utils/tao-slug');

const layDanhSachDanhMuc = async (req, res) => {
    try {
        const filter = req.query.loai ? { loai: req.query.loai } : {};
        return res.json(await DanhMuc.find(filter).sort({ thu_tu_hien_thi: 1 }));
    } catch (loi) {
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ', chi_tiet: loi.message });
    }
};

const taoDanhMucMoi = async (req, res) => {
    try {
        const duLieu = { ...req.body };
        if (!duLieu.ma_danh_muc || !duLieu.ten_danh_muc) return res.status(400).json({ thong_diep: 'Vui lòng cung cấp mã và tên danh mục!' });
        duLieu.ma_danh_muc = duLieu.ma_danh_muc.toLowerCase().trim();
        duLieu.id ||= `brand-${duLieu.ma_danh_muc}`;
        duLieu.slug ||= taoSlug(duLieu.ten_danh_muc);
        if (await DanhMuc.exists({ ma_danh_muc: duLieu.ma_danh_muc })) return res.status(409).json({ thong_diep: 'Mã danh mục đã tồn tại' });
        return res.status(201).json(await DanhMuc.create(duLieu));
    } catch (loi) {
        return res.status(400).json({ thong_diep: 'Không thể tạo danh mục', chi_tiet: loi.message });
    }
};

const capNhatDanhMuc = async (req, res) => {
    try {
        const { id } = req.params;
        const duLieu = { ...req.body };
        if (duLieu.ten_danh_muc && !duLieu.slug) duLieu.slug = taoSlug(duLieu.ten_danh_muc);
        let dm = await DanhMuc.findOneAndUpdate({ $or: [{ slug: id }, { id }, { ma_danh_muc: id.toLowerCase() }] }, { $set: duLieu }, { new: true, runValidators: true });
        if (!dm && /^[0-9a-fA-F]{24}$/.test(id)) dm = await DanhMuc.findByIdAndUpdate(id, { $set: duLieu }, { new: true, runValidators: true });
        return dm ? res.json(dm) : res.status(404).json({ thong_diep: 'Không tìm thấy danh mục' });
    } catch (loi) {
        return res.status(400).json({ thong_diep: 'Không thể cập nhật danh mục', chi_tiet: loi.message });
    }
};

const xoaDanhMuc = async (req, res) => {
    try {
        const { id } = req.params;
        let dm = await DanhMuc.findOneAndDelete({ $or: [{ slug: id }, { id }, { ma_danh_muc: id.toLowerCase() }] });
        if (!dm && /^[0-9a-fA-F]{24}$/.test(id)) dm = await DanhMuc.findByIdAndDelete(id);
        return dm ? res.json({ thong_diep: 'Đã xóa danh mục thành công', id: dm.id }) : res.status(404).json({ thong_diep: 'Không tìm thấy danh mục' });
    } catch (loi) {
        return res.status(500).json({ thong_diep: 'Không thể xóa danh mục', chi_tiet: loi.message });
    }
};

module.exports = { layDanhSachDanhMuc, taoDanhMucMoi, capNhatDanhMuc, xoaDanhMuc };
