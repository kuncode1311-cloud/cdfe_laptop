const GioHang = require('../models/gio-hang.model');
const SanPham = require('../models/san-pham.model');
const { chuoiAnToan } = require('../utils/bao-mat');

/**
 * LUỒNG 7: Quản lý Giỏ hàng Người dùng (Cart Management & Synchronization)
 * - Mọi thao tác đều gắn chặt với JWT (`req.user.id`), đảm bảo tài khoản này không can thiệp giỏ của tài khoản khác.
 * - Server chỉ lưu { san_pham_id, ma_tuy_chon, so_luong }, giá tiền luôn được lấy động từ DB để chống sửa giá client.
 * - Tự động dọn dẹp các mặt hàng hết tồn kho hoặc bị ẩn khi khách xem giỏ.
 */
const TOI_DA_SO_MUC = 50;
const TOI_DA_SO_LUONG = 10; // Khớp giới hạn mỗi dòng khi tạo đơn hàng

// Sản phẩm còn bán được: không bị Admin ẩn và còn tồn kho
const conBanDuoc = (sanPham) => Boolean(sanPham) && sanPham.con_hang !== false && Number(sanPham.so_luong_ton_kho) > 0;

// Chỉ giữ mã sản phẩm, tùy chọn và số lượng; mọi thứ khác (đặc biệt là giá) client gửi lên đều bị bỏ qua
const chuanHoaMuc = (muc) => ({
    san_pham_id: chuoiAnToan(muc?.san_pham_id, 100),
    ma_tuy_chon: chuoiAnToan(muc?.ma_tuy_chon, 100),
    so_luong: Math.min(TOI_DA_SO_LUONG, Math.max(1, Math.floor(Number(muc?.so_luong) || 1)))
});

/**
 * [BƯỚC 1]: Lấy thông tin giỏ hàng của tài khoản đang đăng nhập
 * Endpoint: GET /api/gio-hang
 * Luồng thực thi:
 *   Bước 1: Lấy danh sách mã sản phẩm từ giỏ hàng trong MongoDB.
 *   Bước 2: Nạp dữ liệu sản phẩm mới nhất từ bảng SanPham (giá hiện tại, khuyến mãi, tồn kho thực).
 *   Bước 3: Tự động phát hiện và gỡ bỏ các món đã hết hàng hoặc bị ẩn.
 *   Bước 4: Nếu số lượng đặt lớn hơn tồn kho thực, tự động hạ về bằng số lượng tồn kho tối đa.
 *   Bước 5: Trả về danh sách món hợp lệ kèm danh sách các món bị gỡ (để FE thông báo cho khách).
 */
const layGioHang = async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
        const gio = await GioHang.findOne({ id_nguoi_dung: req.user.id }).lean();
        const cacMuc = gio?.danh_sach_muc || [];
        if (cacMuc.length === 0) return res.json({ danh_sach_muc: [], da_go: [] });

        const danhSachSanPham = await SanPham.find({ id: { $in: cacMuc.map((m) => m.san_pham_id) } }).lean();
        const theoId = new Map(danhSachSanPham.map((sp) => [sp.id, sp]));

        const conLai = [];
        const daGo = [];
        for (const muc of cacMuc) {
            const sanPham = theoId.get(muc.san_pham_id);
            if (!conBanDuoc(sanPham)) {
                daGo.push(sanPham?.ten_san_pham || muc.san_pham_id);
                continue;
            }
            conLai.push({
                san_pham_id: muc.san_pham_id,
                ma_tuy_chon: muc.ma_tuy_chon,
                // Tồn kho ít hơn số lượng đã chọn thì hạ số lượng xuống còn đúng bấy nhiêu
                so_luong: Math.min(muc.so_luong, Number(sanPham.so_luong_ton_kho)),
                san_pham: sanPham
            });
        }

        // Dọn luôn trong database để lần sau không phải xử lý lại
        if (daGo.length > 0) {
            await GioHang.updateOne(
                { id_nguoi_dung: req.user.id },
                {
                    $set: {
                        danh_sach_muc: conLai.map(({ san_pham_id, ma_tuy_chon, so_luong }) => ({
                            san_pham_id,
                            ma_tuy_chon,
                            so_luong
                        }))
                    }
                }
            );
        }
        return res.json({ danh_sach_muc: conLai, da_go: daGo });
    } catch (loi) {
        console.error('Lỗi lấy giỏ hàng:', loi.message);
        return res.status(500).json({ thong_diep: 'Không thể lấy giỏ hàng' });
    }
};

// PUT /api/gio-hang — ghi đè toàn bộ giỏ (mảng rỗng = xóa sạch giỏ)
const luuGioHang = async (req, res) => {
    try {
        const guiLen = req.body?.danh_sach_muc;
        if (!Array.isArray(guiLen) || guiLen.length > TOI_DA_SO_MUC) {
            return res.status(400).json({ thong_diep: `Giỏ hàng không hợp lệ (tối đa ${TOI_DA_SO_MUC} sản phẩm).` });
        }

        // Gộp các dòng trùng (cùng sản phẩm + cùng tùy chọn) và bỏ dòng thiếu mã sản phẩm
        const daGop = new Map();
        for (const muc of guiLen.map(chuanHoaMuc)) {
            if (!muc.san_pham_id) continue;
            const khoa = `${muc.san_pham_id}|${muc.ma_tuy_chon}`;
            const cu = daGop.get(khoa);
            daGop.set(khoa, cu ? { ...cu, so_luong: Math.min(TOI_DA_SO_LUONG, cu.so_luong + muc.so_luong) } : muc);
        }
        const danhSach = [...daGop.values()];

        await GioHang.findOneAndUpdate(
            { id_nguoi_dung: req.user.id },
            { $set: { danh_sach_muc: danhSach } },
            { upsert: true, returnDocument: 'after' }
        );
        return res.json({ thanh_cong: true, so_muc: danhSach.length });
    } catch (loi) {
        console.error('Lỗi lưu giỏ hàng:', loi.message);
        return res.status(500).json({ thong_diep: 'Không thể lưu giỏ hàng' });
    }
};

module.exports = { layGioHang, luuGioHang };
