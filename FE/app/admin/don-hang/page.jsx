'use client';
import QuanLyDonHang from './components/QuanLyDonHang';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý don-hang: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { thongSoQuanLyDonHang } = useAdmin();
    return (<QuanLyDonHang {...thongSoQuanLyDonHang} />);
}
