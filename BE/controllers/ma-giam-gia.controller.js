const MaGiamGia = require('../models/ma-giam-gia.model');

/**
 * Controller xử lý nghiệp vụ cho Mã giảm giá (Voucher)
 */

// 1. Lấy toàn bộ danh sách mã giảm giá
const layDanhSachMaGiamGia = async (req, res) => {
    try {
        const { kich_hoat } = req.query;
        const filter = {};

        if (kich_hoat !== undefined) {
            filter.kich_hoat = kich_hoat === 'true' || kich_hoat === '1';
        }

        const danhSachVoucher = await MaGiamGia.find(filter).sort({ gia_tri_giam: -1 });
        return res.status(200).json(danhSachVoucher);
    } catch (loi) {
        console.error('Lỗi lấy danh sách mã giảm giá:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi lấy mã giảm giá', chi_tiet: loi.message });
    }
};

// 2. Kiểm tra tính hợp lệ của mã giảm giá
const kiemTraMaGiamGia = async (req, res) => {
    try {
        const { ma_code, tong_tien_tam_tinh } = req.body;

        if (!ma_code || !ma_code.trim()) {
            return res.status(400).json({
                hop_le: false,
                thong_diep: 'Vui lòng nhập mã giảm giá.',
                so_tien_giam: 0
            });
        }

        const codeChuan = ma_code.trim().toUpperCase();
        const voucher = await MaGiamGia.findOne({
            ma_code: codeChuan,
            kich_hoat: true
        });

        if (!voucher) {
            return res.status(404).json({
                hop_le: false,
                thong_diep: 'Mã giảm giá không tồn tại hoặc đã hết hạn sử dụng.',
                so_tien_giam: 0
            });
        }

        const tamTinh = Number(tong_tien_tam_tinh) || 0;
        if (tamTinh < voucher.don_hang_toi_thieu) {
            return res.status(400).json({
                hop_le: false,
                thong_diep: `Đơn hàng tối thiểu phải từ ${new Intl.NumberFormat('vi-VN').format(voucher.don_hang_toi_thieu)}đ để áp dụng mã này.`,
                so_tien_giam: 0
            });
        }

        let soTienGiam = 0;
        if (voucher.loai_giam === 'tien_mat') {
            soTienGiam = voucher.gia_tri_giam;
        } else {
            soTienGiam = Math.round((tamTinh * voucher.gia_tri_giam) / 100);
            if (voucher.giam_toi_da && soTienGiam > voucher.giam_toi_da) {
                soTienGiam = voucher.giam_toi_da;
            }
        }

        return res.status(200).json({
            hop_le: true,
            thong_diep: `Áp dụng thành công mã "${voucher.ma_code}"! Giảm ${new Intl.NumberFormat('vi-VN').format(soTienGiam)}đ.`,
            so_tien_giam: soTienGiam,
            ma_ap_dung: voucher
        });
    } catch (loi) {
        console.error('Lỗi kiểm tra mã giảm giá:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi kiểm tra mã giảm giá', chi_tiet: loi.message });
    }
};

// 3. Thêm mã giảm giá mới (cho Admin)
const themMaGiamGia = async (req, res) => {
    try {
        const duLieuMoi = req.body;
        if (duLieuMoi.ma_code) {
            duLieuMoi.ma_code = duLieuMoi.ma_code.toUpperCase().trim();
        }

        const maDaCo = await MaGiamGia.findOne({ ma_code: duLieuMoi.ma_code });
        if (maDaCo) {
            return res.status(400).json({ thong_diep: 'Mã giảm giá này đã tồn tại!' });
        }

        const voucherMoi = new MaGiamGia(duLieuMoi);
        const ketQua = await voucherMoi.save();
        return res.status(201).json(ketQua);
    } catch (loi) {
        console.error('Lỗi thêm mã giảm giá:', loi);
        return res.status(400).json({ thong_diep: 'Không thể thêm mã giảm giá', chi_tiet: loi.message });
    }
};

// 4. Cập nhật mã giảm giá (bật/tắt hoặc chỉnh sửa)
const capNhatMaGiamGia = async (req, res) => {
    try {
        const { id } = req.params;
        const duLieuCapNhat = req.body;

        let voucher = await MaGiamGia.findOneAndUpdate(
            { $or: [{ id: id }, { ma_code: id }] },
            { $set: duLieuCapNhat },
            { new: true }
        );

        if (!voucher && id.match(/^[0-9a-fA-F]{24}$/)) {
            voucher = await MaGiamGia.findByIdAndUpdate(id, { $set: duLieuCapNhat }, { new: true });
        }

        if (!voucher) {
            return res.status(404).json({ thong_diep: `Không tìm thấy mã giảm giá: ${id}` });
        }

        return res.status(200).json(voucher);
    } catch (loi) {
        console.error('Lỗi cập nhật mã giảm giá:', loi);
        return res.status(400).json({ thong_diep: 'Không thể cập nhật mã giảm giá', chi_tiet: loi.message });
    }
};

