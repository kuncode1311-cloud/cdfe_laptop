'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import QuanLyKhachHang from './components/QuanLyKhachHang';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy danh sách khách hàng và các hàm quản lý từ Context.
    const { thongSoQuanLyKhachHang } = useAdmin();
    return (<QuanLyKhachHang {...thongSoQuanLyKhachHang} />);
}
