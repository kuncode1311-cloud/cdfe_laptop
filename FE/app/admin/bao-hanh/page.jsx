'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import QuanLyBaoHanh from './components/QuanLyBaoHanh';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy hộp thoại xác nhận dùng chung trước thao tác quản trị.
    const { xacNhan } = useAdmin();
    return (<div className="space-y-6 animate-in fade-in duration-200">
                            <QuanLyBaoHanh xacNhan={xacNhan} />
                        </div>);
}
