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

        const ketQua = await xuLyTroLyChat({
            tinNhan: cauHoi.trim(),
            lichSuChat: danhSachLichSu
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
    kiemTraTrangThai
};
