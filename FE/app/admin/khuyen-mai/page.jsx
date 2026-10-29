'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import CauHinhKhuyenMai from './components/CauHinhKhuyenMai';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy dữ liệu và hàm cấu hình khuyến mãi từ Context.
    const { thongSoCauHinhKhuyenMai } = useAdmin();
    return (<CauHinhKhuyenMai {...thongSoCauHinhKhuyenMai} />);
}
