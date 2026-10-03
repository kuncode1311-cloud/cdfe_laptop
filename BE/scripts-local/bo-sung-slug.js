const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taoSlug = require('../utils/tao-slug');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const taoSlugKhongTrung = (slugGoc, id, slugDaDung) => {
    const coSo = slugGoc || String(id);
    let slug = coSo;
    let dem = 2;
    while (slugDaDung.has(slug)) slug = `${coSo}-${dem++}`;
    slugDaDung.add(slug);
    return slug;
};

const boSungSlug = async (tenCollection, truongTieuDe, fallbackField) => {
    const collection = mongoose.connection.collection(tenCollection);
    const taiLieu = await collection.find({}).toArray();
    const slugDaDung = new Set();
    const operations = taiLieu.map((item) => {
        const slugGoc = item.slug || taoSlug(item[truongTieuDe]) || taoSlug(item[fallbackField]);
        const slug = taoSlugKhongTrung(slugGoc, item._id, slugDaDung);
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $set: { slug } }
            }
        };
    });

    if (operations.length) await collection.bulkWrite(operations);
    await collection.createIndex({ slug: 1 }, { unique: true, sparse: true });
    console.log(`✅ ${tenCollection}: ${operations.length} document đã có slug.`);
};

const chay = async () => {
    if (!process.env.MONGODB_URI) throw new Error('Thiếu MONGODB_URI trong BE/.env');
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

    // Sản phẩm đã có id dạng URL đẹp, dùng lại để không phá các liên kết cũ.
    await boSungSlug('san_pham', 'id', 'ma_san_pham');
    await boSungSlug('tin_tuc', 'tieu_de', 'id');
    await boSungSlug('danh-muc', 'ten_danh_muc', 'ma_danh_muc');

    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.some(({ name }) => name === 'danh_muc')) {
        await boSungSlug('danh_muc', 'ten_danh_muc', 'ma_danh_muc');
    }
};

chay()
    .catch((loi) => {
        console.error('❌ Không thể bổ sung slug:', loi.message);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
