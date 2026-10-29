'use client';
import TongQuanTab from './components/TongQuanTab';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý tong-quan: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { thongSoTongQuanTab } = useAdmin();
    return (<TongQuanTab {...thongSoTongQuanTab} />);
}
