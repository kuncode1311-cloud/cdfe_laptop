const DonHang = require('../models/don-hang.model');
const SanPham = require('../models/san-pham.model');
const mongoose = require('mongoose');

/**
 * Controller xử lý nghiệp vụ cho Đơn hàng & Tồn kho
 */

/**
 * Hàm hỗ trợ xử lý tăng/giảm tồn kho và số lượng đã bán của sản phẩm khi đơn hàng thay đổi trạng thái
 * @param {Array} danhSachSanPham - Danh sách mặt hàng trong đơn
 * @param {'tru' | 'hoan'} thaoTac - 'tru' khi giao thành công, 'hoan' khi hủy đơn/chuyển khỏi giao thành công
 */
const capNhatTonKhoTheoDonHang = async (danhSachSanPham, thaoTac = 'tru') => {
    if (!Array.isArray(danhSachSanPham) || danhSachSanPham.length === 0) return;

    for (const item of danhSachSanPham) {
        try {
            const soLuong = Math.max(1, Number(item.so_luong) || 1);
            const spId = item.san_pham_id || item.san_pham?.id || item.san_pham?._id || item.san_pham?.ma_san_pham || item.id_muc || (typeof item.san_pham === 'string' ? item.san_pham : null);

            if (!spId && !item.ten_san_pham) continue;

            const orConditions = [];
            if (spId) {
                const strId = String(spId).trim();
                orConditions.push({ id: strId });
                orConditions.push({ ma_san_pham: strId });
                orConditions.push({ slug: strId });
                if (mongoose.Types.ObjectId.isValid(strId)) {
                    orConditions.push({ _id: strId });
                }
            }

            let sp = orConditions.length > 0 ? await SanPham.findOne({ $or: orConditions }) : null;

            if (!sp && item.ten_san_pham) {
                sp = await SanPham.findOne({ ten_san_pham: item.ten_san_pham.trim() });
            }

            if (!sp) {
                console.warn(`⚠️ [Kho] Không tìm thấy sản phẩm trong DB để cập nhật tồn kho:`, spId || item.ten_san_pham);
                continue;
            }

            if (thaoTac === 'tru') {
                // Trừ số lượng tồn kho (không âm), tăng số lượng đã bán
                sp.so_luong_ton_kho = Math.max(0, (Number(sp.so_luong_ton_kho) || 0) - soLuong);
                sp.so_luong_da_ban = (Number(sp.so_luong_da_ban) || 0) + soLuong;
                if (sp.so_luong_ton_kho <= 0) {
                    sp.con_hang = false;
                }

                // Cập nhật tồn kho chi nhánh nếu có
                if (Array.isArray(sp.ton_kho) && sp.ton_kho.length > 0) {
                    let conLai = soLuong;
                    for (const cn of sp.ton_kho) {
                        if (conLai <= 0) break;
                        const sl = Number(cn.so_luong_con) || 0;
                        if (sl > 0) {
                            const tru = Math.min(sl, conLai);
                            cn.so_luong_con = sl - tru;
                            conLai -= tru;
                        }
                    }
                }
                console.log(`📦 [Kho] ĐÃ TRỪ TỒN KHO: "${sp.ten_san_pham}" (-${soLuong}) | Còn lại: ${sp.so_luong_ton_kho} | Đã bán: ${sp.so_luong_da_ban}`);
            } else if (thaoTac === 'hoan') {
                // Hoàn lại tồn kho, giảm số lượng đã bán
                sp.so_luong_ton_kho = (Number(sp.so_luong_ton_kho) || 0) + soLuong;
                sp.so_luong_da_ban = Math.max(0, (Number(sp.so_luong_da_ban) || 0) - soLuong);
                if (sp.so_luong_ton_kho > 0) {
                    sp.con_hang = true;
                }

                // Hoàn lại tồn kho chi nhánh
                if (Array.isArray(sp.ton_kho) && sp.ton_kho.length > 0) {
                    sp.ton_kho[0].so_luong_con = (Number(sp.ton_kho[0].so_luong_con) || 0) + soLuong;
                }
                console.log(`↩️ [Kho] ĐÃ HOÀN TỒN KHO: "${sp.ten_san_pham}" (+${soLuong}) | Tồn kho mới: ${sp.so_luong_ton_kho} | Đã bán: ${sp.so_luong_da_ban}`);
            }

            await sp.save();
        } catch (err) {
            console.error(`❌ [Kho] Lỗi cập nhật tồn kho cho item:`, item?.ten_san_pham || item?.san_pham_id, err);
        }
    }
};

