/**
 * Chú thích file: Controller xử lý các yêu cầu Chatbot AI tư vấn và kiểm tra trạng thái xoay key.
 * Chuẩn MVC Backend Express.js.
 */

const { xuLyTroLyChat } = require('../services/tro-ly-ai.service');
const { layTrangThaiKeyHienTai } = require('../services/gemini-xoay-key.service');
const { layCauHinhNineRouter } = require('../services/nine-router.service');

/**
 * Endpoint tiếp nhận câu hỏi và trả lời bằng 9Router, dự phòng Gemini (RAG)
 * POST /api/tro-ly-ai/chat
 */
const xuLyChatAI = async (req, res) => {
    try {
        const { tin_nhan, message, lich_su_chat, history } = req.body;
        const cauHoi = tin_nhan || message;

        if (!cauHoi || typeof cauHoi !== 'string' || !cauHoi.trim()) {
            return res.status(400).json({
                thanh_cong: false,
                thong_diep: 'Vui lòng cung cấp nội dung tin nhắn hợp lệ.'
            });
        }

        const danhSachLichSu = Array.isArray(lich_su_chat) 
            ? lich_su_chat 
            : (Array.isArray(history) ? history : []);
        // FE có thể đã thêm câu hỏi hiện tại vào lịch sử; chỉ gửi nó một lần tới model.
        const lichSuTruocCauHoi = [...danhSachLichSu];
        const tinCuoi = lichSuTruocCauHoi.at(-1);
        if (tinCuoi && tinCuoi.role === 'user' &&
            String(tinCuoi.content || tinCuoi.text || '').trim() === cauHoi.trim()) {
            lichSuTruocCauHoi.pop();
        }

        const ketQua = await xuLyTroLyChat({
            tinNhan: cauHoi.trim(),
            lichSuChat: lichSuTruocCauHoi
        });

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

// NDJSON: các dòng text đang sinh, sau cùng là kết quả đầy đủ có thẻ sản phẩm.
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
            onText: text => { if (!res.destroyed) res.write(JSON.stringify({ type: 'text', text }) + '\n'); }
        });
        if (!res.destroyed) res.write(JSON.stringify({ type: 'done', result: { thanh_cong: true, ...ketQua } }) + '\n');
    } catch (error) {
        console.error('[Trợ lý AI] Stream lỗi:', error.message);
        if (!res.destroyed) res.write(JSON.stringify({ type: 'error', message: 'Không thể kết nối Trợ lý AI.' }) + '\n');
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
