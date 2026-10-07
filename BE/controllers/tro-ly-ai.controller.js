/**
 * LUỒNG 1: Controller Trợ lý AI (MVC Architecture)
 * - Nhiệm vụ: Tiếp nhận request chat từ client, validate dữ liệu, điều phối service RAG và phản hồi.
 * - Hỗ trợ cả 2 phương thức:
 *   + JSON truyền thống (Request-Response đơn)
 *   + NDJSON Streaming (Phản hồi dạng gõ chữ từng từ theo thời gian thực)
 */

const { xuLyTroLyChat } = require('../services/tro-ly-ai.service');
const { layTrangThaiKeyHienTai } = require('../services/gemini-xoay-key.service');
const { layCauHinhNineRouter } = require('../services/nine-router.service');

/**
 * [PHƯƠNG THỨC 1]: Xử lý chat AI dạng JSON đóng gói tiêu chuẩn
 * Endpoint: POST /api/tro-ly-ai/chat
 * Luồng hoạt động:
 *   Bước 1: Trích xuất và kiểm tra tính hợp lệ của câu hỏi (tin_nhan / message).
 *   Bước 2: Chuẩn hóa lịch sử hội thoại (loại bỏ câu hỏi bị trùng lặp ở cuối danh sách).
 *   Bước 3: Gọi tầng Service xử lý nghiệp vụ RAG (truy vấn DB + sinh câu trả lời bằng AI).
 *   Bước 4: Trả về kết quả JSON kèm danh sách thẻ sản phẩm gợi ý phù hợp.
 */
const xuLyChatAI = async (req, res) => {
    try {
        const { tin_nhan, message, lich_su_chat, history } = req.body;
        const cauHoi = tin_nhan || message;

        // BƯỚC 1: Kiểm tra tính hợp lệ của câu hỏi
        if (!cauHoi || typeof cauHoi !== 'string' || !cauHoi.trim()) {
            return res.status(400).json({
                thanh_cong: false,
                thong_diep: 'Vui lòng cung cấp nội dung tin nhắn hợp lệ.'
            });
        }

        // BƯỚC 2: Chuẩn hóa mảng lịch sử chat từ FE gửi lên
        const danhSachLichSu = Array.isArray(lich_su_chat) ? lich_su_chat : Array.isArray(history) ? history : [];
        const lichSuTruocCauHoi = [...danhSachLichSu];
        const tinCuoi = lichSuTruocCauHoi.at(-1);
        // Tránh trùng lặp câu hỏi nếu FE đã push trước vào lịch sử
        if (
            tinCuoi &&
            tinCuoi.role === 'user' &&
            String(tinCuoi.content || tinCuoi.text || '').trim() === cauHoi.trim()
        ) {
            lichSuTruocCauHoi.pop();
        }

        // BƯỚC 3: Chuyển dữ liệu sang tầng Service để xử lý RAG & gọi mô hình ngôn ngữ lớn
        const ketQua = await xuLyTroLyChat({
            tinNhan: cauHoi.trim(),
            lichSuChat: lichSuTruocCauHoi
        });

        // BƯỚC 4: Phản hồi thành công về cho Frontend
        return res.status(200).json({
            thanh_cong: true,
            ...ketQua
        });
    } catch (error) {
        console.error('❌ Lỗi tại Controller Trợ lý AI:', error);
        return res.status(500).json({
            thanh_cong: false,
            thong_diep: 'Đã xảy ra sự cố khi kết nối tới Trợ lý AI.',
            chi_tiet: error.message
        });
    }
};

/**
 * [PHƯƠNG THỨC 2]: Xử lý chat AI dạng Stream NDJSON (Gõ chữ từng từ)
 * Endpoint: POST /api/tro-ly-ai/chat-stream
 * Luồng hoạt động:
 *   Bước 1: Thiết lập Header phản hồi chuẩn NDJSON và tắt bộ đệm (No buffering) để stream tức thời.
 *   Bước 2: Mỗi khi AI sinh ra một đoạn text, hàm callback onText sẽ gửi dòng `{ type: 'text', text }`.
 *   Bước 3: Sau khi sinh text xong, gửi dòng cuối `{ type: 'done', result: ... }` chứa toàn bộ thẻ sản phẩm.
 */
const xuLyChatAIStream = async (req, res) => {
    const { tin_nhan, lich_su_chat } = req.body || {};
    if (typeof tin_nhan !== 'string' || !tin_nhan.trim()) {
        return res.status(400).json({ thanh_cong: false, thong_diep: 'Vui lòng cung cấp nội dung tin nhắn hợp lệ.' });
    }
    const lichSu = Array.isArray(lich_su_chat) ? [...lich_su_chat] : [];
    if (lichSu.at(-1)?.role === 'user' && String(lichSu.at(-1)?.content || '').trim() === tin_nhan.trim()) lichSu.pop();
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();
    try {
        const ketQua = await xuLyTroLyChat({
            tinNhan: tin_nhan.trim(),
            lichSuChat: lichSu,
            onText: (text) => {
                if (!res.destroyed) res.write(JSON.stringify({ type: 'text', text }) + '\n');
            }
        });
        if (!res.destroyed) res.write(JSON.stringify({ type: 'done', result: { thanh_cong: true, ...ketQua } }) + '\n');
    } catch (error) {
        console.error('[Trợ lý AI] Stream lỗi:', error.message);
        if (!res.destroyed)
            res.write(JSON.stringify({ type: 'error', message: 'Không thể kết nối Trợ lý AI.' }) + '\n');
    } finally {
        res.end();
    }
};

/**
 * Endpoint kiểm tra tình trạng hoạt động của các API Key và mô hình AI
 * GET /api/tro-ly-ai/trang-thai
 */
const kiemTraTrangThai = async (req, res) => {
    try {
        const nineRouterConfig = layCauHinhNineRouter();
        const thongTinTrangThai = {
            nhaCungCapUuTien: nineRouterConfig.apiKey ? '9Router' : 'Gemini',
            nineRouter: {
                daCauHinh: Boolean(nineRouterConfig.apiKey),
                model: nineRouterConfig.model
            },
            gemini: layTrangThaiKeyHienTai()
        };
        return res.status(200).json({
            thanh_cong: true,
            du_lieu: thongTinTrangThai
        });
    } catch (error) {
        return res.status(500).json({
            thanh_cong: false,
            thong_diep: 'Không thể lấy thông tin trạng thái Trợ lý AI.',
            chi_tiet: error.message
        });
    }
};

module.exports = {
    xuLyChatAI,
    xuLyChatAIStream,
    kiemTraTrangThai
};
