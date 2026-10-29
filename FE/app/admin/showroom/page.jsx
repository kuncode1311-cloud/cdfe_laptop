'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import CauHinhShowroom from './components/CauHinhShowroom';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy dữ liệu và hàm cấu hình showroom từ Context.
    const { thongSoCauHinhShowroom } = useAdmin();
    return (<CauHinhShowroom {...thongSoCauHinhShowroom} />);
}
