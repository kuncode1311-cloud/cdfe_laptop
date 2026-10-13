const YeuThich = require('../models/yeu-thich.model');
const SanPham = require('../models/san-pham.model');

// 1. Lấy danh sách sản phẩm yêu thích của tài khoản đang đăng nhập (trả về object sản phẩm đầy đủ)
const layYeuThichCuaToi = async (req, res) => {
    try {
        const idNguoiDung = String(req.user.id || req.user._id || '');
        const danhSach = await YeuThich.find({ id_nguoi_dung: idNguoiDung }).sort({ createdAt: -1 }).lean();
        const idsSanPham = danhSach.map((item) => item.id_san_pham);
        const danhSachSanPham = idsSanPham.length ? await SanPham.find({ id: { $in: idsSanPham } }).lean() : [];
        const banDoSanPham = {};
        danhSachSanPham.forEach((sp) => {
            banDoSanPham[sp.id] = sp;
        });
        // Giữ đúng thứ tự thêm vào (mới nhất trước), bỏ qua sản phẩm đã bị gỡ khỏi hệ thống
        const ketQua = idsSanPham.map((id) => banDoSanPham[id]).filter(Boolean);
        return res.status(200).json(ketQua);
    } catch (loi) {
        console.error('Lỗi lấy danh sách yêu thích:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi lấy danh sách yêu thích', chi_tiet: loi.message });
    }
};

// 2. Thêm sản phẩm vào danh sách yêu thích
const themYeuThich = async (req, res) => {
    try {
        const idNguoiDung = String(req.user.id || req.user._id || '');
        const idSanPham = String(req.body.id_san_pham || '').trim();
        if (!idSanPham) {
            return res.status(400).json({ thong_diep: 'Thiếu mã sản phẩm cần thêm vào yêu thích.' });
        }
        await YeuThich.findOneAndUpdate(
            { id_nguoi_dung: idNguoiDung, id_san_pham: idSanPham },
            { $setOnInsert: { id_nguoi_dung: idNguoiDung, id_san_pham: idSanPham } },
            { upsert: true }
        );
        return res.status(200).json({ thong_diep: 'Đã thêm vào danh sách yêu thích', da_them: true });
    } catch (loi) {
        console.error('Lỗi thêm yêu thích:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi thêm vào yêu thích', chi_tiet: loi.message });
    }
};

// 3. Bỏ sản phẩm khỏi danh sách yêu thích
const xoaYeuThich = async (req, res) => {
    try {
        const idNguoiDung = String(req.user.id || req.user._id || '');
        const idSanPham = String(req.params.idSanPham || '').trim();
        await YeuThich.deleteOne({ id_nguoi_dung: idNguoiDung, id_san_pham: idSanPham });
        return res.status(200).json({ thong_diep: 'Đã bỏ khỏi danh sách yêu thích' });
    } catch (loi) {
        console.error('Lỗi xóa yêu thích:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi bỏ khỏi yêu thích', chi_tiet: loi.message });
    }
};

module.exports = { layYeuThichCuaToi, themYeuThich, xoaYeuThich };
