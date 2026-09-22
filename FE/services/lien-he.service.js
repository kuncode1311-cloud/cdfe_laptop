import { apiFetch } from '@/services/api-client';

const KHOA_LUU_TRU_LIEN_HE = 'tntp_danh_sach_lien_he_cuc_bo';

/**
 * Service xử lý liên hệ & tư vấn khách hàng kết nối Backend Express.js & MongoDB
 */
export const LienHeService = {
    /**
     * Gửi yêu cầu tư vấn mới lên hệ thống
     * @param {Object} duLieu - { ho_ten, so_dien_thoai, email, chu_de, noi_dung }
     */
    async guiYeuCauLienHeAsync(duLieu) {
        try {
            const ketQua = await apiFetch('/lien-he', {
                method: 'POST',
                body: JSON.stringify(duLieu)
            });

            // Lưu bản sao vào LocalStorage để khách hàng tiện theo dõi lại phiếu
            if (typeof window !== 'undefined' && ketQua?.du_lieu) {
                try {
                    const danhSachHienTai = JSON.parse(localStorage.getItem(KHOA_LUU_TRU_LIEN_HE) || '[]');
                    danhSachHienTai.unshift(ketQua.du_lieu);
                    localStorage.setItem(KHOA_LUU_TRU_LIEN_HE, JSON.stringify(danhSachHienTai.slice(0, 10)));
                } catch (e) {
                    console.warn('[LienHeService] Không thể lưu bản sao cục bộ:', e);
                }
            }

            return ketQua;
        } catch (loi) {
            console.error('[LienHeService] Gửi yêu cầu liên hệ thất bại:', loi);
            throw loi;
        }
    },

    /**
     * Lấy danh sách các yêu cầu liên hệ đã gửi gần đây của khách trên trình duyệt này
     */
    layLichSuLienHeCucBo() {
        if (typeof window === 'undefined') return [];
        try {
            return JSON.parse(localStorage.getItem(KHOA_LUU_TRU_LIEN_HE) || '[]');
        } catch (e) {
            return [];
        }
    }
};

export default LienHeService;