// 1. Tạo đơn hàng mới
const taoDonHangMoi = async (req, res) => {
    try {
        const duLieuDonHang = req.body;

        // Bắt buộc đăng nhập: Khách hàng phải có id_nguoi_dung mới được tạo đơn hàng
        const idNguoiDung = duLieuDonHang.id_nguoi_dung;
        if (!idNguoiDung || String(idNguoiDung).trim() === '') {
            return res.status(401).json({
                thong_diep: 'Quý khách vui lòng đăng nhập tài khoản trước khi đặt hàng!',
                yeu_cau_dang_nhap: true
            });
        }

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

        // Chuẩn hóa trạng thái thanh toán theo enum hợp lệ
        const trangThaiHopLe = ['chua_thanh_toan', 'cho_thanh_toan', 'da_thanh_toan', 'that_bai', 'thanh_toan_khi_nhan_hang'];
        if (!duLieuDonHang.trang_thai_thanh_toan || !trangThaiHopLe.includes(duLieuDonHang.trang_thai_thanh_toan)) {
            duLieuDonHang.trang_thai_thanh_toan = (duLieuDonHang.hinh_thuc_thanh_toan === 'tien_mat_cod' || duLieuDonHang.hinh_thuc_thanh_toan === 'cod')
                ? 'thanh_toan_khi_nhan_hang'
                : (duLieuDonHang.da_thanh_toan ? 'da_thanh_toan' : 'cho_thanh_toan');
        }

        // Nếu tạo mới đơn hàng với trạng thái 'da_giao' luôn thì trừ kho
        if (duLieuDonHang.trang_thai === 'da_giao') {
            await capNhatTonKhoTheoDonHang(duLieuDonHang.danh_sach_san_pham, 'tru');
            duLieuDonHang.da_tru_ton_kho = true;
        } else {
            duLieuDonHang.da_tru_ton_kho = false;
        }

        // Tạo đơn hàng mới trong MongoDB
        const donHangMoi = new DonHang(duLieuDonHang);
        const ketQua = await donHangMoi.save();

        console.log(`📦 Tạo đơn hàng mới thành công: ${ketQua.ma_don_hang} | Hình thức: ${ketQua.hinh_thuc_thanh_toan} | Trạng thái TT: ${ketQua.trang_thai_thanh_toan}`);
        return res.status(201).json(ketQua);
    } catch (loi) {
        console.error('Lỗi tạo đơn hàng:', loi);
        return res.status(400).json({ thong_diep: 'Không thể tạo đơn hàng mới', chi_tiet: loi.message });
    }
};

// 2. Lấy danh sách tất cả các đơn hàng
const layDanhSachDonHang = async (req, res) => {
    try {
        const { trang_thai, id_nguoi_dung, email, sdt } = req.query;
        const filter = {};

        if (trang_thai && trang_thai !== 'tat_ca') filter.trang_thai = trang_thai;

        if (id_nguoi_dung) {
            const conditions = [{ id_nguoi_dung: id_nguoi_dung }];
            if (email && email.trim()) {
                conditions.push({ 'thong_tin_giao_hang.email': email.trim().toLowerCase() });
            }
            if (sdt && sdt.trim()) {
                conditions.push({ 'thong_tin_giao_hang.so_dien_thoai': sdt.trim() });
            }
            filter.$or = conditions;
        }

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

        // 1. Tìm đơn hàng hiện tại trong MongoDB trước khi cập nhật
        let donHangHienTai = await DonHang.findOne({
            $or: [{ id: id }, { ma_don_hang: id }]
        });
        if (!donHangHienTai && id.match(/^[0-9a-fA-F]{24}$/)) {
            donHangHienTai = await DonHang.findById(id);
        }

        if (!donHangHienTai) {
            return res.status(404).json({ thong_diep: `Không tìm thấy đơn hàng: ${id}` });
        }

        const trangThaiMoi = duLieuCapNhat.trang_thai;
        const danhSachSp = (Array.isArray(duLieuCapNhat.danh_sach_san_pham) && duLieuCapNhat.danh_sach_san_pham.length > 0)
            ? duLieuCapNhat.danh_sach_san_pham
            : donHangHienTai.danh_sach_san_pham || [];

        // 2. Logic trừ / hoàn kho chuẩn xác 2 chiều theo trạng thái
        if (trangThaiMoi) {
            // Case A: Đổi sang "da_giao" (Giao hàng thành công) và đơn hàng chưa từng trừ tồn kho
            if (trangThaiMoi === 'da_giao' && !donHangHienTai.da_tru_ton_kho) {
                await capNhatTonKhoTheoDonHang(danhSachSp, 'tru');
                duLieuCapNhat.da_tru_ton_kho = true;
                if (duLieuCapNhat.da_thanh_toan === undefined) {
                    duLieuCapNhat.da_thanh_toan = true;
                }
            }
            // Case B: Đơn hàng đã từng trừ tồn kho (da_tru_ton_kho === true) nhưng trạng thái mới không còn là "da_giao"
            // (ví dụ: chuyển sang "da_huy", hoặc trả về "dang_giao", "da_xac_nhan", "cho_xac_nhan")
            else if (trangThaiMoi !== 'da_giao' && donHangHienTai.da_tru_ton_kho) {
                await capNhatTonKhoTheoDonHang(danhSachSp, 'hoan');
                duLieuCapNhat.da_tru_ton_kho = false;
            }
        }

        // 3. Cập nhật đơn hàng trong MongoDB
        const donHang = await DonHang.findByIdAndUpdate(
            donHangHienTai._id,
            { $set: duLieuCapNhat },
            { new: true, runValidators: true }
        );

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

        let donHang = await DonHang.findOne({
            $or: [{ id: id }, { ma_don_hang: id }]
        });

        if (!donHang && id.match(/^[0-9a-fA-F]{24}$/)) {
            donHang = await DonHang.findById(id);
        }

        if (!donHang) {
            return res.status(404).json({ thong_diep: `Không tìm thấy đơn hàng để xóa: ${id}` });
        }

        // Nếu đơn hàng này đã từng trừ kho thì hoàn trả lại kho trước khi xóa
        if (donHang.da_tru_ton_kho) {
            await capNhatTonKhoTheoDonHang(donHang.danh_sach_san_pham, 'hoan');
        }

        await DonHang.findByIdAndDelete(donHang._id);

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

