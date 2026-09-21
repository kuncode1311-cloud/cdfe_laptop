const DonHang = require('../models/don-hang.model');

/**
 * Controller xử lý nghiệp vụ cho Đơn hàng
 */

// 1. Tạo đơn hàng mới
const taoDonHangMoi = async (req, res) => {
    try {
        const duLieuDonHang = req.body;

        // Tự sinh id và mã đơn nếu FE chưa truyền
        if (!duLieuDonHang.id) {
            duLieuDonHang.id = `dh-${Date.now()}`;
        }
        if (!duLieuDonHang.ma_don_hang) {
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);
            duLieuDonHang.ma_don_hang = `LPN-2026-${randomSuffix}`;
        }
        if (!duLieuDonHang.ngay_tao) {
            duLieuDonHang.ngay_tao = new Date().toLocaleString('vi-VN');
        }

        // Chuẩn hóa họ tên trong thông tin giao hàng
        if (duLieuDonHang.thong_tin_giao_hang) {
            const tt = duLieuDonHang.thong_tin_giao_hang;
            const ten = tt.ho_ten || tt.ho_va_ten || '';
            tt.ho_ten = ten;
            tt.ho_va_ten = ten;
        }

        // Tạo đơn hàng mới trong MongoDB
        const donHangMoi = new DonHang(duLieuDonHang);
        const ketQua = await donHangMoi.save();

        console.log(`📦 Tạo đơn hàng mới thành công: ${ketQua.ma_don_hang}`);
        return res.status(201).json(ketQua);
    } catch (loi) {
        console.error('Lỗi tạo đơn hàng:', loi);
        return res.status(400).json({ thong_diep: 'Không thể tạo đơn hàng mới', chi_tiet: loi.message });
    }
};

// 2. Lấy danh sách tất cả các đơn hàng
const layDanhSachDonHang = async (req, res) => {
    try {
        const { trang_thai, id_nguoi_dung } = req.query;
        const filter = {};

        if (trang_thai) filter.trang_thai = trang_thai;
        if (id_nguoi_dung) filter.id_nguoi_dung = id_nguoi_dung;

        const danhSachDonHang = await DonHang.find(filter).sort({ createdAt: -1 });
        return res.status(200).json(danhSachDonHang);
    } catch (loi) {
        console.error('Lỗi lấy danh sách đơn hàng:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi lấy danh sách đơn hàng', chi_tiet: loi.message });
    }
};

// 3. Tra cứu thông tin đơn hàng theo ID hoặc Mã đơn hàng
const layDonHangTheoIdHoacMa = async (req, res) => {
    try {
        const { id } = req.params;

        let donHang = await DonHang.findOne({
            $or: [
                { id: id },
                { ma_don_hang: { $regex: `^${id}$`, $options: 'i' } }
            ]
        });

        if (!donHang && id.match(/^[0-9a-fA-F]{24}$/)) {
            donHang = await DonHang.findById(id);
        }

        if (!donHang) {
            return res.status(404).json({ thong_diep: `Không tìm thấy đơn hàng với mã/id: ${id}` });
        }

        return res.status(200).json(donHang);
    } catch (loi) {
        console.error('Lỗi tra cứu đơn hàng:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi tra cứu đơn hàng', chi_tiet: loi.message });
    }
};

// 4. Cập nhật trạng thái hoặc thông tin đơn hàng
const capNhatTrangThaiDonHang = async (req, res) => {
    try {
        const { id } = req.params;
        const duLieuCapNhat = req.body;

        let donHang = await DonHang.findOneAndUpdate(
            { $or: [{ id: id }, { ma_don_hang: id }] },
            { $set: duLieuCapNhat },
            { new: true, runValidators: true }
        );

        if (!donHang && id.match(/^[0-9a-fA-F]{24}$/)) {
            donHang = await DonHang.findByIdAndUpdate(id, { $set: duLieuCapNhat }, { new: true });
        }

        if (!donHang) {
            return res.status(404).json({ thong_diep: `Không tìm thấy đơn hàng: ${id}` });
        }

        return res.status(200).json(donHang);
    } catch (loi) {
        console.error('Lỗi cập nhật đơn hàng:', loi);
        return res.status(400).json({ thong_diep: 'Không thể cập nhật đơn hàng', chi_tiet: loi.message });
    }
};

// 5. Xóa đơn hàng (dành cho Admin khi cần)
const xoaDonHang = async (req, res) => {
    try {
        const { id } = req.params;

        let donHang = await DonHang.findOneAndDelete({
            $or: [{ id: id }, { ma_don_hang: id }]
        });

        if (!donHang && id.match(/^[0-9a-fA-F]{24}$/)) {
            donHang = await DonHang.findByIdAndDelete(id);
        }

        if (!donHang) {
            return res.status(404).json({ thong_diep: `Không tìm thấy đơn hàng để xóa: ${id}` });
        }

        return res.status(200).json({ thong_diep: 'Đã xóa đơn hàng thành công', ma_don_hang: donHang.ma_don_hang });
    } catch (loi) {
        console.error('Lỗi xóa đơn hàng:', loi);
        return res.status(500).json({ thong_diep: 'Không thể xóa đơn hàng', chi_tiet: loi.message });
    }
};

module.exports = {
    taoDonHangMoi,
    layDanhSachDonHang,
    layDonHangTheoIdHoacMa,
    capNhatTrangThaiDonHang,
    xoaDonHang
};
