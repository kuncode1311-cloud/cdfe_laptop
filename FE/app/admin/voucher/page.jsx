'use client'; // Trang cần hook React để lấy dữ liệu từ Context.

import QuanLyVoucher from './components/QuanLyVoucher';
import { useAdmin } from '@/app/admin/context/AdminContext';

export default function Page() {
    // Lấy danh sách voucher, bộ lọc và hàm quản lý từ Context.
    const { thongSoQuanLyVoucher } = useAdmin();
    return (<QuanLyVoucher {...thongSoQuanLyVoucher} />);
}
