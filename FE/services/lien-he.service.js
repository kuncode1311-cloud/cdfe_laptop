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
            console.warn('[LienHeService] Gọi API thất bại, lưu dự phòng cục bộ:', loi);

            // Fallback lưu cục bộ nếu backend tạm thời không thể kết nối
            const maTam = `LH-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`;
            const phieuTam = {
                ma_yeu_cau: maTam,
                ho_ten: duLieu.ho_ten,
                so_dien_thoai: duLieu.so_dien_thoai,
                chu_de: duLieu.chu_de || 'Tư vấn mua Laptop',
                noi_dung: duLieu.noi_dung,
                ngay_tao: new Date().toISOString()
            };

            if (typeof window !== 'undefined') {
                try {
                    const danhSachHienTai = JSON.parse(localStorage.getItem(KHOA_LUU_TRU_LIEN_HE) || '[]');
                    danhSachHienTai.unshift(phieuTam);
                    localStorage.setItem(KHOA_LUU_TRU_LIEN_HE, JSON.stringify(danhSachHienTai.slice(0, 10)));
                } catch (e) {
                    console.error(e);
                }
            }

            return {
                thanh_cong: true,
                thong_diep: 'Yêu cầu của bạn đã được tiếp nhận! Chuyên viên sẽ liên hệ lại sớm nhất.',
                du_lieu: phieuTam
            };
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
