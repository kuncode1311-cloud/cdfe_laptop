'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Users, 
  Quote, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Briefcase,
  Layers
} from 'lucide-react';

// Dữ liệu 4 Nhà Sáng Lập - Đồng cấp chức vụ ngang nhau (C-Level Co-Founders)
const FOUNDERS = [
  {
    id: 'tri',
    kyHieu: 'T // TRÍ',
    hoTen: 'Lê Minh Trí',
    chucVu: 'ĐỒNG SÁNG LẬP // CEO',
    vaiTro: 'Giám Đốc Điều Hành & Chiến Lược',
    kinhNghiem: '12+ Năm',
    accentColor: 'text-cyan-400',
    badgeBg: 'bg-blue-500/20 text-cyan-300 border-cyan-500/30',
    topBorder: 'from-blue-600 via-cyan-500 to-sky-400',
    glowColor: 'group-hover:shadow-[0_15px_35px_rgba(6,182,212,0.25)]',
    borderColor: 'group-hover:border-cyan-400/60',
    trietLy: 'Công nghệ chỉ thực sự có giá trị khi mang lại sức mạnh khai phóng cho trí tuệ con người một cách minh bạch và chuẩn xác nhất.',
    chuyenMon: ['Chiến lược kinh doanh số', 'Đối tác quốc tế Tier-1', 'Đầu tư công nghệ cao'],
    anh: '/images/founder-tri.jpg'
  },
  {
    id: 'nhat',
    kyHieu: 'N // NHẤT',
    hoTen: 'Mai Thống Nhất',
    chucVu: 'ĐỒNG SÁNG LẬP // COO',
    vaiTro: 'Giám Đốc Vận Hành & Chuỗi Showroom',
    kinhNghiem: '11+ Năm',
    accentColor: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    topBorder: 'from-rose-600 via-pink-500 to-amber-400',
    glowColor: 'group-hover:shadow-[0_15px_35px_rgba(244,63,94,0.25)]',
    borderColor: 'group-hover:border-rose-400/60',
    trietLy: 'Sự hài lòng tuyệt đối của khách hàng là thước đo duy nhất cho thành công và sự phát triển bền vững của TNTP LAPTOP.',
    chuyenMon: ['Vận hành Showroom chuẩn hãng', 'Dịch vụ khách hàng VIP 5★', 'Cam kết 1 đổi 1 30 ngày'],
    anh: '/images/founder-nhat.jpg'
  },
  {
    id: 'tai',
    kyHieu: 'T // TÀI',
    hoTen: 'Âu Lê Thành Tài',
    chucVu: 'ĐỒNG SÁNG LẬP // CTO',
    vaiTro: 'Giám Đốc Công Nghệ & Phần Cứng',
    kinhNghiem: '10+ Năm',
    accentColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    topBorder: 'from-purple-600 via-indigo-500 to-pink-400',
    glowColor: 'group-hover:shadow-[0_15px_35px_rgba(168,85,247,0.25)]',
    borderColor: 'group-hover:border-purple-400/60',
    trietLy: 'Một chiếc laptop hoàn hảo là sự đồng bộ tuyệt đối về tản nhiệt, độ bền bo mạch và hiệu năng thực tế bền bỉ qua năm tháng.',
    chuyenMon: ['Kiểm chuẩn bo mạch 5 bước', 'Tản nhiệt buồng hơi 3D', 'Giải pháp AI PC 45+ TOPS'],
    anh: '/images/founder-tai.jpg'
  },
  {
    id: 'phu',
    kyHieu: 'P // PHÚ',
    hoTen: 'Lâm Đường Phú',
    chucVu: 'ĐỒNG SÁNG LẬP // CFO',
    vaiTro: 'Giám Đốc Tài Chính & Đầu Tư',
    kinhNghiem: '11+ Năm',
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    topBorder: 'from-emerald-600 via-teal-500 to-cyan-400',
    glowColor: 'group-hover:shadow-[0_15px_35px_rgba(16,185,129,0.25)]',
    borderColor: 'group-hover:border-emerald-400/60',
    trietLy: 'Tối ưu hoá nguồn lực tài chính để khách hàng tiếp cận công nghệ đỉnh cao với mức giá tối ưu và giải pháp trả góp 0% minh bạch.',
    chuyenMon: ['Hoạch định tài chính & trợ giá', 'Hợp tác 28 ngân hàng 0%', 'Phát triển mở rộng chuỗi'],
    anh: '/images/founder-phu.jpg'
  }
];

