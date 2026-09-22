const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const DonHang = require('../models/don-hang.model');

async function fixOrders() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/laptopnew');
    const orders = await DonHang.find().lean();
    console.log('Total orders to check:', orders.length);

    for (const o of orders) {
        const updatedItems = (o.danh_sach_san_pham || []).map(item => {
            const sp = item.san_pham || {};
            const giaSP = item.gia_tai_thoi_diem_them || item.gia_hien_tai || sp.gia_khuyen_mai || sp.gia_goc || sp.gia || 0;
            const qty = item.so_luong || 1;
            const chenhLech = item.tuy_chon_chon?.chenh_lech_gia || 0;
            const donGia = giaSP + chenhLech;
            const tongTien = item.tong_tien_muc || (donGia * qty);
            return {
                ...item,
                ten_san_pham: item.ten_san_pham || sp.ten_san_pham || 'Laptop Chính Hãng',
                hinh_anh: item.hinh_anh || sp.hinh_anh_chinh || sp.hinh_anh || '',
                san_pham_id: item.san_pham_id || sp.id || sp._id || item.id || '',
                gia_tai_thoi_diem_them: donGia,
                gia_hien_tai: donGia,
                tong_tien_muc: tongTien
            };
        });

        const updateData = { danh_sach_san_pham: updatedItems };

        // Cập nhật thông tin người nhận chuẩn của Lê Trí cho các đơn vừa tạo
        if (o.ma_don_hang === 'LPN-260922-5020') {
            updateData['thong_tin_giao_hang.ho_ten'] = 'Lê Trí';
            updateData['thong_tin_giao_hang.ho_va_ten'] = 'Lê Trí';
            updateData['thong_tin_giao_hang.email'] = 'kun.learning01@gmail.com';
            updateData['thong_tin_giao_hang.so_dien_thoai'] = '0912345678';
            updateData['id_nguoi_dung'] = 'usr-letri';
            updateData['trang_thai'] = 'da_xac_nhan';
        } else if (o.ma_don_hang === 'LPN-260921-1543') {
            updateData['thong_tin_giao_hang.ho_ten'] = 'Lê Trí';
            updateData['thong_tin_giao_hang.ho_va_ten'] = 'Lê Trí';
            updateData['thong_tin_giao_hang.email'] = 'kun.learning01@gmail.com';
            updateData['thong_tin_giao_hang.so_dien_thoai'] = '0912345678';
            updateData['id_nguoi_dung'] = 'usr-letri';
            updateData['trang_thai'] = 'dang_giao';
        } else if (o.ma_don_hang === 'LPN-260921-6069') {
            updateData['thong_tin_giao_hang.ho_ten'] = 'Lê Trí';
            updateData['thong_tin_giao_hang.ho_va_ten'] = 'Lê Trí';
            updateData['thong_tin_giao_hang.email'] = 'kun.learning01@gmail.com';
            updateData['thong_tin_giao_hang.so_dien_thoai'] = '0912345678';
            updateData['id_nguoi_dung'] = 'usr-letri';
            updateData['trang_thai'] = 'da_giao';
        }

        await DonHang.updateOne({ _id: o._id }, { $set: updateData });
    }

    console.log('Fixed all orders in DB successfully!');
    await mongoose.disconnect();
}

fixOrders().catch(err => {
    console.error(err);
    process.exit(1);
});
