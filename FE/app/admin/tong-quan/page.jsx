'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import TongQuanTab from './components/TongQuanTab';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy số liệu tổng hợp và hành động của dashboard từ Context.
    const { thongSoTongQuanTab } = useAdmin();
    return (<TongQuanTab {...thongSoTongQuanTab} />);
}
