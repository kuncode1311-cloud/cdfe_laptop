'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart, useGioHang } from '@/contexts/CartContext';
import { formatCurrency, dinhDangTienVND } from '@/utils/formatCurrency';
export default function TomTatThanhToan() {
    const { gio_hang } = useGioHang();
    return (<div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-5 sticky top-24">
      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
        TÓM TẮT ĐƠN HÀNG
      </h3>

      {/* Chi Tiết Các Khoản */}
      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Tạm tính ({gio_hang.tong_so_luong} sản phẩm):</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {dinhDangTienVND(gio_hang.tam_tinh)}
          </span>
        </div>

        {gio_hang.tien_giam_gia > 0 && (<div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
            <span>Giảm giá Voucher:</span>
            <span>-{dinhDangTienVND(gio_hang.tien_giam_gia)}</span>
          </div>)}

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Phí giao hàng:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            MIỄN PHÍ TOÀN QUỐC
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            Tổng Tiền Thanh Toán:
          </span>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-rose-400">
              {dinhDangTienVND(gio_hang.tong_thanh_toan)}
            </div>
            <div className="text-[10.5px] text-slate-400">
              (Đã bao gồm VAT 10% và Bảo hành chính hãng)
            </div>
          </div>
        </div>
      </div>

      {/* Nút Tiến Hành Thanh Toán */}
      {gio_hang.danh_sach_muc.length > 0 ? (<Link href="/thanh-toan" className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all text-center">
          <span>TIẾN HÀNH THANH TOÁN</span>
          <ArrowRight className="w-4 h-4"/>
        </Link>) : (<button disabled className="w-full py-3.5 px-4 rounded-xl bg-slate-300 dark:bg-slate-800 text-slate-500 text-sm font-bold cursor-not-allowed">
          Giỏ Hàng Đang Trống
        </button>)}

      {/* Cam Kết Dịch Vụ */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0"/>
          <span>Kiểm tra máy kỹ lưỡng trước khi nhận hàng</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-sky-500 shrink-0"/>
          <span>Bọc chống sốc 4 lớp bảo vệ an toàn 100%</span>
        </div>
      </div>
    </div>);
}
