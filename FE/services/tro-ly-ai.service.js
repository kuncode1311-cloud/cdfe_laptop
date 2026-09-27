/**
 * Chú thích file: Dịch vụ Trợ lý AI kết nối Backend và cung cấp phản hồi thông minh cho giao diện người dùng.
 * Hỗ trợ lấy câu trả lời tư vấn và danh sách Thẻ Sản Phẩm (Product Card) tương tác.
 */

import { apiFetch, layApiBaseUrl } from './api-client';

function inThongTinKetNoiConsole(thongTin) {
    if (!thongTin || typeof window === 'undefined') return;
    const provider = thongTin.provider || '9Router';
    const model = thongTin.model || 'ag/gemini-3.7-flash-low';
    const keyMask = thongTin.key_mask || 'N/A';
    const timeAi = thongTin.thoi_gian_ai_ms || 0;
    const timeTotal = thongTin.thoi_gian_tong_ms || timeAi;

    console.log(
        `%c🤖 [Trợ lý AI TNTP] %c${provider}%c | Model: %c${model}%c | Key: %c${keyMask}%c | Thời gian: %c${timeAi}ms`,
        'background: #1e1b4b; color: #38bdf8; font-weight: bold; padding: 4px 6px; border-radius: 4px 0 0 4px;',
        'background: #0284c7; color: #ffffff; font-weight: bold; padding: 4px 6px;',
        'background: #0f172a; color: #94a3b8; padding: 4px 6px;',
        'background: #0f172a; color: #a855f7; font-weight: bold; padding: 4px 6px;',
        'background: #0f172a; color: #94a3b8; padding: 4px 6px;',
        'background: #0f172a; color: #f59e0b; font-weight: bold; padding: 4px 6px;',
        'background: #0f172a; color: #94a3b8; padding: 4px 6px;',
        'background: #065f46; color: #34d399; font-weight: bold; padding: 4px 6px; border-radius: 0 4px 4px 0;'
    );
    console.table([{
        'Nhà cung cấp': provider,
        'Mô hình (Model)': model,
        'API Key': keyMask,
        'Thời gian AI': `${timeAi}ms`,
        'Tổng thời gian': `${timeTotal}ms`
    }]);
}

export const TroLyAiService = {
    async guiTinNhanStream(tinNhan, lichSuChat = [], onText = () => {}) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 35000);
        try {
            const response = await fetch(`${layApiBaseUrl()}/tro-ly-ai/chat/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tin_nhan: tinNhan.trim(), lich_su_chat: lichSuChat }),
                signal: controller.signal
            });
            if (!response.ok || !response.body) throw new Error(`Chat HTTP ${response.status}`);
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let result;
            while (true) {
                const { value, done } = await reader.read();
                buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
                const lines = buffer.split('\n');
                buffer = lines.pop();
                for (const line of lines) {
                    if (!line.trim()) continue;
                    const event = JSON.parse(line);
                    if (event.type === 'text') onText(event.text);
                    if (event.type === 'done') {
                        result = event.result;
                        if (result?.thong_tin_ket_noi) {
                            inThongTinKetNoiConsole(result.thong_tin_ket_noi);
                        }
                    }
                    if (event.type === 'error') throw new Error(event.message);
                }
                if (done) break;
            }
            if (!result) throw new Error('Phản hồi chat chưa hoàn tất');
            return result;
        } finally {
            clearTimeout(timeout);
        }
    },
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

            if (res?.thong_tin_ket_noi) {
                inThongTinKetNoiConsole(res.thong_tin_ket_noi);
            }
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
