'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { DanhMucService } from '@/services/danh-muc.service';

const THUONG_HIEU_MAC_DINH = [
  { ma_hang: 'asus', ten_hang: 'ASUS / ROG', khau_hieu: 'For Those Who Dare', quoc_gia: 'Đài Loan' },
  { ma_hang: 'lenovo', ten_hang: 'Lenovo Legion', khau_hieu: 'Smarter Technology for All', quoc_gia: 'Quốc tế' },
  { ma_hang: 'dell', ten_hang: 'Dell Alienware', khau_hieu: 'The Power to Do More', quoc_gia: 'Hoa Kỳ' },
  { ma_hang: 'apple', ten_hang: 'Apple MacBook', khau_hieu: 'Think Different - Apple Silicon', quoc_gia: 'Hoa Kỳ' },
  { ma_hang: 'msi', ten_hang: 'MSI Gaming', khau_hieu: 'True Gaming', quoc_gia: 'Đài Loan' },
  { ma_hang: 'acer', ten_hang: 'Acer Predator', khau_hieu: 'Explore Beyond Limits', quoc_gia: 'Đài Loan' },
  { ma_hang: 'hp', ten_hang: 'HP OMEN', khau_hieu: 'Keep Reinventing', quoc_gia: 'Hoa Kỳ' }
];

export default function PartnerEcosystem() {
  const [danhSachThuongHieu, setDanhSachThuongHieu] = useState(THUONG_HIEU_MAC_DINH);

  useEffect(() => {
    let daHuy = false;
    DanhMucService.layDanhSachThuongHieuAsync().then((data) => {
      if (!daHuy && Array.isArray(data) && data.length > 0) {
        const chuanHoa = data.map(item => ({
          ma_hang: item.ma_danh_muc || item.ma_hang || item.slug,
          ten_hang: item.ten_danh_muc || item.ten_hang,
          khau_hieu: item.mo_ta || item.khau_hieu || 'Đối tác chính hãng',
          quoc_gia: item.xuat_xu || item.quoc_gia || 'Chính Hãng'
        }));
        setDanhSachThuongHieu(chuanHoa);
      }
    });
    return () => { daHuy = true; };
  }, []);

  return (
    <section className="w-full py-8 sm:py-14 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0052cc] dark:text-cyan-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AUTHORIZED DISTRIBUTORS // TIER-1 GLOBAL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
            HỆ SINH THÁI ĐỐI TÁC TOÀN CẦU
          </h2>
        </div>
        <Link
          href="/san-pham"
          className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-[#0052cc] dark:text-cyan-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all self-start md:self-auto"
        >
          <span>Khám phá kho máy</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Modern High-End Brand Ecosystem Wall */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
        {danhSachThuongHieu.map((brand) => (
          <Link
            key={brand.ma_hang}
            href={`/san-pham?hang=${brand.ma_hang}`}
            className="group relative p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between min-h-[150px] overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-[#0052cc]/10 group-hover:text-[#0052cc] dark:group-hover:text-cyan-300 transition-colors">
                {brand.quoc_gia}
              </span>
              <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-cyan-400 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-950 transition-transform group-hover:scale-110" />
              </div>
            </div>

            <div className="space-y-1.5 pt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Tier-1 Official</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-[#0052cc] dark:group-hover:text-cyan-400 transition-colors">
                {brand.ten_hang}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-normal">
                {brand.khau_hieu}
              </p>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}
