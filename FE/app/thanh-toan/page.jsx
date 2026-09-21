'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, ChevronRight, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import { useCart, useGioHang } from '@/contexts/CartContext';
import { DonHangService } from '@/services/don-hang.service';
import { formatCurrency, dinhDangTienVND } from '@/utils/formatCurrency';
import FormThongTinGiaoHang from '@/components/thanh-toan/FormThongTinGiaoHang';
import PhuongThucThanhToanComponent from '@/components/thanh-toan/PhuongThucThanhToan';
import ModalDatHangThanhCong from '@/components/thanh-toan/ModalDatHangThanhCong';
import { toast } from 'sonner';
export default function TrangThanhToan() {
    const router = useRouter();
    const { gio_hang, xoaSachGioHang } = useGioHang();
    const [thongTinGiaoHang, setThongTinGiaoHang] = useState({
        ho_va_ten: '',
        so_dien_thoai: '',
        email: '',
        tinh_thanh: '',
        quan_huyen: '',
        dia_chi_chi_tiet: '',
        ghi_chu: ''
    });
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState('chuyen_khoan_vietqr');
    const [donHangThanhCong, setDonHangThanhCong] = useState(null);
    const xuLyDatHang = async (e) => {
        e.preventDefault();
        if (gio_hang.danh_sach_muc.length === 0) {
            toast.error('Giỏ hàng đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.');
            return;
        }
        if (!thongTinGiaoHang.ho_va_ten.trim() ||
            !thongTinGiaoHang.so_dien_thoai.trim() ||
            !thongTinGiaoHang.email.trim() ||
            !thongTinGiaoHang.dia_chi_chi_tiet.trim()) {
            toast.error('Vui lòng điền đầy đủ các thông tin giao hàng có dấu *');
            return;
        }
        // Tạo đơn hàng và lưu trữ vào MongoDB / LocalStorage
        try {
            const donHangMoi = await DonHangService.taoDonHang(
                thongTinGiaoHang,
                gio_hang.danh_sach_muc,
                gio_hang.tam_tinh,
                gio_hang.tien_giam_gia,
                gio_hang.ma_giam_gia_da_dung,
                phuongThucThanhToan
            );
            // Xóa giỏ hàng
            xoaSachGioHang();
            // Mở popup thành công
            setDonHangThanhCong(donHangMoi);
        } catch (err) {
            toast.error(`Có lỗi khi đặt hàng: ${err.message}`);
        }
    };
    return (<div className="space-y-8">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
          <Home className="w-3.5 h-3.5"/>
          <span>Trang Chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5"/>
        <Link href="/gio-hang" className="hover:text-slate-900 dark:hover:text-white">
          Giỏ Hàng
        </Link>
        <ChevronRight className="w-3.5 h-3.5"/>
        <span className="font-semibold text-slate-900 dark:text-white">Thanh Toán Đơn Hàng</span>
      </nav>

      {/* 2. Tiêu đề */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            THANH TOÁN & ĐẶT HÀNG
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Giao hàng hỏa tốc 2H • Cam kết 100% chính hãng niêm phong • Bảo mật thanh toán SSL
          </p>
        </div>

        <Link href="/gio-hang" className="text-xs font-bold text-sky-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4"/>
          <span>Quay lại giỏ hàng</span>
        </Link>
      </div>

      {/* 3. Form Thanh Toán & Tóm Tắt Đơn */}
      <form onSubmit={xuLyDatHang} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cột Trái (7 Cột): Form Giao Hàng & Phương Thức Thanh Toán */}
        <div className="lg:col-span-7 space-y-6">
          <FormThongTinGiaoHang thongTin={thongTinGiaoHang} onThayDoi={setThongTinGiaoHang}/>

          <PhuongThucThanhToanComponent phuongThucChon={phuongThucThanhToan} onThayDoi={setPhuongThucThanhToan} tongTien={gio_hang.tong_thanh_toan}/>
        </div>

        {/* Cột Phải (5 Cột): Danh Sách Món Hàng & Tổng Tiền */}
        <div className="lg:col-span-5 space-y-5 sticky top-24">
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
              ĐƠN HÀNG CỦA BẠN ({gio_hang.tong_so_luong} MÁY)
            </h3>

            {/* Danh sách rút gọn các laptop trong giỏ */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto pr-1">
              {gio_hang.danh_sach_muc.map((muc) => (<div key={muc.id_muc} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0">
                    <Image src={muc.san_pham.hinh_anh_chinh} alt={muc.san_pham.ten_san_pham} fill className="object-contain p-1"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {muc.san_pham.ten_san_pham}
                    </h4>
                    <div className="text-[11px] text-slate-400">
                      SL: <strong>{muc.so_luong}</strong> {muc.tuy_chon_chon ? `• ${muc.tuy_chon_chon.ram}` : ''}
                    </div>
                  </div>
                  <div className="text-xs font-extrabold text-red-600 dark:text-rose-400 shrink-0">
                    {dinhDangTienVND(muc.tong_tien_muc)}
                  </div>
                </div>))}
            </div>

            {/* Tóm tắt số tiền */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Tạm tính:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {dinhDangTienVND(gio_hang.tam_tinh)}
                </span>
              </div>

              {gio_hang.tien_giam_gia > 0 && (<div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Voucher giảm giá ({gio_hang.ma_giam_gia_da_dung}):</span>
                  <span>-{dinhDangTienVND(gio_hang.tien_giam_gia)}</span>
                </div>)}

              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span>Phí giao hàng toàn quốc:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  MIỄN PHÍ
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Tổng thanh toán:
                </span>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-rose-400">
                    {dinhDangTienVND(gio_hang.tong_thanh_toan)}
                  </div>
                  <div className="text-[10.5px] text-slate-400">
                    (Đã gồm VAT 10%)
                  </div>
                </div>
              </div>
            </div>

            {/* Nút Đặt Hàng Chính */}
            <button type="submit" className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-500/25 transition-all hover:scale-[1.01] cursor-pointer">
              <Lock className="w-4 h-4"/>
              <span>HOÀN TẤT ĐẶT HÀNG NGAY</span>
            </button>

            <div className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500"/>
              <span>Giao dịch an toàn & bảo mật thông tin cá nhân 100%</span>
            </div>
          </div>
        </div>
      </form>

      {/* 4. Modal Thông Báo Đặt Hàng Thành Công */}
      {donHangThanhCong && (<ModalDatHangThanhCong donHang={donHangThanhCong} onDong={() => setDonHangThanhCong(null)}/>)}
    </div>);
}
