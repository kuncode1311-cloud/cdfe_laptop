'use client';

import React from 'react';
import Link from 'next/link';

import GioiThieuHero from '@/components/gioi-thieu/GioiThieuHero';
import ThongDiepSangLap from '@/components/gioi-thieu/ThongDiepSangLap';
import CauChuyenThuongHieu from '@/components/gioi-thieu/CauChuyenThuongHieu';
import HeThongShowroom from '@/components/gioi-thieu/HeThongShowroom';

export default function TrangGioiThieu() {
  return (
    <div className="space-y-4 sm:space-y-5 max-w-7xl mx-auto pb-0">
      
      {/* 1. Breadcrumb chuẩn dùng chung đồng bộ toàn bộ website (như /san-pham, /lien-he) */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
          <span>Trang Chủ</span>
        </Link>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-[#0052cc] dark:text-cyan-400">Giới Thiệu // TNTP LAPTOP</span>
      </nav>

      {/* 2. Hero Giới Thiệu Cửa Hàng & Thống Kê (Tone Sáng Chuẩn Đồng Bộ Trang Chủ, Vừa 1 Màn Hình) */}
      <GioiThieuHero />

      {/* 3. Đội Ngũ Sáng Lập & Ban Điều Hành (4 Nhân Sự Chủ Chốt TNTP) */}
      <ThongDiepSangLap />

      {/* 4. 4 Trụ Cột Cam Kết Dịch Vụ Vàng (Trí · Nhất · Tài · Phú) */}
      <CauChuyenThuongHieu />

      {/* 5. Hệ Thống Showroom Thực Tế & Đối Tác Ủy Quyền Tier-1 + CTA */}
      <HeThongShowroom />

    </div>
  );
}
