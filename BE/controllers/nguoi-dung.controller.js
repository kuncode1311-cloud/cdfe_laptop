const NguoiDung = require('../models/nguoi-dung.model');

/**
 * Controller xử lý Người dùng / Tài khoản
 */

// 1. Lấy danh sách hoặc tìm người dùng theo query (email)
const layDanhSachNguoiDung = async (req, res) => {
    try {
        const { email } = req.query;
        const filter = {};

        if (email) {
            filter.email = email.trim().toLowerCase();
        }

        const danhSach = await NguoiDung.find(filter).sort({ ngayTao: -1 });
        return res.status(200).json(danhSach);
    } catch (loi) {
        console.error('Lỗi lấy thông tin người dùng:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ', chi_tiet: loi.message });
    }
};

// 2. Tạo tài khoản người dùng mới (Đăng ký)
const taoNguoiDungMoi = async (req, res) => {
    try {
        const duLieu = req.body;

        if (!duLieu.id) {
            duLieu.id = 'usr_' + Date.now();
        }
        if (duLieu.email) {
            duLieu.email = duLieu.email.trim().toLowerCase();
        }

        const daTonTai = await NguoiDung.findOne({ email: duLieu.email });
        if (daTonTai) {
            return res.status(400).json({ thong_diep: 'Email này đã được đăng ký tài khoản!' });
        }

        const nguoiDungMoi = new NguoiDung(duLieu);
        const ketQua = await nguoiDungMoi.save();
        return res.status(201).json(ketQua);
    } catch (loi) {
        console.error('Lỗi tạo người dùng:', loi);
        return res.status(400).json({ thong_diep: 'Không thể tạo tài khoản', chi_tiet: loi.message });
    }
};

// 3. Cập nhật thông tin người dùng (cho Admin)
const capNhatNguoiDung = async (req, res) => {
    try {
        const { id } = req.params;
        const duLieuCapNhat = req.body;

        // Tránh ghi đè mật khẩu plain nếu không thay đổi
        if (!duLieuCapNhat.matKhau) {
            delete duLieuCapNhat.matKhau;
        }

        let user = await NguoiDung.findOneAndUpdate(
            { $or: [{ id: id }, { email: id }] },
            { $set: duLieuCapNhat },
            { new: true }
        );

        if (!user && id.match(/^[0-9a-fA-F]{24}$/)) {
            user = await NguoiDung.findByIdAndUpdate(id, { $set: duLieuCapNhat }, { new: true });
        }

        if (!user) {
            return res.status(404).json({ thong_diep: `Không tìm thấy người dùng: ${id}` });
        }

        return res.status(200).json(user);
    } catch (loi) {
        console.error('Lỗi cập nhật người dùng:', loi);
        return res.status(400).json({ thong_diep: 'Không thể cập nhật người dùng', chi_tiet: loi.message });
    }
};

// 4. Xóa người dùng (cho Admin)
const xoaNguoiDung = async (req, res) => {
    try {
        const { id } = req.params;

        let user = await NguoiDung.findOneAndDelete({
            $or: [{ id: id }, { email: id }]
        });

        if (!user && id.match(/^[0-9a-fA-F]{24}$/)) {
            user = await NguoiDung.findByIdAndDelete(id);
        }

        if (!user) {
            return res.status(404).json({ thong_diep: `Không tìm thấy người dùng để xóa: ${id}` });
        }

        return res.status(200).json({ thong_diep: 'Đã xóa người dùng thành công', email: user.email });
    } catch (loi) {
        console.error('Lỗi xóa người dùng:', loi);
        return res.status(500).json({ thong_diep: 'Không thể xóa người dùng', chi_tiet: loi.message });
    }
};

module.exports = {
    layDanhSachNguoiDung,
    taoNguoiDungMoi,
    capNhatNguoiDung,
    xoaNguoiDung
};
