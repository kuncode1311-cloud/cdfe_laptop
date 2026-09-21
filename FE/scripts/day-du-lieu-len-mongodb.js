import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Chuỗi kết nối MongoDB Atlas
const uri = process.env.MONGODB_URI || "mongodb+srv://kuncode1311_db_user:cd0xoTq5PSmTHvqP@laptop-store.ynzhkyj.mongodb.net/laptop_store?retryWrites=true&w=majority&appName=laptop-store";

async function pushDataToMongoDB() {
    const client = new MongoClient(uri);

    try {
        console.log('⏳ Đang kết nối tới MongoDB Atlas...');
        await client.connect();
        console.log('✅ Kết nối thành công tới MongoDB Atlas!');

        const db = client.db('laptop_store');

        // Đọc dữ liệu từ db.json
        const dbJsonPath = fs.existsSync(path.join(process.cwd(), 'FE', 'db.json'))
            ? path.join(process.cwd(), 'FE', 'db.json')
            : path.join(process.cwd(), 'db.json');
        if (!fs.existsSync(dbJsonPath)) {
            throw new Error(`Không tìm thấy file db.json tại: ${dbJsonPath}`);
        }

        const rawData = fs.readFileSync(dbJsonPath, 'utf-8');
        const data = JSON.parse(rawData);

        console.log('\n🚀 Bắt đầu đẩy dữ liệu lên các bảng (collections):');

        // Duyệt qua từng bảng trong db.json để nạp vào MongoDB
        for (const [collectionName, records] of Object.entries(data)) {
            if (Array.isArray(records) && records.length > 0) {
                const collection = db.collection(collectionName);
                
                // Xóa dữ liệu cũ trước khi nạp mới (để tránh trùng lặp khi chạy lại)
                await collection.deleteMany({});
                
                // Thêm dữ liệu
                const result = await collection.insertMany(records);
                console.log(`  ✓ Bảng [${collectionName}]: đã nạp ${result.insertedCount} bản ghi`);
            } else {
                console.log(`  - Bảng [${collectionName}]: rỗng (bỏ qua)`);
            }
        }

        console.log('\n🎉 ĐÃ ĐẨY TOÀN BỘ DỮ LIỆU LÊN MONGODB ATLAS THÀNH CÔNG!');
    } catch (error) {
        console.error('❌ Lỗi trong quá trình nạp dữ liệu:', error);
    } finally {
        await client.close();
        console.log('🔒 Đã đóng kết nối.');
    }
}

pushDataToMongoDB();
