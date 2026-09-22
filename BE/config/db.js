const mongoose = require('mongoose');

/**
 * Hàm kết nối cơ sở dữ liệu MongoDB Atlas qua Mongoose
 */
const ketNoiCoSoDuLieu = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error('❌ Lỗi: Chưa cấu hình MONGODB_URI trong biến môi trường');
            return;
        }

        console.log('⏳ Đang kết nối tới MongoDB Atlas...');
        const ketNoi = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 6000
        });
        console.log(`✅ Kết nối MongoDB Atlas thành công: ${ketNoi.connection.host}/${ketNoi.connection.name}`);
    } catch (loi) {
        console.error('❌ Lỗi kết nối MongoDB Atlas:', loi.message);
        console.log('======================================================================');
        console.log('💡 HƯỚNG DẪN MỞ KẾT NỐI MONGODB ATLAS:');
        console.log('1. Đăng nhập https://cloud.mongodb.com');
        console.log('2. Vào mục "Network Access" (bên menu trái -> Security)');
        console.log('3. Bấm "Add IP Address" -> Chọn "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0) -> Bấm "Confirm"');
        console.log('4. Nếu Cluster đang ở trạng thái "Paused", hãy bấm "Resume"');
        console.log('======================================================================');
    }
};

module.exports = ketNoiCoSoDuLieu;
