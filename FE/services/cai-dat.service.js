'use client';

const KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI = 'tntp_cai_dat_khuyen_mai_2026';

export const CAI_DAT_KHUYEN_MAI_MAC_DINH = {
    tieu_de_chinh: 'ĐẠI TIỆC LAPTOP GAMING & AI PC 2026',
    phu_de: 'Săn Deal Khủng Đến 35% - Tặng Balo ROG, Chuột Gaming & Voucher 3 Triệu',
    badge_noi_bat: 'SIÊU KHUYẾN MÃI MÙA TỰU TRƯỜNG & HÈ 2026',
    muc_giam_toi_da: 'GIẢM ĐẾN 35%',
    thoi_gian_ket_thuc: '2026-09-30T23:59:59',
    hinh_anh_banner: '/images/hero_banner_3d.jpg',
    nut_hanh_dong_text: 'Khám Phá Deal Hot Ngay',
    nut_hanh_dong_link: '#san-pham-giam-sau',
    thong_bao_chay: '⚡ BÙNG NỔ ƯU ĐÃI: Giảm ngay 3.000.000đ khi mua ROG Strix G16 & Legion Pro 7i • Trả góp 0% lãi suất xét duyệt 5 phút!'
};

const KHOA_LUU_TRU_SHOWROOM = 'tntp_cai_dat_showroom_2026';

export const DANH_SACH_SHOWROOM_MAC_DINH = [
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
 * Service quản lý Cấu hình Banner, Chiến Dịch Khuyến Mãi & Hệ Thống Showroom Tọa Độ GPS
 */
export const CaiDatService = {
    /**
     * Lấy cấu hình khuyến mãi hiện tại
     */
    layCaiDatKhuyenMai() {
        if (typeof window === 'undefined') {
            return CAI_DAT_KHUYEN_MAI_MAC_DINH;
        }
        try {
            const raw = localStorage.getItem(KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI);
            if (raw) {
                const parsed = JSON.parse(raw);
                return { ...CAI_DAT_KHUYEN_MAI_MAC_DINH, ...parsed };
            }
        } catch (e) {
            console.warn('[CaiDatService] Lỗi đọc cấu hình khuyến mãi:', e);
        }
        return CAI_DAT_KHUYEN_MAI_MAC_DINH;
    },

    /**
     * Cập nhật cấu hình khuyến mãi từ Admin
     */
    luuCaiDatKhuyenMai(duLieuMoi) {
        if (typeof window === 'undefined') return CAI_DAT_KHUYEN_MAI_MAC_DINH;
        try {
            const hienTai = this.layCaiDatKhuyenMai();
            const capNhat = { ...hienTai, ...duLieuMoi };
            localStorage.setItem(KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI, JSON.stringify(capNhat));
            window.dispatchEvent(new CustomEvent('tntp_khuyen_mai_cap_nhat', { detail: capNhat }));
            return capNhat;
        } catch (e) {
            console.error('[CaiDatService] Lỗi lưu cấu hình khuyến mãi:', e);
            return CAI_DAT_KHUYEN_MAI_MAC_DINH;
        }
    },

    /**
     * Khôi phục cấu hình khuyến mãi về mặc định
     */
    khoiPhucMacDinh() {
        if (typeof window === 'undefined') return CAI_DAT_KHUYEN_MAI_MAC_DINH;
        try {
            localStorage.setItem(KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI, JSON.stringify(CAI_DAT_KHUYEN_MAI_MAC_DINH));
            window.dispatchEvent(new CustomEvent('tntp_khuyen_mai_cap_nhat', { detail: CAI_DAT_KHUYEN_MAI_MAC_DINH }));
            return CAI_DAT_KHUYEN_MAI_MAC_DINH;
        } catch (e) {
            return CAI_DAT_KHUYEN_MAI_MAC_DINH;
        }
    },

    /**
     * Lấy danh sách showroom và tọa độ GPS (Ưu tiên API Backend MongoDB, fallback LocalStorage)
     */
    async layDanhSachShowroomAsync() {
        try {
            const res = await fetch('http://localhost:5000/api/cai-dat/showroom');
            if (res.ok) {
                const data = await res.json();
                if (data?.thanh_cong && Array.isArray(data.du_lieu) && data.du_lieu.length > 0) {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem(KHOA_LUU_TRU_SHOWROOM, JSON.stringify(data.du_lieu));
                    }
                    return data.du_lieu;
                }
            }
        } catch (e) {
            console.warn('[CaiDatService] Không thể kết nối API showroom, dùng cục bộ:', e);
        }

        if (typeof window !== 'undefined') {
            try {
                const raw = localStorage.getItem(KHOA_LUU_TRU_SHOWROOM);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                }
            } catch (e) {
                // Ignore
            }
        }

        return DANH_SACH_SHOWROOM_MAC_DINH;
    },

    /**
     * Cập nhật danh sách showroom và tọa độ GPS từ Admin lên MongoDB & LocalStorage
     */
    async luuDanhSachShowroomAsync(danhSachMoi) {
        if (!Array.isArray(danhSachMoi) || danhSachMoi.length === 0) return DANH_SACH_SHOWROOM_MAC_DINH;

        if (typeof window !== 'undefined') {
            localStorage.setItem(KHOA_LUU_TRU_SHOWROOM, JSON.stringify(danhSachMoi));
            window.dispatchEvent(new CustomEvent('tntp_showroom_cap_nhat', { detail: danhSachMoi }));
        }

        try {
            const res = await fetch('http://localhost:5000/api/cai-dat/showroom', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ danh_sach_showroom: danhSachMoi })
            });
            if (res.ok) {
                const data = await res.json();
                return data.du_lieu || danhSachMoi;
            }
        } catch (e) {
            console.error('[CaiDatService] Lỗi lưu showroom lên server:', e);
        }

        return danhSachMoi;
    },

    /**
     * Khôi phục danh sách showroom về mặc định
     */
    async khoiPhucShowroomMacDinhAsync() {
        if (typeof window !== 'undefined') {
            localStorage.setItem(KHOA_LUU_TRU_SHOWROOM, JSON.stringify(DANH_SACH_SHOWROOM_MAC_DINH));
            window.dispatchEvent(new CustomEvent('tntp_showroom_cap_nhat', { detail: DANH_SACH_SHOWROOM_MAC_DINH }));
        }

        try {
            await fetch('http://localhost:5000/api/cai-dat/showroom/khoi-phuc', { method: 'POST' });
        } catch (e) {
            // Ignore
        }

        return DANH_SACH_SHOWROOM_MAC_DINH;
    }
};

export default CaiDatService;
