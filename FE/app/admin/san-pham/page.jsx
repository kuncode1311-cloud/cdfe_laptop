'use client'; // Trang này dùng hook React để lấy dữ liệu từ Admin Context.

import QuanLySanPham from './components/QuanLySanPham';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy danh sách sản phẩm, bộ lọc và hàm xử lý từ Context admin.
    const { thongSoQuanLySanPham } = useAdmin();

    // Dấu ... chuyển từng mục trong gói thành props cho giao diện sản phẩm.
    return <QuanLySanPham {...thongSoQuanLySanPham} />;
}
