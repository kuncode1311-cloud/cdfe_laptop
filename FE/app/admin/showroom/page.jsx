'use client';
import CauHinhShowroom from './components/CauHinhShowroom';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý showroom: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { thongSoCauHinhShowroom } = useAdmin();
    return (<CauHinhShowroom {...thongSoCauHinhShowroom} />);
}
