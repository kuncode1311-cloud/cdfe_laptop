import { apiFetch } from './api-client';

/**
 * Service xử lý Đánh Giá & Nhận Xét của Khách Hàng kết nối RESTful API MongoDB Atlas
 */
export const DanhGiaService = {
    /**
     * Lấy danh sách đánh giá theo ID sản phẩm hoặc lấy tất cả (Async)
     * @param {string} [idSanPham] - Mã sản phẩm (tùy chọn)
     * @returns {Promise<Array>} Danh sách đánh giá
     */
    async layDanhGiaTheoSanPhamAsync(idSanPham) {
        try {
            const url = idSanPham ? `/danh-gia?id_san_pham=${encodeURIComponent(idSanPham)}` : '/danh-gia';
            const res = await apiFetch(url, { cache: 'no-store' }, []);
            return Array.isArray(res) ? res : [];
        } catch (loi) {
            console.warn('[DanhGiaService] Lỗi lấy đánh giá sản phẩm:', loi.message);
            return [];
        }
    },

    /**
     * Lấy toàn bộ đánh giá mới nhất trên toàn hệ thống (Dùng cho Trang Chủ)
     * @returns {Promise<Array>}
     */
    async layTatCaDanhGiaAsync() {
        try {
            const res = await apiFetch('/danh-gia', { cache: 'no-store' }, []);
            return Array.isArray(res) ? res : [];
        } catch (loi) {
            console.warn('[DanhGiaService] Lỗi lấy tất cả đánh giá:', loi.message);
            return [];
        }
    },

    /**
     * Gửi đánh giá / nhận xét mới của khách hàng lên Database
     * @param {Object} duLieu - Thông tin đánh giá (id_san_pham, tenKhach, soSao, noiDung, ...)
     * @returns {Promise<Object>}
     */
    async themDanhGiaMoiAsync(duLieu) {
        return await apiFetch('/danh-gia', {
            method: 'POST',
            body: JSON.stringify(duLieu)
        });
    }
};

export default DanhGiaService;
