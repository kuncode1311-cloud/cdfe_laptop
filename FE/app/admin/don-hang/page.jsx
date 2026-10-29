'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import QuanLyDonHang from './components/QuanLyDonHang';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy danh sách đơn hàng, bộ lọc và hàm xử lý từ Context.
    const { thongSoQuanLyDonHang } = useAdmin();
    return (<QuanLyDonHang {...thongSoQuanLyDonHang} />);
}