// 5. Xóa mã giảm giá
const xoaMaGiamGia = async (req, res) => {
    try {
        const { id } = req.params;

        let voucher = await MaGiamGia.findOneAndDelete({
            $or: [{ id: id }, { ma_code: id }]
        });

        if (!voucher && id.match(/^[0-9a-fA-F]{24}$/)) {
            voucher = await MaGiamGia.findByIdAndDelete(id);
        }

        if (!voucher) {
            return res.status(404).json({ thong_diep: `Không tìm thấy mã giảm giá để xóa: ${id}` });
        }

        return res.status(200).json({ thong_diep: 'Đã xóa mã giảm giá thành công', ma_code: voucher.ma_code });
    } catch (loi) {
        console.error('Lỗi xóa mã giảm giá:', loi);
        return res.status(500).json({ thong_diep: 'Không thể xóa mã giảm giá', chi_tiet: loi.message });
    }
};

// 6. Lưu mã voucher vào ví của người dùng (Yêu cầu Token Đăng Nhập)
const luuMaVoucherVaoVi = async (req, res) => {
    try {
        const { ma_code } = req.body;
        if (!ma_code) {
            return res.status(400).json({ thong_diep: 'Vui lòng cung cấp mã voucher cần lưu!' });
        }

        const maChuan = ma_code.trim().toUpperCase();
        const voucher = await MaGiamGia.findOne({ ma_code: maChuan, kich_hoat: true });
        if (!voucher) {
            return res.status(404).json({ thong_diep: 'Mã giảm giá không tồn tại hoặc đã hết hạn!' });
        }

        const userId = req.user.id || req.user.userId;
        const NguoiDung = require('../models/nguoi-dung.model');
        const user = await NguoiDung.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy thông tin tài khoản người dùng!' });
        }

        if (!Array.isArray(user.viVoucher)) {
            user.viVoucher = [];
        }

        if (user.viVoucher.includes(maChuan)) {
            return res.status(200).json({
                thanh_cong: true,
                da_luu: true,
                thong_diep: `Mã "${maChuan}" đã có sẵn trong Ví Voucher của bạn!`,
                viVoucher: user.viVoucher
            });
        }

        user.viVoucher.push(maChuan);
        // Tăng phần trăm đã dùng và giảm số lượng còn lại một cách trực quan
        if (voucher.so_luong_con_lai > 0) {
            voucher.so_luong_con_lai -= 1;
            if (voucher.so_luong_phat_hanh > 0) {
                voucher.phan_tram_da_dung = Math.min(
                    99,
                    Math.round(((voucher.so_luong_phat_hanh - voucher.so_luong_con_lai) / voucher.so_luong_phat_hanh) * 100)
                );
            }
            await voucher.save();
        }

        await user.save();

        return res.status(200).json({
            thanh_cong: true,
            da_luu: true,
            thong_diep: `🎉 Săn mã thành công! Đã lưu "${maChuan}" vào Ví Voucher.`,
            ma_code: maChuan,
            viVoucher: user.viVoucher,
            voucher
        });
    } catch (loi) {
        console.error('Lỗi lưu mã voucher vào ví:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi lưu mã voucher', chi_tiet: loi.message });
    }
};

// 7. Lấy danh sách voucher trong ví của người dùng
const layViVoucherNguoiDung = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        const NguoiDung = require('../models/nguoi-dung.model');
        const user = await NguoiDung.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy tài khoản người dùng' });
        }

        const danhSachMa = user.viVoucher || [];
        const vouchers = await MaGiamGia.find({ ma_code: { $in: danhSachMa } });
        return res.status(200).json({
            thanh_cong: true,
            danhSachMa,
            vouchers
        });
    } catch (loi) {
        console.error('Lỗi lấy ví voucher:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi lấy ví voucher', chi_tiet: loi.message });
    }
};

module.exports = {
    layDanhSachMaGiamGia,
    kiemTraMaGiamGia,
    themMaGiamGia,
    capNhatMaGiamGia,
    xoaMaGiamGia,
    luuMaVoucherVaoVi,
    layViVoucherNguoiDung
};
