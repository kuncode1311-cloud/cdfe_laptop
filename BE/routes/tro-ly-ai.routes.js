/**
 * Chú thích file: Định tuyến Tuyến đường (Routes) cho Trợ lý Chatbot AI.
 * Chuẩn MVC Backend Express.js.
 */

const express = require('express');
const router = express.Router();
const troLyAiController = require('../controllers/tro-ly-ai.controller');
const { gioiHanRequest } = require('../middleware/gioi-han-request.middleware');

const gioiHanChatAi = gioiHanRequest({ windowMs: 60 * 1000, max: 12, message: 'Bạn gửi tin nhắn AI quá nhanh. Vui lòng thử lại sau.' });
const gioiHanTrangThaiAi = gioiHanRequest({ windowMs: 60 * 1000, max: 30 });

// 1. Gửi tin nhắn trò chuyện với Trợ lý AI (Hỗ trợ cả /chat và /)
router.post('/chat', gioiHanChatAi, troLyAiController.xuLyChatAI);
router.post('/chat/stream', gioiHanChatAi, troLyAiController.xuLyChatAIStream);
router.post('/', gioiHanChatAi, troLyAiController.xuLyChatAI);

// 2. Giám sát trạng thái hoạt động của các API Keys và Models
router.get('/trang-thai', gioiHanTrangThaiAi, troLyAiController.kiemTraTrangThai);

module.exports = router;
