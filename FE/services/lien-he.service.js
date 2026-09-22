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

                // Phát tín hiệu Realtime tức thì cho Admin (Cross-tab qua BroadcastChannel & Storage Event)
                this.phatTinHieuRealtime('YEU_CAU_MOI', ketQua.du_lieu);
            }

            return ketQua;
        } catch (loi) {
            console.error('[LienHeService] Gửi yêu cầu liên hệ thất bại:', loi);
            throw loi;
        }
    },

    /**
     * Phát tín hiệu Realtime cho tất cả các tab khác
     */
    phatTinHieuRealtime(loai, duLieu) {
        if (typeof window === 'undefined') return;
        try {
            const payload = {
                loai,
                du_lieu: duLieu,
                thoi_gian: Date.now()
            };

            // 1. BroadcastChannel API (Độ trễ < 10ms giữa các tabs)
            if ('BroadcastChannel' in window) {
                const bc = new BroadcastChannel('tntp_kenh_cskh_lien_he');
                bc.postMessage(payload);
                bc.close();
            }

            // 2. Storage event (Tương thích 100% mọi trình duyệt khi mở nhiều tab)
            localStorage.setItem('tntp_realtime_lien_he_sync', JSON.stringify(payload));

            // 3. CustomEvent cho cùng tab
            window.dispatchEvent(new CustomEvent('tntp_realtime_lien_he_local', { detail: payload }));
        } catch (e) {
            console.warn('[LienHeService] Không thể phát tín hiệu realtime:', e);
        }
    },

    /**
     * Đăng ký lắng nghe sự kiện Realtime tư vấn & CSKH
     * @param {Function} onEvent - callback nhận { loai, du_lieu, thoi_gian }
     * @returns {Function} cleanup function hủy lắng nghe
     */
    langNgheRealtime(onEvent) {
        if (typeof window === 'undefined') return () => {};

        let bc = null;
        if ('BroadcastChannel' in window) {
            try {
                bc = new BroadcastChannel('tntp_kenh_cskh_lien_he');
                bc.onmessage = (event) => {
                    if (event.data) onEvent(event.data);
                };
            } catch (e) {
                console.warn('[LienHeService] Không thể mở BroadcastChannel:', e);
            }
        }

        const handleStorage = (event) => {
            if (event.key === 'tntp_realtime_lien_he_sync' && event.newValue) {
                try {
                    const parsed = JSON.parse(event.newValue);
                    onEvent(parsed);
                } catch (e) {}
            }
        };

        const handleLocal = (event) => {
            if (event.detail) onEvent(event.detail);
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('tntp_realtime_lien_he_local', handleLocal);

        return () => {
            if (bc) {
                bc.close();
            }
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('tntp_realtime_lien_he_local', handleLocal);
        };
    },

    /**
     * Lấy danh sách yêu cầu tư vấn & liên hệ từ Backend Express.js (Admin)
     */
    async layDanhSachLienHeAsync(params = {}) {
        try {
            const query = new URLSearchParams();
            if (params.trang) query.append('trang', params.trang);
            if (params.gioi_han) query.append('gioi_han', params.gioi_han);
            if (params.trang_thai) query.append('trang_thai', params.trang_thai);
            if (params.chu_de) query.append('chu_de', params.chu_de);
            if (params.tu_khoa) query.append('tu_khoa', params.tu_khoa);

            const queryString = query.toString() ? `?${query.toString()}` : '';
            return await apiFetch(`/lien-he${queryString}`, {
                cache: 'no-store'
            });
        } catch (loi) {
            console.error('[LienHeService] Lỗi lấy danh sách liên hệ:', loi);
            throw loi;
        }
    },

    /**
     * Cập nhật trạng thái hoặc ghi chú phiếu tư vấn (Admin)
     */
    async capNhatLienHeAsync(id, duLieu) {
        try {
            return await apiFetch(`/lien-he/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(duLieu)
            });
        } catch (loi) {
            console.error('[LienHeService] Lỗi cập nhật phiếu liên hệ:', loi);
            throw loi;
        }
    },

    /**
     * Xóa phiếu liên hệ (Admin)
     */
    async xoaLienHeAsync(id) {
        try {
            return await apiFetch(`/lien-he/${id}`, {
                method: 'DELETE'
            });
        } catch (loi) {
            console.error('[LienHeService] Lỗi xóa phiếu liên hệ:', loi);
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
