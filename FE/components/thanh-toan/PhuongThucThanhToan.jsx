'use client';
import React from 'react';
import Image from 'next/image';
import { QrCode, CreditCard, Banknote, Check, Sparkles } from 'lucide-react';
import { formatCurrency, dinhDangTienVND } from '@/utils/formatCurrency';
export default function PhuongThucThanhToanComponent({ phuongThucChon, onThayDoi, tongTien }) {
    // Mã VietQR demo ngân hàng Quân Đội MBBank / Vietcombank
    const vietQrUrl = `https://img.vietqr.io/image/MB-0948377979-compact2.png?amount=${tongTien}&addInfo=LAPTOPNEW%20THANHTOAN&accountName=LAPTOPNEW%20VIETNAM`;
    return (<div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-sky-500 dark:text-cyan-400"/>
        <span>2. CHỌN HÌNH THỨC THANH TOÁN</span>
      </h3>

      <div className="space-y-3">
        {/* 1. Chuyển Khoản Ngân Hàng VietQR */}
        <div onClick={() => onThayDoi('chuyen_khoan_vietqr')} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${phuongThucChon === 'chuyen_khoan_vietqr'
            ? 'border-sky-500 dark:border-cyan-400 bg-sky-50/50 dark:bg-slate-800/80 shadow-md'
            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold shrink-0">
                <QrCode className="w-5 h-5"/>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Chuyển Khoản Ngân Hàng VietQR 24/7
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                    Khuyên Dùng
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Quét mã QR tự động điền số tiền và nội dung, xác nhận tức thì trong 30 giây
                </p>
              </div>
            </div>

            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${phuongThucChon === 'chuyen_khoan_vietqr'
            ? 'border-sky-500 dark:border-cyan-400 bg-sky-500 dark:bg-cyan-400 text-white dark:text-slate-950'
            : 'border-slate-300 dark:border-slate-700'}`}>
              {phuongThucChon === 'chuyen_khoan_vietqr' && <Check className="w-3.5 h-3.5 stroke-[3]"/>}
            </div>
          </div>

          {/* Hiển Thị Mã VietQR Khi Được Chọn */}
          {phuongThucChon === 'chuyen_khoan_vietqr' && (<div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-5 animate-in fade-in">
              <div className="relative w-36 h-36 rounded-xl overflow-hidden bg-white p-2 border shrink-0">
                <Image src={vietQrUrl} alt="Mã QR VietQR thanh toán LaptopNew" fill className="object-contain"/>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="font-bold text-slate-900 dark:text-white">
                  Thông Tin Tài Khoản Thụ Hưởng:
                </div>
                <div>Ngân hàng: <strong>MBBank (Ngân Hàng Quân Đội)</strong></div>
                <div>Số tài khoản: <strong className="text-sky-600 dark:text-cyan-400 text-sm font-mono">0948.37.79.79</strong></div>
                <div>Chủ tài khoản: <strong>CÔNG TY CỔ PHẦN CÔNG NGHỆ LAPTOPNEW</strong></div>
                <div>Số tiền thanh toán: <strong className="text-red-600 dark:text-rose-400 text-sm">{dinhDangTienVND(tongTien)}</strong></div>
                <div className="text-[11px] text-slate-400 pt-1">
                  * Sau khi quét mã thanh toán, quý khách bấm nút &quot;Hoàn Tất Đặt Hàng&quot; bên dưới.
                </div>
              </div>
            </div>)}
        </div>

        {/* 2. Thanh Toán Khi Nhận Hàng (COD) */}
        <div onClick={() => onThayDoi('tien_mat_cod')} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${phuongThucChon === 'tien_mat_cod'
            ? 'border-sky-500 dark:border-cyan-400 bg-sky-50/50 dark:bg-slate-800/80 shadow-md'
            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
                <Banknote className="w-5 h-5"/>
              </div>
              <div>
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  Thanh Toán Tiền Mặt Khi Nhận Hàng (COD)
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Kiểm tra máy nguyên seal, mở hộp test thử trước khi thanh toán cho bưu tá
                </p>
              </div>
            </div>

            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${phuongThucChon === 'tien_mat_cod'
            ? 'border-sky-500 dark:border-cyan-400 bg-sky-500 dark:bg-cyan-400 text-white dark:text-slate-950'
            : 'border-slate-300 dark:border-slate-700'}`}>
              {phuongThucChon === 'tien_mat_cod' && <Check className="w-3.5 h-3.5 stroke-[3]"/>}
            </div>
          </div>
        </div>

        {/* 3. Mua Trả Góp 0% */}
        <div onClick={() => onThayDoi('tra_gop_0_phan_tram')} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${phuongThucChon === 'tra_gop_0_phan_tram'
            ? 'border-sky-500 dark:border-cyan-400 bg-sky-50/50 dark:bg-slate-800/80 shadow-md'
            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-5 h-5"/>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Trả Góp 0% Lãi Suất Qua Thẻ Tín Dụng
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-[10px] font-bold">
                    0% Phí
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Hỗ trợ hơn 25 ngân hàng (Visa, Master, JCB). Nhân viên sẽ liên hệ duyệt hồ sơ trong 5 phút.
                </p>
              </div>
            </div>

            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${phuongThucChon === 'tra_gop_0_phan_tram'
            ? 'border-sky-500 dark:border-cyan-400 bg-sky-500 dark:bg-cyan-400 text-white dark:text-slate-950'
            : 'border-slate-300 dark:border-slate-700'}`}>
              {phuongThucChon === 'tra_gop_0_phan_tram' && <Check className="w-3.5 h-3.5 stroke-[3]"/>}
            </div>
          </div>
        </div>
      </div>
    </div>);
}
