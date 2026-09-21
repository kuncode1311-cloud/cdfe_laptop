const DanhGia = require('../models/danh-gia.model');
const SanPham = require('../models/san-pham.model');

/**
 * Controller xử lý Đánh giá & Bình luận sản phẩm
 */

// 1. Lấy danh sách đánh giá theo ID sản phẩm hoặc toàn bộ
const layDanhGiaTheoSanPham = async (req, res) => {
    try {
        const { productId } = req.params;
        const idSp = productId || req.query.id_san_pham;

        const filter = {};
        if (idSp) {
            filter.id_san_pham = idSp;
        }

        const sortQuery = idSp ? { createdAt: -1 } : { id: 1 };
        const danhSachDanhGia = await DanhGia.find(filter).sort(sortQuery).lean();

        // Tự động gộp tên sản phẩm từ bảng san_pham để Frontend hiển thị chuẩn 100% DB
        const idsSanPham = [...new Set(danhSachDanhGia.map(dg => dg.id_san_pham).filter(Boolean))];
        const danhSachSp = await SanPham.find({ id: { $in: idsSanPham } }, { id: 1, ten_san_pham: 1, hinh_anh_chinh: 1 }).lean();
        const banDoSanPham = {};
        danhSachSp.forEach(sp => {
            banDoSanPham[sp.id] = sp;
        });

        const ketQua = danhSachDanhGia.map(dg => ({
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

// 2. Thêm đánh giá mới và tự động cập nhật lại điểm trung bình của sản phẩm
const themDanhGiaMoi = async (req, res) => {
    try {
        const duLieuDanhGia = req.body;

        if (!duLieuDanhGia.id) {
            duLieuDanhGia.id = `dg-${Date.now()}`;
        }
        if (!duLieuDanhGia.ho_ten && duLieuDanhGia.ten_nguoi_dung) {
            duLieuDanhGia.ho_ten = duLieuDanhGia.ten_nguoi_dung;
        }

        const danhGiaMoi = new DanhGia(duLieuDanhGia);
        const ketQua = await danhGiaMoi.save();

        // Tự động tính toán lại điểm đánh giá trung bình của sản phẩm
        if (duLieuDanhGia.id_san_pham) {
            const tatCaDanhGia = await DanhGia.find({ id_san_pham: duLieuDanhGia.id_san_pham });
            if (tatCaDanhGia.length > 0) {
                const tongSao = tatCaDanhGia.reduce((tong, item) => tong + (item.so_sao || 5), 0);
                const diemTB = Math.round((tongSao / tatCaDanhGia.length) * 10) / 10;

                await SanPham.findOneAndUpdate(
                    { id: duLieuDanhGia.id_san_pham },
                    {
                        $set: {
                            diem_danh_gia_tb: diemTB,
                            so_luong_danh_gia: tatCaDanhGia.length
                        }
                    }
                );
            }
        }

        return res.status(201).json(ketQua);
    } catch (loi) {
        console.error('Lỗi gửi đánh giá:', loi);
        return res.status(400).json({ thong_diep: 'Không thể gửi đánh giá mới', chi_tiet: loi.message });
    }
};

// 3. Tăng lượt thích cho đánh giá
const tangLuotThich = async (req, res) => {
    try {
        const { id } = req.params;
        const danhGia = await DanhGia.findOneAndUpdate(
            { $or: [{ id: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
            { $inc: { luot_thich: 1 } },
            { new: true }
        );
        if (!danhGia) {
            return res.status(404).json({ thong_diep: 'Không tìm thấy đánh giá' });
        }
        return res.status(200).json(danhGia);
    } catch (loi) {
        return res.status(500).json({ thong_diep: 'Lỗi cập nhật lượt thích', chi_tiet: loi.message });
    }
};

module.exports = {
    layDanhGiaTheoSanPham,
    themDanhGiaMoi,
    tangLuotThich
};
