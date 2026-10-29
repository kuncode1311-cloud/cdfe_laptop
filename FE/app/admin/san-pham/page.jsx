'use client';
import QuanLySanPham from './components/QuanLySanPham';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý san-pham: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { thongSoQuanLySanPham } = useAdmin();
    return (<QuanLySanPham {...thongSoQuanLySanPham} />);
}
