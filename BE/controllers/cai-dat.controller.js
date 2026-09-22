const CaiDat = require('../models/cai-dat.model');

const DANH_SACH_SHOWROOM_MAC_DINH = [
    {
        id: 'hcm-q10',
        ten: 'Showroom Quận 10 (Trụ Sở Chính)',
        dia_chi: 'Số 29 Tân Phước, Phường 8, Quận 10, TP. Hồ Chí Minh',
        hotline: '1900.8946 (Phím 1)',
        hotline_di_dong: '0948.37.79.79',
        gio_mo_cua: '08:30 - 21:30 (Mở cả tuần)',
        vi_do: 10.760086,
        kinh_do: 106.663185,
        la_mac_dinh: true
    },
    {
        id: 'hcm-tan-phu',
        ten: 'Showroom Tân Phú - ITC (Trường CĐ Công Nghệ Thông Tin TP.HCM)',
        dia_chi: 'Số 12 Trịnh Đình Thảo, Phường Hòa Thạnh, Quận Tân Phú, TP. Hồ Chí Minh',
        hotline: '1900.8946 (Phím 2)',
        hotline_di_dong: '0922.37.79.79',
        gio_mo_cua: '08:00 - 21:30 (Mở cả tuần)',
        vi_do: 10.775093,
        kinh_do: 106.634544,
        la_mac_dinh: false
    },
    {
        id: 'hn-cau-giay',
        ten: 'Showroom Cầu Giấy, Hà Nội',
        dia_chi: 'Số 120 Trần Thái Tông, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
        hotline: '1900.8946 (Phím 3)',
        hotline_di_dong: '0911.37.79.79',
        gio_mo_cua: '08:30 - 21:00 (Tất cả các ngày)',
        vi_do: 21.031345,
        kinh_do: 105.787123,
        la_mac_dinh: false
    }
];

/**
 * Lấy danh sách showroom và tọa độ GPS
 * GET /api/cai-dat/showroom
 */
exports.layCaiDatShowroom = async (req, res) => {
    try {
        let caiDat = await CaiDat.findOne({ khoa: 'he_thong' });

        if (!caiDat || !caiDat.danh_sach_showroom || caiDat.danh_sach_showroom.length === 0) {
            if (!caiDat) {
                caiDat = await CaiDat.create({
                    khoa: 'he_thong',
                    danh_sach_showroom: DANH_SACH_SHOWROOM_MAC_DINH
                });
            } else {
                caiDat.danh_sach_showroom = DANH_SACH_SHOWROOM_MAC_DINH;
                await caiDat.save();
            }
        }

        return res.status(200).json({
            thanh_cong: true,
            du_lieu: caiDat.danh_sach_showroom
        });
    } catch (loi) {
        console.error('[LỖI LẤY CÀI ĐẶT SHOWROOM]:', loi);
        return res.status(200).json({
            thanh_cong: true,
            du_lieu: DANH_SACH_SHOWROOM_MAC_DINH
        });
    }
};

/**
 * Cập nhật danh sách showroom và tọa độ GPS từ Admin
 * PUT /api/cai-dat/showroom
 */
exports.capNhatCaiDatShowroom = async (req, res) => {
    try {
        const { danh_sach_showroom } = req.body;

        if (!Array.isArray(danh_sach_showroom) || danh_sach_showroom.length === 0) {
            return res.status(400).json({
                thanh_cong: false,
                thong_diep: 'Danh sách showroom không hợp lệ hoặc rỗng'
            });
        }

        // Chuẩn hóa và validate dữ liệu
        const danhSachChuan = danh_sach_showroom.map((sr, index) => ({
            id: sr.id || `sr-${Date.now()}-${index}`,
            ten: (sr.ten || `Showroom ${index + 1}`).trim(),
            dia_chi: (sr.dia_chi || '').trim(),
            hotline: (sr.hotline || '1900.8946').trim(),
            hotline_di_dong: (sr.hotline_di_dong || '0948.37.79.79').trim(),
            gio_mo_cua: (sr.gio_mo_cua || '08:30 - 21:30').trim(),
            vi_do: Number(sr.vi_do) || 10.7601,
            kinh_do: Number(sr.kinh_do) || 106.6632,
            la_mac_dinh: Boolean(sr.la_mac_dinh)
        }));

        const caiDat = await CaiDat.findOneAndUpdate(
            { khoa: 'he_thong' },
            {
                $set: {
                    danh_sach_showroom: danhSachChuan,
                    ngay_cap_nhat: new Date()
                }
            },
            { new: true, upsert: true }
        );

        console.log(`[CÀI ĐẶT] Đã cập nhật ${danhSachChuan.length} showroom cùng tọa độ GPS`);

        return res.status(200).json({
            thanh_cong: true,
            thong_diep: 'Cập nhật danh sách showroom và tọa độ GPS thành công!',
            du_lieu: caiDat.danh_sach_showroom
        });
    } catch (loi) {
        console.error('[LỖI CẬP NHẬT CÀI ĐẶT SHOWROOM]:', loi);
        return res.status(500).json({
            thanh_cong: false,
            thong_diep: 'Không thể lưu cài đặt showroom. Vui lòng thử lại!'
        });
    }
};

/**
 * Khôi phục danh sách showroom về mặc định
 * POST /api/cai-dat/showroom/khoi-phuc
 */
exports.khoiPhucShowroomMacDinh = async (req, res) => {
    try {
        const caiDat = await CaiDat.findOneAndUpdate(
            { khoa: 'he_thong' },
            {
                $set: {
                    danh_sach_showroom: DANH_SACH_SHOWROOM_MAC_DINH,
                    ngay_cap_nhat: new Date()
                }
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            thanh_cong: true,
            thong_diep: 'Đã khôi phục 3 showroom mặc định thành công!',
            du_lieu: caiDat.danh_sach_showroom
        });
    } catch (loi) {
        return res.status(500).json({
            thanh_cong: false,
            thong_diep: 'Lỗi khi khôi phục showroom mặc định'
        });
    }
};
