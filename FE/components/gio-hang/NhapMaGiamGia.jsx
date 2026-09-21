'use client';
import React, { useState, useEffect } from 'react';
import { Check, Ticket } from 'lucide-react';
import { useCart, useGioHang } from '@/contexts/CartContext';
import { MaGiamGiaService } from '@/services/ma-giam-gia.service';
import { formatCurrency, dinhDangTienVND } from '@/utils/formatCurrency';
export default function NhapMaGiamGia() {
    const { gio_hang, apDungVoucher, huyVoucher } = useGioHang();
    const [maNhap, setMaNhap] = useState('');
    const [danhSachVoucher, setDanhSachVoucher] = useState(() => MaGiamGiaService.layDanhSachMaGiamGia());

    useEffect(() => {
        let daHuy = false;
        MaGiamGiaService.layDanhSachMaGiamGiaAsync().then((data) => {
            if (!daHuy && Array.isArray(data) && data.length > 0) {
                setDanhSachVoucher(data);
            }
        });
        return () => { daHuy = true; };
    }, []);

    const xuLyApDung = async (e) => {
        e.preventDefault();
        if (maNhap.trim()) {
            await apDungVoucher(maNhap.trim());
        }
    };
    const apDungNhanh = async (code) => {
        setMaNhap(code);
        await apDungVoucher(code);
    };
    return (<div className="space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
        <Ticket className="w-4 h-4 text-sky-500 dark:text-cyan-400"/>
        <span>MÃ KHUYẾN MÃI / VOUCHER</span>
      </div>

      {/* Form Nhập Mã */}
      {gio_hang.ma_giam_gia_da_dung ? (<div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500"/>
            <div>
              <div className="font-bold text-emerald-800 dark:text-emerald-300">
                Mã &quot;{gio_hang.ma_giam_gia_da_dung}&quot; đang kích hoạt
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Đã giảm {dinhDangTienVND(gio_hang.tien_giam_gia)} vào đơn hàng
              </div>
            </div>
          </div>
          <button onClick={huyVoucher} className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 hover:text-red-500 text-xs font-semibold cursor-pointer border border-emerald-200 dark:border-emerald-800">
            Hủy mã
          </button>
        </div>) : (<form onSubmit={xuLyApDung} className="flex gap-2">
          <input type="text" value={maNhap} onChange={(e) => setMaNhap(e.target.value)} placeholder="Nhập mã: LAPTOPNEW10, GAMING2026..." className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white uppercase font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"/>
          <button type="submit" className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-bold transition-colors cursor-pointer shrink-0">
            Áp Dụng
          </button>
        </form>)}

      {/* Danh Sách Voucher Có Thể Dùng Nhanh */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className="text-[11px] font-bold text-slate-400 uppercase">
          Voucher Gợi Ý Cho Bạn:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {danhSachVoucher.slice(0, 4).map((vc) => (<button key={vc.ma_code} type="button" onClick={() => apDungNhanh(vc.ma_code)} className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-dashed border-sky-300 dark:border-cyan-500/40 text-left hover:border-sky-500 dark:hover:border-cyan-400 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-sky-600 dark:text-cyan-400">
                  {vc.ma_code}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-200">
                  Nhấn để áp dụng
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {vc.mo_ta}
              </p>
            </button>))}
        </div>
      </div>
    </div>);
}
