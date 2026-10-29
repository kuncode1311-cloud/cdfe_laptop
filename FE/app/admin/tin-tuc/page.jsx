'use client';
import QuanLyTinTuc from './components/QuanLyTinTuc';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý tin-tuc: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { thongSoQuanLyTinTuc } = useAdmin();
    return (<QuanLyTinTuc {...thongSoQuanLyTinTuc} />);
}
