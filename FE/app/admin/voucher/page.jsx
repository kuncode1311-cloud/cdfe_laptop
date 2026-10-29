'use client';
import QuanLyVoucher from './components/QuanLyVoucher';
import { useAdmin } from '@/app/admin/context/AdminContext';

// Trang quản lý voucher: chỉ ghép giao diện với dữ liệu từ controller.
export default function Page() {
    const { thongSoQuanLyVoucher } = useAdmin();
    return (<QuanLyVoucher {...thongSoQuanLyVoucher} />);
}
