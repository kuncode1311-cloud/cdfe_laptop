'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ArrowRight, Truck, ShieldCheck, Gift } from 'lucide-react';
import TheSanPham from '@/components/san-pham/TheSanPham';
import { SanPhamService } from '@/services/san-pham.service';

import { CaiDatService } from '@/services/cai-dat.service';
import { useDuLieuMoi } from '@/services/dong-bo.service';

export default function FlashSaleDemNguoc({ danhSachSanPham }) {
    const [danhSach, setDanhSach] = useState(danhSachSanPham || []);
    const [dangTai, setDangTai] = useState(!danhSachSanPham || danhSachSanPham.length === 0);
    const [caiDat, setCaiDat] = useState(() => CaiDatService.layCaiDatKhuyenMai());

    // Lắng nghe cập nhật realtime từ Admin tab Khuyến Mãi
    useEffect(() => {
        const handleCapNhat = (e) => {
            if (e.detail) setCaiDat(e.detail);
        };
        window.addEventListener('tntp_khuyen_mai_cap_nhat', handleCapNhat);
        return () => window.removeEventListener('tntp_khuyen_mai_cap_nhat', handleCapNhat);
    }, []);

    // Nạp danh sách Flash Sale từ MongoDB Atlas qua API
    const phienBanDuLieu = useDuLieuMoi('san_pham');
    useEffect(() => {
        if (!danhSachSanPham) {
            let daHuy = false;
            // Kiểm tra cache nếu đã có
            const cache = SanPhamService.layDanhSachFlashSale();
            if (cache && cache.length > 0) {
                setDanhSach(cache);
                setDangTai(false);
            }

            SanPhamService.layTatCaSanPhamAsync({ flash_sale: true }).then((data) => {
                if (!daHuy && Array.isArray(data) && data.length > 0) {
                    const danhSachSale = data.filter(sp => sp.la_flash_sale);
                    setDanhSach(danhSachSale.length > 0 ? danhSachSale : data);
                }
                if (!daHuy) setDangTai(false);
            }).catch(() => {
                if (!daHuy) setDangTai(false);
            });
            return () => { daHuy = true; };
        }
    }, [danhSachSanPham, phienBanDuLieu]);

    // Hàm tính toán thời gian đếm ngược còn lại
    const tinhThoiGianConLai = (thoiGianKetThuc) => {
        let target = thoiGianKetThuc ? new Date(thoiGianKetThuc).getTime() : NaN;
        if (isNaN(target)) {
            const cuoiNgay = new Date();
            cuoiNgay.setHours(23, 59, 59, 999);
            target = cuoiNgay.getTime();
        }
        const diff = target - Date.now();
        if (diff > 0) {
            return {
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((diff % (1000 * 60)) / 1000)
            };
        }
        return { d: 0, h: 0, m: 0, s: 0 };
    };

    // Đồng hồ đếm ngược Flash Sale đồng bộ với Admin Cài Đặt Khuyến Mãi
    const [thoiGian, setThoiGian] = useState(() => tinhThoiGianConLai(caiDat?.thoi_gian_ket_thuc));

    useEffect(() => {
        const capNhatDongHo = () => {
            setThoiGian(tinhThoiGianConLai(caiDat?.thoi_gian_ket_thuc));
        };

        capNhatDongHo();
        const timer = setInterval(capNhatDongHo, 1000);
        return () => clearInterval(timer);
    }, [caiDat?.thoi_gian_ket_thuc]);

    // Luôn hiển thị cả Ngày, Giờ, Phút, Giây để số giây nhảy lùi liên tục từng giây (Realtime)
    const coDemNgay = thoiGian.d > 0;
    const donViDemNguoc = coDemNgay
        ? [
            { val: thoiGian.d, nhan: 'Ngày' },
            { val: thoiGian.h, nhan: 'Giờ' },
            { val: thoiGian.m, nhan: 'Phút' },
            { val: thoiGian.s, nhan: 'Giây' }
          ]
        : [
            { val: thoiGian.h, nhan: 'Giờ' },
            { val: thoiGian.m, nhan: 'Phút' },
            { val: thoiGian.s, nhan: 'Giây' }
          ];

    if (danhSach.length === 0 && !dangTai) return null;

    return (
        <section id="flash-sale" className="w-full">
            {/* ========================================================================= */}
            {/* 1. HERO BANNER FLASH SALE (Vivid Red-Coral-Orange Gradient & 3D Glass Art)*/}
            {/* ========================================================================= */}
            <div className="relative w-full rounded-2xl sm:rounded-[24px] overflow-hidden text-white shadow-[0_20px_45px_-12px_rgba(235,30,45,0.45)] border border-white/30 min-h-[200px] lg:h-[245px] flex items-center p-4 sm:px-8 sm:py-6 bg-gradient-to-r from-[#D00A24] via-[#EB2818] to-[#F55208]">
                {/* LỚP NỀN 3D PANORAMIC */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/flash_sale_vivid_bright.jpg"
                        alt="Flash Sale TNTP Laptop"
                        fill
                        priority
                        unoptimized
                        className="object-cover object-center"
                    />
                    {/* Lớp phủ tương phản cao (Dark Contrast Veil) giúp toàn bộ chữ trắng sắc nét tuyệt đối */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8f0010]/85 via-[#9c0618]/75 to-[#500008]/90 pointer-events-none" />
                </div>

                {/* NỘI DUNG 3 KHU VỰC: LEFT (48%) - CENTER ART (24%) - RIGHT COUNTDOWN (28%) */}
                <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
                    {/* CỘT TRÁI (~48%): Heading 3D, Subtitle & 3 Benefits */}
                    <div className="space-y-2 lg:w-[48%] text-center lg:text-left">
                        {/* Small Badge: ƯU ĐÃI CÓ HẠN */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] sm:text-[12.5px] font-bold uppercase tracking-wider shadow-sm">
                            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{caiDat?.badge_noi_bat || 'ƯU ĐÃI CÓ HẠN'}</span>
                        </div>

                        {/* Heading Display Typography 3D chuẩn promotional electronics */}
                        <div>
                            <h2 className="text-3xl sm:text-5xl lg:text-[58px] xl:text-[62px] font-black italic uppercase tracking-tighter text-white [text-shadow:_0_2px_0_#800010,_0_4px_0_#50000a,_0_6px_14px_rgba(0,0,0,0.7)] leading-none select-none">
                                FLASH SALE
                            </h2>
                            <p className="text-[13px] sm:text-[16px] font-black text-amber-200 sm:text-white uppercase tracking-wide mt-1.5 [text-shadow:_0_2px_6px_rgba(0,0,0,0.8)]">
                                {caiDat?.phu_de || 'SĂN DEAL CỰC SỐC - GIÁ TỐT NHẤT NĂM'}
                            </p>
                        </div>

                        {/* 3 Benefits bọc Pill trong suốt có viền, tự xuống dòng không bị cắt chữ */}
                        <div className="pt-1.5 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2.5 text-white text-[10.5px] sm:text-[12.5px] font-bold">
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-md shadow-xs">
                                <Truck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                                <span>Miễn phí vận chuyển</span>
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-md shadow-xs">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                                <span>Bảo hành chính hãng 3 năm</span>
                            </div>
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-md shadow-xs">
                                <Gift className="w-3.5 h-3.5 text-rose-300 shrink-0" />
                                <span>Quà tặng hấp dẫn</span>
                            </div>
                        </div>
                    </div>

                    {/* CỘT GIỮA: Khoảng thở tự nhiên */}
                    <div className="hidden lg:block lg:w-[20%]" />

                    {/* CỘT PHẢI: COUNTDOWN BOXES & CTA PILL BUTTON */}
                    <div className="flex flex-col items-center lg:items-end gap-2.5 sm:gap-3 lg:w-auto shrink-0">
                        <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-wider text-amber-200 [text-shadow:_0_2px_4px_rgba(0,0,0,0.6)]">
                            KẾT THÚC TRONG
                        </span>

                        {/* Countdown boxes — dùng chung donViDemNguoc */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {donViDemNguoc.map((dv, i) => (
                                <React.Fragment key={dv.nhan}>
                                    <div className="flex flex-col items-center gap-0.5 sm:gap-1.5">
                                        <div className={`relative ${coDemNgay ? 'w-[42px] h-[42px] sm:w-[56px] sm:h-[56px]' : 'w-[48px] h-[48px] sm:w-[64px] sm:h-[64px]'} bg-gradient-to-b from-[#4a0008]/95 via-[#300005]/95 to-[#1a0003]/98 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/30 flex items-center justify-center text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_8px_18px_rgba(0,0,0,0.45)] overflow-hidden`}>
                                            <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                            <span className={`${coDemNgay ? 'text-[19px] sm:text-[26px]' : 'text-[23px] sm:text-[32px]'} font-black tracking-tight tabular-nums leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
                                                {dv.val.toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                        <span className="text-[9.5px] sm:text-[11px] text-amber-200/90 font-bold uppercase tracking-wider drop-shadow-xs">{dv.nhan}</span>
                                    </div>
                                    {i < donViDemNguoc.length - 1 && (
                                        <span className={`text-white font-black ${coDemNgay ? 'text-base sm:text-xl pb-3 sm:pb-5' : 'text-xl pb-4 sm:pb-6'} drop-shadow-sm select-none`}>
                                            :
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* CTA White Pill Button */}
                        <a
                            href="#danh-sach-flash-sale"
                            className="mt-0.5 group w-[200px] sm:w-[240px] h-[42px] sm:h-[48px] rounded-full bg-white hover:bg-slate-50 text-[#D31828] font-black text-[14px] sm:text-[16px] uppercase tracking-wider shadow-[0_8px_20px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.45)] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border border-white/60"
                        >
                            <span>SĂN DEAL NGAY</span>
                            <ArrowRight className="w-4 h-4 text-[#D31828] group-hover:translate-x-1.5 transition-transform duration-200" />
                        </a>
                    </div>
                </div>
            </div>


            {/* ========================================================================= */}
            {/* 2. SECTION HEADING (Khoảng cách mt-7 banner -> title, mt-4 title -> cards) */}
            {/* ========================================================================= */}
            <div id="danh-sach-flash-sale" className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                    <h3 className="text-2xl sm:text-[26px] font-black text-[#0F172A] dark:text-white uppercase tracking-tight flex items-center gap-2.5">
                        <Flame className="w-6 h-6 fill-[#E11D48] text-[#E11D48]" />
                        <span>SẢN PHẨM FLASH SALE</span>
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-[#64748B] dark:text-slate-400 mt-1 font-normal">
                        Số lượng có hạn – Đừng bỏ lỡ cơ hội sở hữu laptop với giá cực tốt!
                    </p>
                </div>

                <Link
                    href="/khuyen-mai"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0052cc] hover:text-[#003da5] dark:text-cyan-400 hover:underline transition-colors shrink-0"
                >
                    <span>Xem tất cả</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* ========================================================================= */}
            {/* 3. 4 COMPACT PRODUCT CARDS (Gap 18px, Card height ~410-430px)             */}
            {/* ========================================================================= */}
            <div className="mt-3.5 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
                {dangTai ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3 h-[410px]">
                            <div className="w-full h-48 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mt-4"></div>
                        </div>
                    ))
                ) : (
                    danhSach.slice(0, 4).map((sp) => (
                        <TheSanPham
                            key={sp.id || sp._id}
                            sanPham={sp}
                            cheDoHienThi="luoi"
                            hienThiThanhFlashSale={true}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
