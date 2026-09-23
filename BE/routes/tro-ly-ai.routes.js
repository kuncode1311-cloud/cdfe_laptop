/**
 * Chú thích file: Định tuyến Tuyến đường (Routes) cho Trợ lý Chatbot AI.
 * Chuẩn MVC Backend Express.js.
 */

const express = require('express');
const router = express.Router();
const troLyAiController = require('../controllers/tro-ly-ai.controller');

// 1. Gửi tin nhắn trò chuyện với Trợ lý AI (Hỗ trợ cả /chat và /)
router.post('/chat', troLyAiController.xuLyChatAI);
router.post('/', troLyAiController.xuLyChatAI);

// 2. Giám sát trạng thái hoạt động của các API Keys và Models
router.get('/trang-thai', troLyAiController.kiemTraTrangThai);

module.exports = router;
