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
            const res = await apiFetch(url, { cache: 'default' });
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
            const res = await apiFetch('/danh-gia', { cache: 'default' });
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
    },

    /**
     * [ADMIN] Lấy toàn bộ đánh giá (kể cả đã ẩn) để quản trị, kiểm duyệt
     * @returns {Promise<Array>}
     */
    async layDanhGiaChoAdminAsync() {
        try {
            const res = await apiFetch('/danh-gia/quan-tri/tat-ca');
            return Array.isArray(res) ? res : [];
        } catch (loi) {
            console.warn('[DanhGiaService] Lỗi lấy đánh giá cho admin:', loi.message);
            return [];
        }
    },

    /**
     * [ADMIN] Ẩn/hiện một đánh giá trên trang sản phẩm
     * @param {string} id - Mã đánh giá
     * @param {boolean} hienThi - true: hiện, false: ẩn
     */
    async anHienDanhGiaAsync(id, hienThi) {
        return await apiFetch(`/danh-gia/${id}/an-hien`, {
            method: 'PATCH',
            body: JSON.stringify({ hien_thi: hienThi })
        });
    },

    /**
     * [ADMIN] Xóa vĩnh viễn một đánh giá
     * @param {string} id - Mã đánh giá
     */
    async xoaDanhGiaAsync(id) {
        return await apiFetch(`/danh-gia/${id}`, { method: 'DELETE' });
    }
};

export default DanhGiaService;
