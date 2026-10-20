/**
 * Chuẩn hóa collection `danh-muc`: tách rõ 3 loại và bổ sung đủ hãng.
 *   - thuong_hieu   : hãng (ASUS, Logitech...), có thêm nhom_hang = 'laptop' | 'phu_kien'
 *   - loai_san_pham : loại hàng (Bàn phím, Chuột, Balo...)
 *   - nhu_cau       : nhãn nhu cầu của laptop (Gaming, Sinh viên...)
 * Đồng thời xóa collection `thuong_hieu` (cũ, không còn model nào dùng).
 *
 * Cách chạy:  node scripts-local/chuan-hoa-hang-danh-muc.js          (chỉ xem trước)
 *             node scripts-local/chuan-hoa-hang-danh-muc.js --apply  (ghi thật, tự backup)
 * Chạy lại nhiều lần vẫn an toàn.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const taoSlug = require('../utils/tao-slug');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const APPLY = process.argv.includes('--apply');

const LOAI_SAN_PHAM = [
    'ban-phim-co', 'chuot-lot-chuot', 'balo-tui-chong-soc',
    'tai-nghe-loa', 'sac-cap-hub', 'de-tan-gia-do', 'linh-kien-nang-cap'
];

const HANG_LAPTOP = ['asus', 'acer', 'dell', 'hp', 'lenovo', 'msi', 'apple', 'gigabyte'];

// Hãng phụ kiện / linh kiện chưa có trong bảng danh-muc: [mã, tên hiển thị, xuất xứ]
const HANG_PHU_KIEN = [
    ['akko', 'Akko', 'Trung Quốc'], ['anker', 'Anker', 'Mỹ / Trung Quốc'],
    ['artisan', 'Artisan', 'Nhật Bản'], ['belkin', 'Belkin', 'Mỹ'],
    ['caldigit', 'CalDigit', 'Mỹ'], ['corsair', 'Corsair', 'Mỹ'],
    ['deepcool', 'DeepCool', 'Trung Quốc'], ['hyperx', 'HyperX', 'Mỹ'],
    ['iets', 'IETS', 'Trung Quốc'], ['intel', 'Intel', 'Mỹ'],
    ['jbl', 'JBL', 'Mỹ'], ['keychron', 'Keychron', 'Hồng Kông'],
    ['kingston', 'Kingston', 'Mỹ'], ['logitech', 'Logitech', 'Thụy Sĩ'],
    ['marshall', 'Marshall', 'Anh'], ['moft', 'MOFT', 'Trung Quốc'],
    ['pulsar', 'Pulsar', 'Mỹ'], ['razer', 'Razer', 'Mỹ'],
    ['samsung', 'Samsung', 'Hàn Quốc'], ['sandisk', 'SanDisk', 'Mỹ'],
    ['shargeek', 'Shargeek', 'Trung Quốc'], ['sony', 'Sony', 'Nhật Bản'],
    ['steelseries', 'SteelSeries', 'Đan Mạch'], ['targus', 'Targus', 'Mỹ'],
    ['thermal-grizzly', 'Thermal Grizzly', 'Đức'], ['tomtoc', 'Tomtoc', 'Trung Quốc'],
    ['ugreen', 'UGREEN', 'Trung Quốc'], ['western-digital', 'Western Digital', 'Mỹ']
];

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const dm = db.collection('danh-muc');
    const hienCo = await dm.find({}).toArray();
    const maCo = new Set(hienCo.map((d) => d.ma_danh_muc));
    let thuTu = Math.max(0, ...hienCo.map((d) => d.thu_tu_hien_thi || 0));

    const themMoi = HANG_PHU_KIEN.filter(([ma]) => !maCo.has(ma)).map(([ma, ten, xuatXu]) => ({
        id: `brand-${ma}`, slug: taoSlug(ten) || ma, ma_danh_muc: ma, ten_danh_muc: ten,
        loai: 'thuong_hieu', nhom_hang: 'phu_kien', logo: '🎮', mo_ta: `Hãng ${ten}`,
        xuat_xu: xuatXu, kich_hoat: true, thu_tu_hien_thi: ++thuTu,
        createdAt: new Date(), updatedAt: new Date()
    }));

    const capNhatLoai = hienCo.filter((d) => LOAI_SAN_PHAM.includes(d.ma_danh_muc) && d.loai !== 'loai_san_pham');
    const capNhatHang = hienCo.filter((d) => d.loai === 'thuong_hieu' && !d.nhom_hang);
    const hangCuThua = await db.listCollections({ name: 'thuong_hieu' }).toArray();

    console.log(`Thêm mới ${themMoi.length} hãng phụ kiện`);
    console.log(`Đổi sang loai_san_pham: ${capNhatLoai.map((d) => d.ma_danh_muc).join(', ') || '(không)'}`);
    console.log(`Gắn nhom_hang cho ${capNhatHang.length} hãng cũ`);
    console.log(`Xóa collection thuong_hieu thừa: ${hangCuThua.length ? 'có' : 'không có'}`);

    if (!APPLY) {
        console.log('\n(Chế độ xem trước, thêm --apply để ghi thật)');
        return;
    }

    const thuMuc = path.join(__dirname, '..', 'backup_db');
    fs.writeFileSync(path.join(thuMuc, `danh-muc.truoc-chuan-hoa.json`), JSON.stringify(hienCo, null, 2));
    if (hangCuThua.length) {
        const cu = await db.collection('thuong_hieu').find({}).toArray();
        fs.writeFileSync(path.join(thuMuc, `thuong_hieu.truoc-chuan-hoa.json`), JSON.stringify(cu, null, 2));
    }

    if (themMoi.length) await dm.insertMany(themMoi);
    if (capNhatLoai.length) await dm.updateMany({ ma_danh_muc: { $in: LOAI_SAN_PHAM } }, { $set: { loai: 'loai_san_pham' } });
    await dm.updateMany({ loai: 'thuong_hieu', ma_danh_muc: { $in: HANG_LAPTOP } }, { $set: { nhom_hang: 'laptop' } });
    await dm.updateMany({ loai: 'thuong_hieu', nhom_hang: { $exists: false } }, { $set: { nhom_hang: 'phu_kien' } });
    if (hangCuThua.length) await db.collection('thuong_hieu').drop();
    console.log('\nĐã ghi xong. Bản backup nằm trong BE/backup_db/*.truoc-chuan-hoa.json');
})().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => mongoose.disconnect());
