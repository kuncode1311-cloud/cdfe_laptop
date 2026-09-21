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

/**
 * Service quản lý Cấu hình Banner & Chiến Dịch Khuyến Mãi động
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
            // Phát sự kiện custom event để các component đang mở tự động re-render
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
    }
};

export default CaiDatService;
