const mongoose = require('mongoose');
const SanPham = require('../models/san-pham.model');

/**
 * Xử lý Tồn kho nguyên tử (Atomic Inventory Update)
 * - Dùng `findOneAndUpdate` với điều kiện `{ so_luong_ton_kho: { $gte: soLuong } }` để chống bán vượt tồn kho (oversell).
 * - Rollback: nếu 1 món trong đơn không đủ hàng, tự hoàn trả các món đã trừ trước đó trong cùng lượt gọi.
 * - Hoàn kho ĐÚNG chi nhánh: mỗi item khi trừ kho được gắn `phan_bo_kho` ghi lại đã trừ bao nhiêu từ
 *   chi nhánh nào; khi hoàn kho (hủy đơn, có thể diễn ra nhiều ngày sau) dùng lại thông tin này để
 *   cộng trả đúng chi nhánh, tránh lệch số liệu tồn kho theo chi nhánh qua nhiều vòng đặt/hủy đơn.
 */
const capNhatTonKhoTheoDonHang = async (danhSachSanPham, thaoTac = 'tru') => {
    if (!Array.isArray(danhSachSanPham) || danhSachSanPham.length === 0) {
        return { thanh_cong: true };
    }

    const daThaoTacThanhCong = [];

    for (const item of danhSachSanPham) {
        try {
            const soLuong = Math.max(1, Number(item.so_luong) || 1);
            const spId =
                item.san_pham_id ||
                item.san_pham?.id ||
                item.san_pham?._id ||
                item.san_pham?.ma_san_pham ||
                item.id_muc ||
                (typeof item.san_pham === 'string' ? item.san_pham : null);

            if (!spId && !item.ten_san_pham) continue;

            const candidateIds = new Set();
            if (spId) {
                const strId = String(spId).trim();
                candidateIds.add(strId);
                if (strId.includes('-')) {
                    const stripped = strId.replace(/-[^-]+$/, '');
                    if (stripped) candidateIds.add(stripped);
                }
            }

            const orConditions = [];
            for (const cand of candidateIds) {
                orConditions.push({ id: cand });
                orConditions.push({ ma_san_pham: cand });
                orConditions.push({ slug: cand });
                if (mongoose.Types.ObjectId.isValid(cand)) {
                    orConditions.push({ _id: cand });
                }
            }

            let sp = orConditions.length > 0 ? await SanPham.findOne({ $or: orConditions }) : null;

            if (!sp && item.ten_san_pham) {
                sp = await SanPham.findOne({ ten_san_pham: item.ten_san_pham.trim() });
            }

            if (!sp) {
                console.warn(
                    `⚠️ [Kho] Không tìm thấy sản phẩm trong DB để cập nhật tồn kho:`,
                    spId || item.ten_san_pham
                );
                if (thaoTac === 'tru') {
                    await capNhatTonKhoTheoDonHang(daThaoTacThanhCong, 'hoan');
                    return {
                        thanh_cong: false,
                        loi: `Không tìm thấy thông tin sản phẩm "${item.ten_san_pham || spId}" trong kho hàng.`
                    };
                }
                continue;
            }

            if (thaoTac === 'tru') {
                const spDaTru = await SanPham.findOneAndUpdate(
                    { _id: sp._id, so_luong_ton_kho: { $gte: soLuong } },
                    { $inc: { so_luong_ton_kho: -soLuong, so_luong_da_ban: soLuong } },
                    { returnDocument: 'after' }
                );

                if (!spDaTru) {
                    await capNhatTonKhoTheoDonHang(daThaoTacThanhCong, 'hoan');
                    return {
                        thanh_cong: false,
                        loi: `Sản phẩm "${sp.ten_san_pham}" chỉ còn ${sp.so_luong_ton_kho || 0} sản phẩm trong kho, không đủ số lượng ${soLuong} bạn yêu cầu.`
                    };
                }

                if (spDaTru.so_luong_ton_kho <= 0) {
                    spDaTru.con_hang = false;
                }

                const phanBoKho = [];
                if (Array.isArray(spDaTru.ton_kho) && spDaTru.ton_kho.length > 0) {
                    let conLai = soLuong;
                    for (const cn of spDaTru.ton_kho) {
                        if (conLai <= 0) break;
                        const sl = Number(cn.so_luong_con) || 0;
                        if (sl > 0) {
                            const tru = Math.min(sl, conLai);
                            cn.so_luong_con = sl - tru;
                            conLai -= tru;
                            phanBoKho.push({ ten_chi_nhanh: cn.ten_chi_nhanh || '', so_luong: tru });
                        }
                    }
                }

                await spDaTru.save();

                if (phanBoKho.length > 0) {
                    item.phan_bo_kho = phanBoKho;
                }

                daThaoTacThanhCong.push({
                    san_pham_id: sp._id,
                    so_luong: soLuong,
                    ten_san_pham: sp.ten_san_pham,
                    phan_bo_kho: phanBoKho
                });

                console.log(
                    `📦 [Kho] ĐÃ TRỪ TỒN KHO NGUYÊN TỬ: "${spDaTru.ten_san_pham}" (-${soLuong}) | Còn lại: ${spDaTru.so_luong_ton_kho} | Đã bán: ${spDaTru.so_luong_da_ban}`
                );
            } else if (thaoTac === 'hoan') {
                const spDaHoan = await SanPham.findByIdAndUpdate(
                    sp._id,
                    { $inc: { so_luong_ton_kho: soLuong } },
                    { returnDocument: 'after' }
                );

                if (spDaHoan) {
                    spDaHoan.so_luong_da_ban = Math.max(0, (Number(spDaHoan.so_luong_da_ban) || 0) - soLuong);
                    if (spDaHoan.so_luong_ton_kho > 0) {
                        spDaHoan.con_hang = true;
                    }

                    const phanBoDaGhi = Array.isArray(item.phan_bo_kho) ? item.phan_bo_kho : null;
                    if (Array.isArray(spDaHoan.ton_kho) && spDaHoan.ton_kho.length > 0) {
                        if (phanBoDaGhi && phanBoDaGhi.length > 0) {
                            let conLaiChuaHoan = soLuong;
                            for (const phanBo of phanBoDaGhi) {
                                const cn = spDaHoan.ton_kho.find((x) => x.ten_chi_nhanh === phanBo.ten_chi_nhanh);
                                const soHoan = Math.min(Number(phanBo.so_luong) || 0, conLaiChuaHoan);
                                if (cn && soHoan > 0) {
                                    cn.so_luong_con = (Number(cn.so_luong_con) || 0) + soHoan;
                                    conLaiChuaHoan -= soHoan;
                                }
                            }
                            if (conLaiChuaHoan > 0) {
                                spDaHoan.ton_kho[0].so_luong_con =
                                    (Number(spDaHoan.ton_kho[0].so_luong_con) || 0) + conLaiChuaHoan;
                            }
                        } else {
                            spDaHoan.ton_kho[0].so_luong_con =
                                (Number(spDaHoan.ton_kho[0].so_luong_con) || 0) + soLuong;
                        }
                    }

                    await spDaHoan.save();
                    console.log(
                        `↩️ [Kho] ĐÃ HOÀN TỒN KHO: "${spDaHoan.ten_san_pham}" (+${soLuong}) | Tồn kho mới: ${spDaHoan.so_luong_ton_kho} | Đã bán: ${spDaHoan.so_luong_da_ban}`
                    );
                }
            }
        } catch (err) {
            console.error(`❌ [Kho] Lỗi cập nhật tồn kho cho item:`, item?.ten_san_pham || item?.san_pham_id, err);
            if (thaoTac === 'tru') {
                await capNhatTonKhoTheoDonHang(daThaoTacThanhCong, 'hoan');
                return { thanh_cong: false, loi: err.message };
            }
        }
    }

    return { thanh_cong: true };
};

module.exports = { capNhatTonKhoTheoDonHang };
