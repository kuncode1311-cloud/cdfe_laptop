'use client';

import { apiFetch } from './api-client';

/**
 * Danh sách Yêu thích theo tài khoản (chỉ dùng khi đã đăng nhập). Server là nguồn thật duy nhất,
 * trả về đầy đủ object sản phẩm (không chỉ id), đã sắp theo thứ tự mới thêm trước.
 */
export const YeuThichService = {
    /** Lấy danh sách sản phẩm yêu thích đầy đủ từ server. */
    async layYeuThichAsync() {
        try {
            const res = await apiFetch('/yeu-thich', { cache: 'no-store' });
            return Array.isArray(res) ? res : [];
        } catch (loi) {
            console.warn('[YeuThichService] Lỗi lấy danh sách yêu thích:', loi.message);
            return [];
        }
    },

    /** Thêm 1 sản phẩm vào yêu thích (idempotent). */
    async themYeuThichAsync(idSanPham) {
        return await apiFetch('/yeu-thich', {
            method: 'POST',
            body: JSON.stringify({ id_san_pham: idSanPham })
        });
    },

    /** Bỏ 1 sản phẩm khỏi yêu thích. */
    async xoaYeuThichAsync(idSanPham) {
        return await apiFetch(`/yeu-thich/${encodeURIComponent(idSanPham)}`, { method: 'DELETE' });
    }
};

export default YeuThichService;
