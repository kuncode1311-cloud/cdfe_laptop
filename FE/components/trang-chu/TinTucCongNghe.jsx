'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Newspaper, Clock, Eye, Calendar, Sparkles, Flame } from 'lucide-react';
import { TinTucService } from '@/services/tin-tuc.service';
import { slugTinTuc } from '@/utils/taoSlug';

const DANH_MUC_TIN = [
    'TẤT CẢ',
    'TƯ VẤN MUA SẮM',
    'XU HƯỚNG CÔNG NGHỆ',
    'ĐÁNH GIÁ & SO SÁNH'
];

// Bảng màu rực rỡ, sắc nét cho từng chuyên mục công nghệ
const layMauChuyenMuc = (chuyenMuc) => {
    const cm = chuyenMuc?.toLowerCase() || '';
    if (cm.includes('đánh giá') || cm.includes('so sánh')) {
        return {
            badge: 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white shadow-sm shadow-purple-500/25 border-purple-300/30',
            bgNhe: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
            glow: 'group-hover:border-purple-500/60 group-hover:shadow-purple-500/10'
        };
    }
    if (cm.includes('xu hướng') || cm.includes('ai')) {
        return {
            badge: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-sm shadow-emerald-500/25 border-emerald-300/30',
            bgNhe: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
            glow: 'group-hover:border-emerald-500/60 group-hover:shadow-emerald-500/10'
        };
    }
    if (cm.includes('tư vấn') || cm.includes('kinh nghiệm')) {
        return {
            badge: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white shadow-sm shadow-orange-500/25 border-amber-300/30',
            bgNhe: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
            glow: 'group-hover:border-amber-500/60 group-hover:shadow-amber-500/10'
        };
    }
    return {
        badge: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-sm shadow-blue-500/25 border-cyan-300/30',
        bgNhe: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-cyan-300 border-blue-200 dark:border-blue-800/60',
        glow: 'group-hover:border-blue-500/60 group-hover:shadow-blue-500/10'
    };
};

/**
 * Component Tin Tức & Review Công Nghệ - Phiên Bản Tinh Hoa Tech Magazine
 * - Bố trí: Lưới 4 Card Công Nghệ Cân Xứng 100%, loại bỏ hoàn toàn khoảng trắng thô thừa mứa bên trái.
 * - Khung nền cao cấp độc lập (Card tách biệt hoàn toàn khỏi màu body, không lo tệp màu).
 * - Màu sắc rực rỡ, badge phát quang, typography sắc sảo, hover mượt mà.
 * - Dữ liệu lấy trực tiếp 100% từ MongoDB Atlas qua TinTucService.
 */
