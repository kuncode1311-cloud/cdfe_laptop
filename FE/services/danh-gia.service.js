import { apiFetch } from './api-client';
import { DANH_SACH_DANH_GIA } from '@/du-lieu/danh-sach-danh-gia';

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
            const fallback = idSanPham ? DANH_SACH_DANH_GIA.filter(d => d.id_san_pham === idSanPham) : DANH_SACH_DANH_GIA;
            const res = await apiFetch(url, { cache: 'default' }, fallback);
            if (Array.isArray(res) && res.length > 0) return res;
            return fallback;
        } catch (loi) {
            console.warn('[DanhGiaService] Lỗi lấy đánh giá sản phẩm:', loi.message);
            return idSanPham ? DANH_SACH_DANH_GIA.filter(d => d.id_san_pham === idSanPham) : DANH_SACH_DANH_GIA;
        }
    },

    /**
     * Lấy toàn bộ đánh giá mới nhất trên toàn hệ thống (Dùng cho Trang Chủ)
     * @returns {Promise<Array>}
     */
    async layTatCaDanhGiaAsync() {
        try {
            const res = await apiFetch('/danh-gia', { cache: 'default' }, DANH_SACH_DANH_GIA);
            if (Array.isArray(res) && res.length > 0) return res;
            return DANH_SACH_DANH_GIA;
        } catch (loi) {
            console.warn('[DanhGiaService] Lỗi lấy tất cả đánh giá:', loi.message);
            return DANH_SACH_DANH_GIA;
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
