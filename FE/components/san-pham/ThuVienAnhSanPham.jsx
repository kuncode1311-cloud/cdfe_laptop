'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Play, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ThuVienAnhSanPham({ danhSachAnh, tenSanPham, videoDemo, anhDaiDienTuyChon }) {
    const listGoc = Array.isArray(danhSachAnh) && danhSachAnh.length > 0 ? danhSachAnh : ['/images/sp/tai_nghe_gaming_pro_v8.jpg'];
    const [list, setList] = useState(listGoc);
    const [anhDangChon, setAnhDangChon] = useState(listGoc[0]);
    const [dangXemVideo, setDangXemVideo] = useState(false);
    const [dangPhongTo, setDangPhongTo] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (dangPhongTo) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [dangPhongTo]);

    // Đồng bộ danh sách ảnh khi danhSachAnh thay đổi
    useEffect(() => {
        if (Array.isArray(danhSachAnh) && danhSachAnh.length > 0) {
            setList(danhSachAnh);
            if (!anhDaiDienTuyChon) {
                setAnhDangChon(danhSachAnh[0]);
            }
        }
    }, [danhSachAnh, anhDaiDienTuyChon]);

    // Bấm vào phiên bản màu khác -> đổi hình ảnh realtime ngay lập tức!
    useEffect(() => {
        if (anhDaiDienTuyChon) {
            setDangXemVideo(false);
            setAnhDangChon(anhDaiDienTuyChon);
            // Nếu ảnh màu chưa có trong dải thumbnail, bổ sung vào đầu danh sách
            setList((prev) => {
                if (!prev.includes(anhDaiDienTuyChon)) {
                    return [anhDaiDienTuyChon, ...prev];
                }
                return prev;
            });
        }
    }, [anhDaiDienTuyChon]);

    // Xử lý phím Escape để đóng modal phóng to
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setDangPhongTo(false);
        };
        if (dangPhongTo) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dangPhongTo]);

    const viTriHienTai = list.indexOf(anhDangChon);
    const chuyenAnhTruoc = (e) => {
        e?.stopPropagation();
        const prevIdx = viTriHienTai > 0 ? viTriHienTai - 1 : list.length - 1;
        setAnhDangChon(list[prevIdx]);
    };
    const chuyenAnhKe = (e) => {
        e?.stopPropagation();
        const nextIdx = viTriHienTai < list.length - 1 ? viTriHienTai + 1 : 0;
        setAnhDangChon(list[nextIdx]);
    };

    return (
        <div className="space-y-3">
            {/* 1. Khung Hiển Thị Chính (Main Showcase) */}
            <div
                onClick={() => !dangXemVideo && setDangPhongTo(true)}
                className="relative w-full h-72 sm:h-[390px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden flex items-center justify-center p-4 shadow-2xs group cursor-zoom-in"
                title="Bấm để phóng to xem chi tiết sắc nét"
            >
                {/* Huy hiệu chính hãng */}
                <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-[#0052cc] dark:text-cyan-400 font-extrabold text-[10.5px] uppercase tracking-wider">
                    Chính Hãng TNTP
                </span>

                {/* Nút Phóng To Góc Phải */}
                {!dangXemVideo && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDangPhongTo(true);
                        }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#0052cc] hover:scale-110 transition-all cursor-pointer"
                        title="Phóng to ảnh"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                )}

                {dangXemVideo && videoDemo ? (
                    <video src={videoDemo} controls autoPlay loop className="w-full h-full object-contain rounded-xl" />
                ) : (
                    <div className="relative w-full h-full">
                        <Image
                            src={anhDangChon || list[0]}
                            alt={tenSanPham || 'Ảnh sản phẩm'}
                            fill
                            priority
                            unoptimized
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                )}
            </div>

            {/* 2. Dải Ảnh Thumbnail Thu Nhỏ */}
            <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 scrollbar-thin">
                {list.map((src, idx) => {
                    const laChon = !dangXemVideo && anhDangChon === src;
                    return (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                setDangXemVideo(false);
                                setAnhDangChon(src);
                            }}
                            className={`relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 cursor-pointer bg-white dark:bg-slate-900 p-1 ${
                                laChon
                                    ? 'border-[#0052cc] dark:border-cyan-400 ring-2 ring-blue-500/30 shadow-md translate-y-[-1px]'
                                    : 'border-slate-200 dark:border-slate-800 opacity-75 hover:opacity-100 hover:border-blue-400 dark:hover:border-cyan-400 hover:shadow-xs'
                            }`}
                        >
                            <Image src={src} alt={`${tenSanPham} thumb ${idx}`} fill unoptimized className="object-contain p-0.5" />
                        </button>
                    );
                })}

                {/* Nút Xem Video 3D Teaser nếu có */}
                {videoDemo && (
                    <button
                        type="button"
                        onClick={() => setDangXemVideo(true)}
                        className={`relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 cursor-pointer bg-slate-950 flex flex-col items-center justify-center text-white ${
                            dangXemVideo ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-md translate-y-[-1px]' : 'border-slate-800 opacity-80 hover:opacity-100 hover:border-cyan-400'
                        }`}
                    >
                        <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                        <span className="text-[9px] font-bold mt-0.5 uppercase">Video 3D</span>
                    </button>
                )}
            </div>

            {/* 3. Modal Lightbox Phóng To Xem Ảnh Siêu Nét Trực Quan */}
            {dangPhongTo && mounted && typeof document !== 'undefined' && createPortal(
                <div
                    onClick={() => setDangPhongTo(false)}
                    className="fixed inset-0 z-[999999] w-screen h-screen bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', margin: 0 }}
                >
                    {/* Header Lightbox */}
                    <div className="flex items-center justify-between z-10">
                        <div className="text-white space-y-0.5">
                            <h3 className="font-extrabold text-sm sm:text-base line-clamp-1">
                                {tenSanPham}
                            </h3>
                            <p className="text-xs text-slate-400 font-mono">
                                Hình {viTriHienTai + 1} / {list.length}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setDangPhongTo(false)}
                            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
                            title="Đóng (Esc)"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Vùng Ảnh Lớn Chính Giữa (Chuẩn tỉ lệ, không bị cắt xén) */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl h-[65vh] sm:h-[72vh] mx-auto flex items-center justify-center my-auto"
                    >
                        <Image
                            src={anhDangChon || list[0]}
                            alt={tenSanPham}
                            fill
                            unoptimized
                            className="object-contain"
                            priority
                        />

                        {/* Nút Prev */}
                        {list.length > 1 && (
                            <button
                                type="button"
                                onClick={chuyenAnhTruoc}
                                className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#0052cc] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
                                title="Ảnh trước"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* Nút Next */}
                        {list.length > 1 && (
                            <button
                                type="button"
                                onClick={chuyenAnhKe}
                                className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-[#0052cc] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
                                title="Ảnh sau"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Dải Thumbnail Bên Dưới Modal */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 max-w-xl mx-auto"
                    >
                        {list.map((src, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setAnhDangChon(src)}
                                className={`relative w-14 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer p-0.5 bg-slate-900 ${
                                    anhDangChon === src
                                        ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                                        : 'border-white/30 opacity-60 hover:opacity-100'
                                }`}
                            >
                                <Image src={src} alt="thumb" fill unoptimized className="object-contain" />
                            </button>
                        ))}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