export default function TinTucCongNghe() {
    const [chuyenMucChon, setChuyenMucChon] = useState('TẤT CẢ');
    const [danhSachTin, setDanhSachTin] = useState([]);
    const [dangTai, setDangTai] = useState(true);

    // Nạp dữ liệu tin tức thời gian thực từ MongoDB Atlas
    useEffect(() => {
        let daHuy = false;
        TinTucService.layDanhSachTinTucAsync().then((data) => {
            if (!daHuy && Array.isArray(data) && data.length > 0) {
                setDanhSachTin(data);
            }
            if (!daHuy) setDangTai(false);
        }).catch(() => {
            if (!daHuy) setDangTai(false);
        });
        return () => { daHuy = true; };
    }, []);

    // Lọc danh sách tin tức theo chuyên mục đã chọn
    const danhSachHienThi = chuyenMucChon === 'TẤT CẢ'
        ? danhSachTin
        : danhSachTin.filter(tin =>
            tin.chuyen_muc?.toLowerCase() === chuyenMucChon.toLowerCase()
        );

    // Lấy đúng 4 bài viết để hiển thị trên 1 hàng 4 cột cân xứng hoàn hảo
    const bonBaiViet = danhSachHienThi.slice(0, 4);

    return (
        <section className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.06)] space-y-5">
            {/* 1. Header Khối & Thanh Điều Hướng Chuyên Mục Đa Sắc */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30 font-black">
                            <Newspaper className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                TIN TỨC CÔNG NGHỆ & REVIEW
                            </h2>
                            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-black bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                                <Flame className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
                                2026 HOT
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-10.5">
                        Cập nhật xu hướng laptop gaming, giải mã công nghệ phần cứng và tư vấn chọn mua chuyên sâu
                    </p>
                </div>

                {/* Danh Mục Tabs & Link Xem Tất Cả */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {DANH_MUC_TIN.map((cm) => {
                        const dangChon = chuyenMucChon === cm;
                        return (
                            <button
                                key={cm}
                                onClick={() => setChuyenMucChon(cm)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                                    dangChon
                                        ? 'bg-gradient-to-r from-[#0052cc] to-blue-700 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
                                        : 'bg-slate-100/90 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-transparent'
                                }`}
                            >
                                {cm}
                            </button>
                        );
                    })}

                    <Link
                        href="/tin-tuc"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#0052cc] dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center gap-1 shrink-0 transition-colors border border-blue-200/60 dark:border-blue-900/50"
                    >
                        <span>Xem tất cả</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* 2. Lưới 4 Card Công Nghệ Chuẩn Mực - Cân Xứng Tuyệt Đối, Không Thừa Mứa Bố Cục */}
            {dangTai ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-72 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-800"></div>
                    ))}
                </div>
            ) : bonBaiViet.length === 0 ? (
                <div className="text-center py-10 text-slate-500">Chưa có bài viết nào trong chuyên mục này.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {bonBaiViet.map((tin, index) => {
                        const mau = layMauChuyenMuc(tin.chuyen_muc);
                        const laTieuDiem = tin.la_tieu_diem || index === 0;

                        return (
                            <Link
                                key={tin.id || tin._id}
                                href={`/tin-tuc/${slugTinTuc(tin)}`}
                                className={`group bg-slate-50/70 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800/90 rounded-2xl border border-slate-200/90 dark:border-slate-750 hover:border-blue-500/60 dark:hover:border-cyan-400 hover:shadow-[0_16px_35px_-8px_rgba(0,82,204,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative`}
                            >
                                <div>
                                    {/* Khung ảnh bài viết 16:10 sắc nét */}
                                    <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden">
                                        <Image
                                            src={tin.hinh_anh}
                                            alt={tin.tieu_de}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                                        {/* Tag Chuyên Mục Đa Sắc Rực Rỡ */}
                                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                            <span className={`px-2 py-0.5 rounded-lg ${mau.badge} text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 backdrop-blur-md`}>
                                                {laTieuDiem ? <Sparkles className="w-2.5 h-2.5 text-amber-300" /> : null}
                                                <span>{tin.chuyen_muc || 'Công Nghệ'}</span>
                                            </span>
                                        </div>

                                        {/* Tag Tiêu Điểm nếu có */}
                                        {laTieuDiem && (
                                            <div className="absolute top-2.5 right-2.5">
                                                <span className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[9.5px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                                                    <Flame className="w-2.5 h-2.5" />
                                                    <span>HOT</span>
                                                </span>
                                            </div>
                                        )}

                                        {/* Thời gian đọc ở góc dưới ảnh */}
                                        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-white text-[10px] font-semibold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                                            <Clock className="w-3 h-3 text-amber-300" />
                                            <span>{tin.thoi_gian_doc || '4 phút đọc'}</span>
                                        </div>
                                    </div>

                                    {/* Nội dung bài viết: Tiêu đề + Tóm tắt gọn gàng */}
                                    <div className="p-3.5 space-y-1.5">
                                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                            <span className="flex items-center gap-1 font-medium">
                                                <Calendar className="w-3 h-3 text-blue-500" />
                                                <span>{tin.ngay_dang}</span>
                                            </span>
                                            {tin.luot_xem > 0 && (
                                                <span className="flex items-center gap-1 font-medium ml-auto">
                                                    <Eye className="w-3 h-3 text-emerald-500" />
                                                    <span>{tin.luot_xem}</span>
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug min-h-[36px]" title={tin.tieu_de}>
                                            {tin.tieu_de}
                                        </h3>

                                        <p className="text-[11.5px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[34px]">
                                            {tin.tom_tat}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Card: Tác giả & Link Xem Chi Tiết (100% hiển thị đủ chữ) */}
                                <div className="p-3.5 pt-0">
                                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2">
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                                            ✍️ {tin.tac_gia?.replace(/Chuyên Gia Công Nghệ.*/i, 'Chuyên gia TNTP')?.replace(/TNT Laptop/gi, 'TNTP')?.replace(/TNT/gi, 'TNTP') || 'Ban Biên Tập'}
                                        </span>
                                        <div className="flex items-center gap-1 text-[11.5px] text-[#0052cc] dark:text-cyan-400 font-bold group-hover:translate-x-1 transition-transform shrink-0">
                                            <span>Đọc tiếp</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
