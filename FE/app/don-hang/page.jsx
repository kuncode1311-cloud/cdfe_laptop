'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ChevronRight, Search, PackageCheck, Truck } from 'lucide-react';
import { DonHangService } from '@/services/don-hang.service';
import { formatCurrency, dinhDangTienVND } from '@/utils/formatCurrency';
export default function TrangTraCuuDonHang() {
    const [tuKhoaTraCuu, setTuKhoaTraCuu] = useState('');
    const [ketQuaTraCuu, setKetQuaTraCuu] = useState(null);
    const [daTimKiem, setDaTimKiem] = useState(false);
    const xuLyTraCuu = (e) => {
        e.preventDefault();
        if (!tuKhoaTraCuu.trim())
            return;
        const ketQua = DonHangService.traCuuDonHang(tuKhoaTraCuu.trim());
        setKetQuaTraCuu(ketQua);
        setDaTimKiem(true);
    };
    return (<div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
          <Home className="w-3.5 h-3.5"/>
          <span>Trang Chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5"/>
        <span className="font-semibold text-slate-900 dark:text-white">Tra Cứu Đơn Hàng</span>
      </nav>

      {/* 2. Tiêu đề & Hộp Tra Cứu */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-500 mx-auto flex items-center justify-center">
          <PackageCheck className="w-7 h-7"/>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          TRA CỨU TIẾN ĐỘ ĐƠN HÀNG
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Nhập Mã Đơn Hàng (ví dụ: <strong className="text-sky-500">LPN-83921</strong>) hoặc Số Điện Thoại nhận hàng để kiểm tra lịch trình vận chuyển thời gian thực.
        </p>

        {/* Form Nhập Tra Cứu */}
        <form onSubmit={xuLyTraCuu} className="max-w-md mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <input type="text" value={tuKhoaTraCuu} onChange={(e) => setTuKhoaTraCuu(e.target.value)} placeholder="Nhập mã đơn LPN-xxxxx hoặc SĐT..." className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"/>
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"/>
          </div>
          <button type="submit" className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-md">
            Tra Cứu
          </button>
        </form>
      </div>

      {/* 3. Hiển Thị Kết Quả Đơn Hàng */}
      {daTimKiem && (<div className="space-y-6 pt-4 animate-in fade-in duration-300">
          {ketQuaTraCuu && ketQuaTraCuu.length > 0 ? (ketQuaTraCuu.map((dh) => (<div key={dh.id} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
                {/* Header Đơn Hàng */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 uppercase font-semibold">Mã Đơn Hàng:</span>
                      <span className="font-mono font-extrabold text-base text-sky-600 dark:text-cyan-400">
                        {dh.ma_don_hang}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Thời gian đặt: {dh.ngay_tao}
                    </div>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold text-xs self-start sm:self-auto border border-emerald-300 dark:border-emerald-700/60">
                    Đã Xác Nhận - Đang Xử Lý
                  </span>
                </div>

                {/* Tiến Trình Vận Chuyển Timeline */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-sky-500 dark:text-cyan-400"/>
                    <span>Lịch Trình Vận Chuyển:</span>
                  </h3>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                    {dh.lich_trinh_giao_hang.map((moc, idx) => (<div key={idx} className="relative space-y-1">
                        <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 ${moc.hoan_thanh
                        ? 'border-emerald-500 text-emerald-500'
                        : 'border-slate-300 dark:border-slate-700'}`}/>
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold ${moc.hoan_thanh
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400'}`}>
                            {moc.tieu_de}
                          </span>
                          <span className="text-[11px] text-slate-400">{moc.thoi_gian}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {moc.mo_ta_chi_tiet}
                        </p>
                      </div>))}
                  </div>
                </div>

                {/* Danh Sách Món Hàng */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Sản Phẩm Đã Đặt:
                  </h3>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {dh.danh_sach_san_pham.map((muc) => (<div key={muc.id_muc} className="py-3 flex items-center gap-3 text-xs">
                        <div className="relative w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0">
                          <Image src={muc.san_pham.hinh_anh_chinh} alt={muc.san_pham.ten_san_pham} fill className="object-contain p-1"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">
                            {muc.san_pham.ten_san_pham}
                          </h4>
                          <div className="text-slate-400 text-[11px]">
                            Số lượng: {muc.so_luong} {muc.tuy_chon_chon ? `• ${muc.tuy_chon_chon.ten_tuy_chon}` : ''}
                          </div>
                        </div>
                        <div className="font-bold text-red-600 dark:text-rose-400">
                          {dinhDangTienVND(muc.tong_tien_muc)}
                        </div>
                      </div>))}
                  </div>
                </div>

                {/* Thông Tin Người Nhận & Tổng Tiền */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">Địa Chỉ Nhận Hàng:</div>
                    <div className="text-slate-600 dark:text-slate-300">
                      <strong>{dh.thong_tin_giao_hang.ho_va_ten}</strong> - {dh.thong_tin_giao_hang.so_dien_thoai}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      {dh.thong_tin_giao_hang.dia_chi_chi_tiet}, {dh.thong_tin_giao_hang.quan_huyen}, {dh.thong_tin_giao_hang.tinh_thanh}
                    </div>
                  </div>

                  <div className="space-y-1 sm:text-right">
                    <div className="font-bold text-slate-900 dark:text-white">Tổng Thanh Toán:</div>
                    <div className="text-lg font-black text-red-600 dark:text-rose-400">
                      {dinhDangTienVND(dh.tong_tien_thanh_toan)}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Hình thức: {dh.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ? 'VietQR 24/7' : 'Tiền mặt khi nhận'}
                    </div>
                  </div>
                </div>
              </div>))) : (<div className="p-10 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Không tìm thấy đơn hàng với thông tin &quot;{tuKhoaTraCuu}&quot;
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Quý khách vui lòng kiểm tra lại chính xác Mã Đơn Hàng (dạng LPN-xxxxx) hoặc Số Điện Thoại lúc đặt hàng.
              </p>
            </div>)}
        </div>)}
    </div>);
}
