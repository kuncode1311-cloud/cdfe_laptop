'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Cpu, Fan, HardDrive, Tv, Rotate3d, Activity, CheckCircle2 } from 'lucide-react';
export default function ShowcaseLinhKien3D() {
    const danhSachLinhKien = [
        {
            id: 'cpu-gpu',
            ten: 'CPU & GPU Đầu Bảng',
            icon: Cpu,
            anh: '/images/about-gpu-chip.jpg',
            tieuDe: 'Kiến Trúc Nhân Lai Hybrid + Ray Tracing Gen 3',
            thongSo: '24 Nhân / 32 Luồng • TGP 175W • 45 TOPS NPU AI',
            chiTiet: 'Kết hợp giữa Intel Core i9 Gen 14th cùng NVIDIA GeForce RTX 4090 mang lại sức mạnh tính toán siêu cấp cho cả gaming 4K và render AI cục bộ.',
            uuDiem: [
                'Xung nhịp Turbo Boost lên tới 5.8GHz',
                'Bộ nhớ VRAM 16GB GDDR6 băng thông cực đại',
                'Chip NPU xử lý trí tuệ nhân tạo riêng biệt',
                'Hỗ trợ DLSS 3.5 Frame Generation siêu mượt'
            ]
        },
        {
            id: 'tan-nhiet',
            ten: 'Tản Nhiệt Kim Loại Lỏng',
            icon: Fan,
            anh: '/images/about-cooling-fan.jpg',
            tieuDe: 'Buồng Hơi Vapor Chamber 3D + 3 Quạt Arc Flow Gen 2',
            thongSo: 'Giảm tới 15°C nhiệt độ CPU so với keo tản nhiệt truyền thống',
            chiTiet: 'Kim loại lỏng Thermal Grizzly Conductonaut Extreme truyền nhiệt tức thì tới buồng hơi bao phủ 100% linh kiện bo mạch chủ.',
            uuDiem: [
                'Cánh quạt mỏng 0.1mm tạo luồng gió êm ái dưới 35dB',
                'Khe tản nhiệt đồng 0.1mm tăng 30% diện tích thoát nhiệt',
                'Chống bụi tự làm sạch công nghệ Anti-Dust Tunnels',
                'Hoạt động 0dB Fanless ở tác vụ văn phòng cơ bản'
            ]
        },
        {
            id: 'ram-ssd',
            ten: 'RAM LPDDR5X & NVMe Gen 5',
            icon: HardDrive,
            anh: '/images/about-ram-module.jpg',
            tieuDe: 'Băng Thông Siêu Tốc 7467MHz + Đọc Ghi 14.000MB/s',
            thongSo: 'Khả năng nâng cấp lên tới 128GB RAM + 4TB SSD RAID 0',
            chiTiet: 'Không còn độ trễ khi mở hàng chục tab trình duyệt, nạp file thiết kế kiến trúc hàng chục Gigabyte hoặc dựng video 8K RAW.',
            uuDiem: [
                'Tốc độ đọc ghi nhanh gấp 2 lần chuẩn PCIe Gen 4',
                'Tản nhiệt nhôm Graphene chuyên dụng cho SSD',
                'Chuẩn RAM LPDDR5X tiết kiệm 20% điện năng',
                'Độ trễ thấp tối ưu hóa cho thi đấu thể thao điện tử'
            ]
        },
        {
            id: 'man-hinh',
            ten: 'Màn Hình Nebula Mini-LED',
            icon: Tv,
            anh: '/images/hero-3d-laptop.jpg',
            tieuDe: 'Tần Số Quét 240Hz • Độ Sáng 1100 Nits • 100% DCI-P3',
            thongSo: 'Độ tương phản 1.000.000:1 với hơn 2000 vùng làm tối cục bộ Dimming Zones',
            chiTiet: 'Chứng nhận chuẩn màu PANTONE Validated và Dolby Vision HDR mang lại trải nghiệm thị giác điện ảnh sống động không tì vết.',
            uuDiem: [
                'Thời gian phản hồi siêu tốc 0.2ms - 3ms triệt tiêu bóng mờ',
                'Công nghệ NVIDIA G-SYNC đồng bộ khung hình hoàn hảo',
                'Giảm 70% ánh sáng xanh bảo vệ mắt chứng nhận TÜV Rheinland',
                'Mặt kính chống chói Anti-Glare cao cấp'
            ]
        }
    ];
    const [linhKienChon, setLinhKienChon] = useState(danhSachLinhKien[0]);
    return (<section id="linh-kien-3d" className="w-full space-y-5 scroll-mt-20">
      {/* Tiêu đề mục 3D Showcase */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-cyan-400 text-[10.5px] font-black uppercase tracking-wider border border-blue-200/60 dark:border-blue-900/40">
          <Rotate3d className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400"/>
          <span>3D HARDWARE ARCHITECTURE</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          MỔ XẺ LINH KIỆN & CÔNG NGHỆ BÊN TRONG
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Khám phá cấu trúc phần cứng chuẩn quân đội tạo nên hiệu năng bền bỉ vượt thời gian
        </p>
      </div>

      {/* Tabs Chuyển Linh Kiện */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl max-w-2xl mx-auto border border-slate-200 dark:border-slate-800">
        {danhSachLinhKien.map((lk) => {
            const IconComp = lk.icon;
            const laChon = linhKienChon.id === lk.id;
            return (<button key={lk.id} onClick={() => setLinhKienChon(lk)} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${laChon
                    ? 'bg-white dark:bg-slate-800 text-[#0052cc] dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
              <IconComp className="w-3.5 h-3.5"/>
              <span>{lk.ten}</span>
            </button>);
        })}
      </div>

      {/* Bảng Hiển Thị Chi Tiết Linh Kiện Đang Chọn */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Ảnh minh họa linh kiện */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center group">
          <Image src={linhKienChon.anh} alt={linhKienChon.ten} fill className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"/>

          {/* Badge HUD trên ảnh */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white z-10">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700 backdrop-blur-md">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse"/>
              <span className="font-mono">{linhKienChon.thongSo}</span>
            </div>
          </div>
        </div>

        {/* Nội dung diễn giải chi tiết */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-extrabold uppercase text-sky-600 dark:text-cyan-400 tracking-wider">
              {linhKienChon.ten}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {linhKienChon.tieuDe}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {linhKienChon.chiTiet}
          </p>

          {/* Danh sách Ưu điểm cốt lõi */}
          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase">
              Đặc Điểm Vượt Trội:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {linhKienChon.uuDiem.map((ud, idx) => (<div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/>
                  <span className="font-medium">{ud}</span>
                </div>))}
            </div>
          </div>
        </div>
      </div>
    </section>);
}