export default function ThongDiepSangLap() {
  const [activeFounder, setActiveFounder] = useState(FOUNDERS[0]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Hiệu ứng Canvas: Mạng lưới hạt công nghệ kết nối tương tác mượt mà
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Tạo các điểm node di chuyển nhẹ nhàng
    const numPoints = Math.min(32, Math.floor(width / 35));
    const points = Array.from({ length: numPoints }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 1
    }));

    let mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', onMouseMove);
      container.addEventListener('mouseleave', onMouseLeave);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Cập nhật và vẽ các hạt node
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Vẽ hạt sáng
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(2, 132, 199, 0.45)';
        ctx.fill();

        // Nối dây giữa các hạt gần nhau
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(2, 132, 199, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Tương tác khi di chuột gần hạt
        const mouseDist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (mouseDist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 * (1 - mouseDist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', onMouseMove);
        container.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, []);

  return (
    <section 
      id="doi-ngu-sang-lap" 
      ref={containerRef}
      className="relative w-full py-4 sm:py-6 space-y-4 sm:space-y-5 overflow-hidden"
    >
      
      {/* Canvas Nền Mạng Lưới Công Nghệ Tương Tác */}
      <canvas 
        ref={canvasRef} 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 w-full h-full opacity-60 z-0"
      />

      {/* 1. Header Tinh Gọn Vừa Vặn Khung Hình */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0052cc] text-[11px] font-black uppercase tracking-wider shadow-xs">
            <Users className="w-3.5 h-3.5" />
            <span>BAN ĐIỀU HÀNH // 4 ĐỒNG SÁNG LẬP TNTP</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black uppercase tracking-tight text-slate-900 leading-tight">
            NHỮNG CON NGƯỜI ĐẶT NỀN MÓNG{' '}
            <span className="text-[#0052cc]">
              CHO TIÊU CHUẨN TNTP LAPTOP.
            </span>
          </h2>
        </div>
        <p className="text-xs sm:text-[13px] text-slate-600 max-w-md leading-relaxed font-normal">
          Sự hợp lực của 4 trụ cột đồng cấp: <strong>Trí Tuệ</strong> chiến lược, <strong>Nhiệt Huyết</strong> vận hành, <strong>Tài Năng</strong> công nghệ và <strong>Phát Triển</strong> tài chính.
        </p>
      </div>

      {/* 2. Grid 4 Card Nhân Sự Gọn Gàng - Chuẩn 1 Màn Hình Với Hiệu Ứng Hover Slide-Up Thông Minh */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
        {FOUNDERS.map((f) => {
          const isActive = activeFounder?.id === f.id;

          return (
            <div
              key={f.id}
              onClick={() => setActiveFounder(f)}
              className={`group relative h-[370px] sm:h-[390px] lg:h-[410px] rounded-2xl overflow-hidden bg-slate-950 border transition-all duration-500 cursor-pointer flex flex-col justify-end shadow-md hover:-translate-y-1.5 ${f.glowColor} ${
                isActive 
                  ? 'border-[#0052cc] ring-2 ring-blue-400/30' 
                  : `border-slate-800 ${f.borderColor}`
              }`}
            >
              {/* Dải màu nhận diện trên nóc card */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${f.topBorder} z-30`} />

              {/* Ảnh Chân Dung Full Card Sắc Nét */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={f.anh}
                  alt={f.hoTen}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-95"
                />
                {/* Lớp gradient đổ bóng bảo vệ độ rõ nét của chữ */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              </div>

              {/* Tag Chữ Cái TNTP & Số Năm Kinh Nghiệm ở góc trên */}
              <div className="absolute top-3.5 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black tracking-widest uppercase border backdrop-blur-md shadow-md ${f.badgeBg}`}>
                  {f.kyHieu}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-200 text-[10px] font-bold border border-white/15 shadow-xs">
                  {f.kinhNghiem}
                </span>
              </div>

              {/* KHỐI NỘI DUNG MẶC ĐỊNH (Luôn thấy được chân dung và tên tuổi) */}
              <div className="relative z-10 p-4 space-y-1 transition-all duration-300 group-hover:opacity-0 group-hover:pointer-events-none">
                <div className={`text-[11px] font-black uppercase tracking-wider ${f.accentColor}`}>
                  {f.chucVu}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                  {f.hoTen}
                </h3>
                <p className="text-[11.5px] text-slate-300 font-medium truncate">
                  {f.vaiTro}
                </p>
                <div className="pt-1.5 flex items-center gap-1 text-[10.5px] text-cyan-300/90 font-bold">
                  <span>Rê chuột xem chi tiết</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* KHỐI SLIDE-UP THÔNG TIN KHI HOVER (Trượt lên mượt mà che phủ phần dưới) */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-4 sm:p-4.5 bg-slate-950/92 backdrop-blur-md border-t border-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out space-y-2.5">
                
                {/* Header trong popup hover */}
                <div>
                  <div className={`text-[10.5px] font-black uppercase tracking-wider ${f.accentColor}`}>
                    {f.chucVu}
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                    {f.hoTen}
                  </h4>
                  <p className="text-[11px] text-slate-300 font-medium leading-snug">
                    {f.vaiTro}
                  </p>
                </div>

                {/* Trích dẫn triết lý súc tích */}
                <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-[11px] text-slate-200 leading-relaxed italic relative">
                  <Quote className="w-3 h-3 text-cyan-400 absolute top-1.5 right-1.5 opacity-60" />
                  <p className="line-clamp-3">&ldquo;{f.trietLy}&rdquo;</p>
                </div>

                {/* Danh sách 3 chuyên môn cốt lõi */}
                <div className="space-y-1">
                  <div className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="w-2.5 h-2.5 text-cyan-400" />
                    <span>Trọng tâm phụ trách</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {f.chuyenMon.map((cm, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white/[0.08] text-[10px] font-medium text-slate-200 border border-white/5"
                      >
                        {cm}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Badge cam kết bảo chứng */}
                <div className="pt-1 flex items-center justify-between text-[10px] text-emerald-400 font-bold border-t border-white/10 pt-2">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Bảo chứng tiêu chuẩn TNTP
                  </span>
                  <span className="text-slate-400 font-medium">TNTP 2026</span>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}

