'use client';
import QuanLyKhachHang from './components/QuanLyKhachHang';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý khach-hang: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { thongSoQuanLyKhachHang } = useAdmin();
    return (<QuanLyKhachHang {...thongSoQuanLyKhachHang} />);
}
