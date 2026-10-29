'use client';
import QuanLyLienHeTuVan from './components/QuanLyLienHeTuVan';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý lien-he: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { setSoLuongChuaXuLyLienHe, xacNhan } = useAdmin();
    return (<div className="space-y-6 animate-in fade-in duration-200">
                            <QuanLyLienHeTuVan onCapNhatSoLuongChuaXuLy={setSoLuongChuaXuLyLienHe} xacNhan={xacNhan} />
                        </div>);
}
