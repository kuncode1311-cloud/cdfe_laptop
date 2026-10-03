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
            { returnDocument: 'after', upsert: true, runValidators: true }
        );
        return res.json({ thanh_cong: true, du_lieu: caiDat.danh_sach_showroom });
    } catch (loi) {
        return res
            .status(500)
            .json({ thanh_cong: false, thong_diep: 'Không thể lưu cài đặt showroom', chi_tiet: loi.message });
    }
};

// Cấu hình Banner / Flash Sale: lưu trên server để MỌI khách đều thấy thay đổi của Admin
// (trước đây chỉ nằm trong localStorage của trình duyệt Admin nên khách không bao giờ thấy).
const GIOI_HAN_KICH_THUOC_KHUYEN_MAI = 20000;

exports.layCaiDatKhuyenMai = async (req, res) => {
    try {
        const caiDat = await CaiDat.findOne({ khoa: 'he_thong' }).lean();
        res.set('Cache-Control', 'no-store');
        return res.json({ thanh_cong: true, du_lieu: caiDat?.khuyen_mai || {} });
    } catch (loi) {
        return res.status(500).json({ thanh_cong: false, thong_diep: 'Không thể lấy cấu hình khuyến mãi' });
    }
};

exports.capNhatCaiDatKhuyenMai = async (req, res) => {
    try {
        const duLieu = req.body?.khuyen_mai;
        if (!duLieu || typeof duLieu !== 'object' || Array.isArray(duLieu)) {
            return res.status(400).json({ thanh_cong: false, thong_diep: 'Cấu hình khuyến mãi phải là một đối tượng' });
        }
        if (JSON.stringify(duLieu).length > GIOI_HAN_KICH_THUOC_KHUYEN_MAI) {
            return res.status(400).json({ thanh_cong: false, thong_diep: 'Cấu hình khuyến mãi quá lớn' });
        }
        const caiDat = await CaiDat.findOneAndUpdate(
            { khoa: 'he_thong' },
            { $set: { khuyen_mai: duLieu } },
            { returnDocument: 'after', upsert: true }
        );
        return res.json({ thanh_cong: true, du_lieu: caiDat.khuyen_mai || {} });
    } catch (loi) {
        return res
            .status(500)
            .json({ thanh_cong: false, thong_diep: 'Không thể lưu cấu hình khuyến mãi', chi_tiet: loi.message });
    }
};

exports.khoiPhucShowroomMacDinh = (req, res) =>
    res.status(410).json({
        thanh_cong: false,
        thong_diep: 'Dữ liệu showroom được quản lý trong MongoDB; không có dữ liệu mẫu để khôi phục.'
    });
