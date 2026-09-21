'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, PackageCheck, Home, Copy, ShieldCheck } from 'lucide-react';
import { formatCurrency, dinhDangTienVND } from '@/utils/formatCurrency';
import { toast } from 'sonner';
export default function ModalDatHangThanhCong({ donHang, onDong }) {
    // Bắn pháo hoa Confetti khi mở modal
    useEffect(() => {
        try {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
        catch (e) {
            console.error(e);
        }
    }, []);
    const saoChepMaDon = () => {
        navigator.clipboard.writeText(donHang.ma_don_hang);
        toast.success(`Đã sao chép mã đơn hàng: ${donHang.ma_don_hang}`);
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in"/>

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 text-center space-y-5 animate-in zoom-in-95 duration-300">
        {/* Icon Thành Công */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-10 h-10"/>
        </div>

        {/* Tiêu đề */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ĐẶT HÀNG THÀNH CÔNG!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Cảm ơn bạn đã tin tưởng lựa chọn LaptopNew. Chúng tôi đã nhận được đơn hàng của bạn.
          </p>
        </div>

        {/* Hộp Thông Tin Mã Đơn Hàng */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Mã đơn hàng:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-extrabold text-sm text-sky-600 dark:text-cyan-400">
                {donHang.ma_don_hang}
              </span>
              <button onClick={saoChepMaDon} className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-sky-500 cursor-pointer" title="Sao chép mã đơn">
                <Copy className="w-3.5 h-3.5"/>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Người nhận:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {donHang.thong_tin_giao_hang.ho_va_ten} ({donHang.thong_tin_giao_hang.so_dien_thoai})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Tổng thanh toán:</span>
            <span className="font-extrabold text-sm text-red-600 dark:text-rose-400">
              {dinhDangTienVND(donHang.tong_tien_thanh_toan)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Hình thức:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {donHang.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr'
            ? 'VietQR 24/7'
            : donHang.hinh_thuc_thanh_toan === 'tra_gop_0_phan_tram'
                ? 'Trả Góp 0%'
                : 'COD Tiền Mặt'}
            </span>
          </div>
        </div>

        {/* Cam kết giao hàng */}
        <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4"/>
          <span>Kỹ thuật viên sẽ liên hệ xác nhận đơn trong 15 phút</span>
        </div>

        {/* Nút Điều Hướng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link href="/don-hang" className="py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
            <PackageCheck className="w-4 h-4"/>
            <span>Tra Cứu Đơn Hàng</span>
          </Link>

          <Link href="/" onClick={onDong} className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
            <Home className="w-4 h-4"/>
            <span>Về Trang Chủ</span>
          </Link>
        </div>
      </div>
    </div>);
}
