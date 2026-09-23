/**
 * Chú thích file: Dịch vụ Trợ lý AI kết nối Backend và cung cấp phản hồi thông minh cho giao diện người dùng.
 * Hỗ trợ lấy câu trả lời tư vấn và danh sách Thẻ Sản Phẩm (Product Card) tương tác.
 */

import { apiFetch } from './api-client';

export const TroLyAiService = {
    /**
     * Gửi câu hỏi của khách hàng lên Trợ lý AI
     * @param {string} tinNhan - Nội dung câu hỏi của khách hàng
     * @param {Array} [lichSuChat] - Lịch sử hội thoại trước đó
     * @returns {Promise<Object>} Đối tượng kết quả gồm câu trả lời, sản phẩm gợi ý và câu hỏi tiếp theo
     */
    async guiTinNhan(tinNhan, lichSuChat = []) {
        if (!tinNhan || !tinNhan.trim()) {
            throw new Error('Vui lòng nhập nội dung tin nhắn.');
        }

        try {
            const res = await apiFetch('/tro-ly-ai/chat', {
                method: 'POST',
                body: JSON.stringify({
                    tin_nhan: tinNhan.trim(),
                    lich_su_chat: lichSuChat
                }),
                timeoutMs: 28000
            });

            return res;
        } catch (error) {
            console.error('❌ Lỗi khi gửi tin nhắn tới Trợ lý AI:', error);
            throw error;
        }
    },

    /**
     * Lấy thông tin trạng thái hoạt động của hệ thống AI
     */
    async layTrangThai() {
        try {
            return await apiFetch('/tro-ly-ai/trang-thai', { timeoutMs: 5000 });
        } catch {
            return { thanh_cong: true, trang_thai: 'san_sang' };
        }
    }
};
