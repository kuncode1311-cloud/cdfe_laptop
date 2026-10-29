'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import QuanLyTinTuc from './components/QuanLyTinTuc';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy danh sách tin tức và các hàm quản lý từ Context.
    const { thongSoQuanLyTinTuc } = useAdmin();
    return (<QuanLyTinTuc {...thongSoQuanLyTinTuc} />);
}
