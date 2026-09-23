/**
 * Chú thích file: Cấu hình dịch vụ Gemini AI Studio và danh sách mô hình ưu tiên.
 * Hỗ trợ xoay vòng nhiều API Key tự động khi gặp giới hạn hạn ngạch (429/403).
 */
const dotenv = require('dotenv');
dotenv.config();

// Đọc danh sách API key từ biến môi trường (phân cách bởi dấu phẩy)
const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || '';
const danhSachApiKeys = rawKeys
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);

module.exports = {
    // Danh sách API key được chuẩn hóa
    apiKeys: danhSachApiKeys,

    // Thứ tự ưu tiên mô hình AI (Model chốt chuẩn và ổn định của Google AI Studio)
    danhSachModelUuTien: [
        'gemini-2.5-flash',       // Tốc độ cao, suy luận logic tốt nhất
        'gemini-2.0-flash',       // Mô hình thế hệ mới ổn định
        'gemini-1.5-flash',       // Mô hình phổ thông tương thích cực rộng
        'gemini-2.5-flash-lite'   // Mô hình dự phòng nhẹ và tiết kiệm token
    ],

    // Cấu hình sinh nội dung mặc định
    cauHinhMacDinh: {
        temperature: 0.35,          // Độ sáng tạo vừa phải, đảm bảo tính chuẩn xác
        maxOutputTokens: 2048,      // Độ dài tối đa phản hồi không lo bị ngắt quãng
        topP: 0.95,
        topK: 40
    }
};
