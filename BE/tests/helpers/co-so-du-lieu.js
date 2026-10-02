/**
 * Tiện ích database cho kiểm thử tích hợp.
 *
 * Dùng mongodb-memory-server: mỗi file test khởi động một MongoDB thật nhưng chạy
 * trong RAM, dữ liệu mất khi test kết thúc → không ảnh hưởng database production
 * và các file test không phụ thuộc lẫn nhau.
 */
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Khởi động MongoDB trong bộ nhớ và kết nối Mongoose
const moKetNoi = async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
};

// Xóa sạch dữ liệu giữa các ca kiểm thử để mỗi ca bắt đầu từ trạng thái rỗng
const xoaDuLieu = async () => {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
};

// Ngắt kết nối và tắt MongoDB khi file test chạy xong
const dongKetNoi = async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
};

module.exports = { moKetNoi, xoaDuLieu, dongKetNoi };
