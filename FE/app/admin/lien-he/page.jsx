'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import QuanLyLienHeTuVan from './components/QuanLyLienHeTuVan';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy hàm cập nhật số liên hệ đang chờ và hộp thoại xác nhận chung.
    const { setSoLuongChuaXuLyLienHe, xacNhan } = useAdmin();
    return (<div className="space-y-6 animate-in fade-in duration-200">
                            <QuanLyLienHeTuVan onCapNhatSoLuongChuaXuLy={setSoLuongChuaXuLyLienHe} xacNhan={xacNhan} />
                        </div>);
}
