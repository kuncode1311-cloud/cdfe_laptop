'use client';
import CauHinhKhuyenMai from './components/CauHinhKhuyenMai';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý khuyen-mai: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { thongSoCauHinhKhuyenMai } = useAdmin();
    return (<CauHinhKhuyenMai {...thongSoCauHinhKhuyenMai} />);
}
