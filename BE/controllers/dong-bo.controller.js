const crypto = require('crypto');
const SanPham = require('../models/san-pham.model');
const DanhMuc = require('../models/danh-muc.model');
const MaGiamGia = require('../models/ma-giam-gia.model');
const TinTuc = require('../models/tin-tuc.model');
const DanhGia = require('../models/danh-gia.model');
const CaiDat = require('../models/cai-dat.model');

/**
 * "Phiên bản dữ liệu" của các bảng công khai.
 *
 * Front-End gọi API này vài giây một lần; chỉ khi chữ ký của một bảng đổi (Admin thêm / sửa / xóa)
 * thì trang của khách mới nạp lại bảng đó. Khách nhờ vậy thấy thay đổi ngay mà không cần F5,
 * và API này rất nhẹ (chỉ đếm số bản ghi + lấy mốc cập nhật mới nhất, không trả dữ liệu).
 */

// Chữ ký = "số bản ghi : mốc updatedAt mới nhất". Thêm / xóa đổi số bản ghi; sửa đổi mốc thời gian.
const chuKyTheoThoiGian = async (Model) => {
    const [ketQua] = await Model.aggregate([{ $group: { _id: null, n: { $sum: 1 }, t: { $max: '$updatedAt' } } }]);
    const mocThoiGian = ketQua?.t ? new Date(ketQua.t).getTime() : 0;
    return `${ketQua?.n ?? 0}:${mocThoiGian}`;
};

// Bảng cài đặt không có updatedAt và rất nhỏ → băm toàn bộ nội dung
const chuKyTheoNoiDung = async (Model) => {
    const tatCa = await Model.find().lean();
    return crypto.createHash('md5').update(JSON.stringify(tatCa)).digest('hex').slice(0, 12);
};

// Bộ nhớ đệm 2 giây: nhiều khách cùng hỏi chỉ tốn một lần truy vấn database
const THOI_GIAN_DEM_MS = 2000;
let boNhoDem = { luc: 0, duLieu: null };

const tinhPhienBan = async () => {
    const [sanPham, danhMuc, maGiamGia, tinTuc, danhGia, caiDat] = await Promise.all([
        chuKyTheoThoiGian(SanPham),
        chuKyTheoThoiGian(DanhMuc),
        chuKyTheoThoiGian(MaGiamGia),
        chuKyTheoThoiGian(TinTuc),
        chuKyTheoThoiGian(DanhGia),
        chuKyTheoNoiDung(CaiDat)
    ]);
    return {
        san_pham: sanPham,
        danh_muc: danhMuc,
        ma_giam_gia: maGiamGia,
        tin_tuc: tinTuc,
        danh_gia: danhGia,
        cai_dat: caiDat
    };
};

const layPhienBanDuLieu = async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
        if (!boNhoDem.duLieu || Date.now() - boNhoDem.luc > THOI_GIAN_DEM_MS) {
            boNhoDem = { luc: Date.now(), duLieu: await tinhPhienBan() };
        }
        return res.status(200).json({ phien_ban: boNhoDem.duLieu });
    } catch (loi) {
        console.error('Lỗi lấy phiên bản dữ liệu:', loi.message);
        return res.status(500).json({ thong_diep: 'Không lấy được phiên bản dữ liệu' });
    }
};

// Dùng cho kiểm thử: xóa bộ nhớ đệm để kiểm tra chữ ký thay đổi ngay
const xoaBoNhoDemPhienBan = () => {
    boNhoDem = { luc: 0, duLieu: null };
};

module.exports = { layPhienBanDuLieu, xoaBoNhoDemPhienBan };
