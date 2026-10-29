'use client';
import QuanLyDanhMuc from './components/QuanLyDanhMuc';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý danh-muc: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { thongSoQuanLyDanhMuc } = useAdmin();
    return (<QuanLyDanhMuc {...thongSoQuanLyDanhMuc} />);
}
