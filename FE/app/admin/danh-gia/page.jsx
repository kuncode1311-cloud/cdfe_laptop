'use client';
import QuanLyDanhGia from './components/QuanLyDanhGia';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý danh-gia: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { xacNhan } = useAdmin();
    return (<div className="space-y-6 animate-in fade-in duration-200">
                            <QuanLyDanhGia xacNhan={xacNhan} />
                        </div>);
}
