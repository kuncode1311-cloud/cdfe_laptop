'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import QuanLyDanhMuc from './components/QuanLyDanhMuc';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy danh sách, bộ lọc và hàm quản lý danh mục từ Context.
    const { thongSoQuanLyDanhMuc } = useAdmin();
    return (<QuanLyDanhMuc {...thongSoQuanLyDanhMuc} />);
}
