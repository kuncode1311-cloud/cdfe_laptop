const DanhGia = require('../models/danh-gia.model');
const SanPham = require('../models/san-pham.model');
const DonHang = require('../models/don-hang.model');
const { laUrlAnhHopLe } = require('../utils/bao-mat');

/**
 * Controller xử lý Đánh giá & Bình luận sản phẩm
 */

// 1. Lấy danh sách đánh giá theo ID sản phẩm hoặc toàn bộ
const layDanhGiaTheoSanPham = async (req, res) => {
    try {
        const { productId } = req.params;
        const idSpGoc = productId || req.query.id_san_pham;
        const idSp = typeof idSpGoc === 'string' ? idSpGoc.slice(0, 200) : '';

        const filter = { hien_thi: { $ne: false } };
        if (idSp) {
            filter.id_san_pham = idSp;
        }

        const sortQuery = idSp ? { createdAt: -1 } : { id: 1 };
        const danhSachDanhGia = await DanhGia.find(filter).sort(sortQuery).lean();

        // Tự động gộp tên sản phẩm từ bảng san_pham để Frontend hiển thị chuẩn 100% DB
        const idsSanPham = [...new Set(danhSachDanhGia.map((dg) => dg.id_san_pham).filter(Boolean))];
        const danhSachSp = await SanPham.find(
            { id: { $in: idsSanPham } },
            { id: 1, ten_san_pham: 1, hinh_anh_chinh: 1 }
        ).lean();
        const banDoSanPham = {};
        danhSachSp.forEach((sp) => {
            banDoSanPham[sp.id] = sp;
        });

        const ketQua = danhSachDanhGia.map((dg) => ({
            ...dg,
            ho_ten: dg.ho_ten || dg.ten_nguoi_dung,
            ten_nguoi_dung: dg.ho_ten || dg.ten_nguoi_dung,
            ten_san_pham: banDoSanPham[dg.id_san_pham]?.ten_san_pham || 'Laptop chính hãng',
            hinh_anh_san_pham: banDoSanPham[dg.id_san_pham]?.hinh_anh_chinh || ''
        }));

        return res.status(200).json(ketQua);
    } catch (loi) {
        console.error('Lỗi lấy đánh giá sản phẩm:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi lấy đánh giá sản phẩm', chi_tiet: loi.message });
    }
};

// Hàm nội bộ dùng chung: tính lại điểm đánh giá trung bình + số lượt đánh giá của 1 sản phẩm
// (chỉ tính trên các đánh giá đang hiển thị, bỏ qua đánh giá đã bị Admin ẩn)
const tinhLaiDiemDanhGia = async (idSanPham) => {
    if (!idSanPham) return;
    const tatCaDanhGia = await DanhGia.find({ id_san_pham: idSanPham, hien_thi: { $ne: false } });
    const diemTB =
        tatCaDanhGia.length > 0
            ? Math.round((tatCaDanhGia.reduce((tong, dg) => tong + (dg.so_sao || 5), 0) / tatCaDanhGia.length) * 10) /
              10
            : 0;
    await SanPham.findOneAndUpdate(
        { id: idSanPham },
        { $set: { diem_danh_gia_tb: diemTB, so_luong_danh_gia: tatCaDanhGia.length } }
    );
};

// 2. Thêm đánh giá mới và tự động cập nhật lại điểm trung bình của sản phẩm
const themDanhGiaMoi = async (req, res) => {
    try {
        const duLieuGuiLen = req.body || {};
        const idSanPham = String(duLieuGuiLen.id_san_pham || '').trim();
        const noiDung = String(duLieuGuiLen.noi_dung || '').trim();
        const soSao = Math.round(Number(duLieuGuiLen.so_sao) || 5);

        if (!idSanPham || !noiDung) {
            return res.status(400).json({
                thong_diep: 'Vui lòng chọn sản phẩm và nhập nội dung đánh giá.'
            });
        }

        if (soSao < 1 || soSao > 5) {
            return res.status(400).json({
                thong_diep: 'Số sao đánh giá phải nằm trong khoảng từ 1 đến 5.'
            });
        }

        const userId = String(req.user?.id || req.user?._id || '');
        const userEmail = String(req.user?.email || '')
            .trim()
            .toLowerCase();

        // Chỉ xác định đơn của mình theo id tài khoản (email chỉ cho đơn cũ chưa gắn id).
        // Không dùng SĐT vì SĐT hồ sơ do người dùng tự khai, không được xác minh.
        const dieuKienChuDon = [{ id_nguoi_dung: userId }];
        if (req.user?._id) dieuKienChuDon.push({ id_nguoi_dung: String(req.user._id) });
        if (userEmail) {
            dieuKienChuDon.push({
                'thong_tin_giao_hang.email': userEmail,
                id_nguoi_dung: { $in: [null, ''] }
            });
        }

        const donHangDaMua = await DonHang.findOne({
            trang_thai: 'da_giao',
            $or: dieuKienChuDon,
            danh_sach_san_pham: {
                $elemMatch: {
                    $or: [
                        { san_pham_id: idSanPham },
                        { 'san_pham.id': idSanPham },
                        { 'san_pham.ma_san_pham': idSanPham }
                    ]
                }
            }
        }).lean();

        if (!donHangDaMua) {
            return res.status(403).json({
                thong_diep: 'Chỉ tài khoản đã mua và nhận sản phẩm này mới được gửi đánh giá.'
            });
        }

        const daDanhGia = await DanhGia.findOne({
            id_san_pham: idSanPham,
            id_nguoi_dung: userId
        }).lean();

        if (daDanhGia) {
            return res.status(409).json({
                thong_diep: 'Bạn đã đánh giá sản phẩm này rồi.'
            });
        }

        const duLieuDanhGia = {
            id: `dg-${Date.now()}`,
            id_san_pham: idSanPham,
            id_nguoi_dung: userId,
            ho_ten: req.user?.hoTen || req.user?.ho_ten || 'Khách hàng',
            ten_nguoi_dung: req.user?.hoTen || req.user?.ho_ten || 'Khách hàng',
            avatar: req.user?.avatar || '',
            so_sao: soSao,
            tieu_de:
                String(duLieuGuiLen.tieu_de || '')
                    .trim()
                    .slice(0, 120) || 'Khách hàng đánh giá sản phẩm',
            noi_dung: noiDung.slice(0, 1000),
            // Chỉ nhận URL ảnh http(s) hoặc đường dẫn nội bộ, chặn javascript:/data: (XSS)
            hinh_anh_dinh_kem: Array.isArray(duLieuGuiLen.hinh_anh_dinh_kem)
                ? duLieuGuiLen.hinh_anh_dinh_kem.filter(laUrlAnhHopLe).slice(0, 5)
                : [],
            da_mua_hang: true,
            luot_thich: 0,
            thoi_gian_dung: String(duLieuGuiLen.thoi_gian_dung || 'Khách vừa nhận hàng').slice(0, 80)
        };

        const danhGiaMoi = new DanhGia(duLieuDanhGia);
        const ketQua = await danhGiaMoi.save();

        // Tự động tính toán lại điểm đánh giá trung bình của sản phẩm
        await tinhLaiDiemDanhGia(duLieuDanhGia.id_san_pham);

        return res.status(201).json(ketQua);
    } catch (loi) {
        console.error('Lỗi gửi đánh giá:', loi);
        return res.status(400).json({ thong_diep: 'Không thể gửi đánh giá mới', chi_tiet: loi.message });
    }
};

