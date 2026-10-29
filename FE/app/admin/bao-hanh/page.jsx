'use client';
import QuanLyBaoHanh from './components/QuanLyBaoHanh';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý bao-hanh: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { xacNhan } = useAdmin();
    return (<div className="space-y-6 animate-in fade-in duration-200">
                            <QuanLyBaoHanh xacNhan={xacNhan} />
                        </div>);
}
