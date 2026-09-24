const CaiDat = require('../models/cai-dat.model');

exports.layCaiDatShowroom = async (req, res) => {
    try {
        const caiDat = await CaiDat.findOne({ khoa: 'he_thong' }).lean();
        return res.json({ thanh_cong: true, du_lieu: caiDat?.danh_sach_showroom || [] });
    } catch (loi) {
        return res.status(500).json({ thanh_cong: false, thong_diep: 'Không thể lấy cài đặt showroom' });
    }
};

exports.capNhatCaiDatShowroom = async (req, res) => {
    try {
        const { danh_sach_showroom } = req.body;
        if (!Array.isArray(danh_sach_showroom) || danh_sach_showroom.length === 0) {
            return res.status(400).json({ thanh_cong: false, thong_diep: 'Danh sách showroom không hợp lệ hoặc rỗng' });
        }
        const caiDat = await CaiDat.findOneAndUpdate(
            { khoa: 'he_thong' },
            { $set: { danh_sach_showroom } },
            { new: true, upsert: true, runValidators: true }
        );
        return res.json({ thanh_cong: true, du_lieu: caiDat.danh_sach_showroom });
    } catch (loi) {
        return res.status(500).json({ thanh_cong: false, thong_diep: 'Không thể lưu cài đặt showroom', chi_tiet: loi.message });
    }
};

exports.khoiPhucShowroomMacDinh = (req, res) => res.status(410).json({
    thanh_cong: false,
    thong_diep: 'Dữ liệu showroom được quản lý trong MongoDB; không có dữ liệu mẫu để khôi phục.'
});
