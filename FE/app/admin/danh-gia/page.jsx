'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import QuanLyDanhGia from './components/QuanLyDanhGia';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy hộp thoại xác nhận dùng chung trước thao tác quản trị.
    const { xacNhan } = useAdmin();
    return (<div className="space-y-6 animate-in fade-in duration-200">
                            <QuanLyDanhGia xacNhan={xacNhan} />
                        </div>);
}