// 3. Tăng lượt thích cho đánh giá
const tangLuotThich = async (req, res) => {
    try {
        const id = String(req.params.id || '');
        const danhGia = await DanhGia.findOneAndUpdate(
            { $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            { $inc: { luot_thich: 1 } },
            { returnDocument: 'after' }
        );
        if (!danhGia) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy đánh giá' });
        }
        return res.status(200).json(danhGia);
    } catch (loi) {
        return res.status(500).json({ thong_diep: 'Lỗi cập nhật lượt thích', chi_tiet: loi.message });
    }
};

// 4. [Admin] Lấy TOÀN BỘ đánh giá (kể cả đã ẩn) để duyệt/kiểm soát
const layDanhGiaChoAdmin = async (req, res) => {
    try {
        const danhSachDanhGia = await DanhGia.find({}).sort({ createdAt: -1 }).lean();
        const idsSanPham = [...new Set(danhSachDanhGia.map((dg) => dg.id_san_pham).filter(Boolean))];
        const danhSachSp = await SanPham.find(
            { id: { $in: idsSanPham } },
            { id: 1, ten_san_pham: 1, hinh_anh_chinh: 1 }
        ).lean();
        const banDoSanPham = {};
        danhSachSp.forEach((sp) => {
            banDoSanPham[sp.id] = sp;
        });
        const ketQua = danhSachDanhGia.map((dg) => ({
            ...dg,
            ten_san_pham: banDoSanPham[dg.id_san_pham]?.ten_san_pham || 'Sản phẩm đã gỡ',
            hinh_anh_san_pham: banDoSanPham[dg.id_san_pham]?.hinh_anh_chinh || ''
        }));
        return res.status(200).json(ketQua);
    } catch (loi) {
        console.error('Lỗi lấy đánh giá cho admin:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi lấy danh sách đánh giá', chi_tiet: loi.message });
    }
};

// 5. [Admin] Ẩn / hiện lại một đánh giá
const anHienDanhGia = async (req, res) => {
    try {
        const id = String(req.params.id || '');
        const hienThi = Boolean(req.body?.hien_thi);
        const danhGia = await DanhGia.findOneAndUpdate(
            { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            { $set: { hien_thi: hienThi } },
            { returnDocument: 'after' }
        );
        if (!danhGia) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy đánh giá' });
        }
        await tinhLaiDiemDanhGia(danhGia.id_san_pham);
        return res.status(200).json(danhGia);
    } catch (loi) {
        return res.status(500).json({ thong_diep: 'Lỗi cập nhật trạng thái hiển thị đánh giá', chi_tiet: loi.message });
    }
};

// 6. [Admin] Xóa một đánh giá
const xoaDanhGia = async (req, res) => {
    try {
        const id = String(req.params.id || '');
        const danhGia = await DanhGia.findOneAndDelete({
            $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
        });
        if (!danhGia) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy đánh giá để xóa' });
        }
        await tinhLaiDiemDanhGia(danhGia.id_san_pham);
        return res.status(200).json({ thong_diep: 'Đã xóa đánh giá thành công' });
    } catch (loi) {
        return res.status(500).json({ thong_diep: 'Lỗi xóa đánh giá', chi_tiet: loi.message });
    }
};

module.exports = {
    layDanhGiaTheoSanPham,
    themDanhGiaMoi,
    tangLuotThich,
    layDanhGiaChoAdmin,
    anHienDanhGia,
    xoaDanhGia
};
