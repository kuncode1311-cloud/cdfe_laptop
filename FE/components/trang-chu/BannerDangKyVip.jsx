'use client';
import React, { useState } from 'react';
import { Gift, Sparkles, CheckCircle2, Copy, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BannerDangKyVip() {
    const [email, setEmail] = useState('');
    const [daDangKy, setDaDangKy] = useState(false);
    const [daCopy, setDaCopy] = useState(false);
    const [loi, setLoi] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@') || !email.includes('.')) {
            setLoi('Vui lòng nhập đúng định dạng email (ví dụ: khachhang@gmail.com)');
            return;
        }
        setLoi('');
        setDaDangKy(true);
    };

    const handleCopyMa = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText('TNTPVIP500K');
            setDaCopy(true);
            setTimeout(() => setDaCopy(false), 2500);
        }
    };

    return (
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0052cc] via-[#0062e6] to-[#0284c7] border-2 border-blue-300/40 shadow-[0_20px_60px_-15px_rgba(0,82,204,0.4)] p-6 sm:p-8 lg:p-10 text-white my-2 sm:my-4">
            {/* Vầng hào quang ánh sáng phản quang nổi bật */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:18px_18px] opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Cột Trái: Thông điệp quà tặng độc quyền - CHỮ TRẮNG & VÀNG SÁNG RỰC RỠ */}
                <div className="space-y-3.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10.5px] font-black uppercase tracking-wider shadow-xs border border-white/30 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                            ĐẶC QUYỀN THÀNH VIÊN TNTP VIP
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-300 text-amber-950 text-[10px] font-black flex items-center gap-1 shadow-sm">
                            <Gift className="w-3 h-3 text-amber-950" />
                            GIẢM 500.000Đ
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black tracking-tight leading-snug uppercase !text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                        Gia Nhập VIP Club – Nhận Ngay{' '}
                        <span className="text-[#FFE500] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] block sm:inline">
                            Voucher 500.000đ
                        </span>
                    </h2>

                    <p className="text-xs sm:text-[13.5px] text-white/95 leading-relaxed font-medium [text-shadow:_0_1px_2px_rgba(0,0,0,0.2)]">
                        Đăng ký nhận mã giảm giá 500.000đ áp dụng cho mọi laptop chính hãng, đặc quyền trải nghiệm sớm máy mới tại 3 Showroom và nhận thông báo Flash Sale trước 2 giờ.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] sm:text-xs text-white/95 font-semibold">
                        <span className="flex items-center gap-1.5 text-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Áp dụng ngay lập tức
                        </span>
                        <span className="flex items-center gap-1.5 text-cyan-200">
                            <ShieldCheck className="w-4 h-4 text-cyan-300" /> Bảo mật thông tin 100%
                        </span>
                        <span className="flex items-center gap-1.5 text-amber-200">
                            <Gift className="w-4 h-4 text-amber-300" /> Vệ sinh & Spa máy trọn đời
                        </span>
                    </div>
                </div>

                {/* Cột Phải: Form nhập Email Nền Trắng Sáng & Nút Cam Lửa Nổi Bật 100% */}
                <div className="w-full lg:w-[420px] shrink-0">
                    {!daDangKy ? (
                        <form onSubmit={handleSubmit} className="space-y-2.5">
                            <div className="relative flex flex-col sm:flex-row gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); if (loi) setLoi(''); }}
                                    placeholder="Nhập email của bạn (vd: ban@gmail.com)..."
                                    className="flex-1 h-12 px-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-amber-300/50 shadow-lg border-2 border-white transition-all"
                                />
                                <button
                                    type="submit"
                                    className="h-12 px-5.5 rounded-2xl bg-gradient-to-r from-[#FF7A00] via-[#FF5500] to-[#E11D48] hover:from-[#FF5500] hover:to-[#CC1138] text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                                >
                                    <span>Nhận Voucher</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            {loi ? (
                                <p className="text-[11px] text-amber-200 font-bold pl-1 drop-shadow-xs">{loi}</p>
                            ) : (
                                <p className="text-[10.5px] text-white/80 pl-1 font-medium">
                                    * Mã voucher ưu đãi được cấp trực tiếp và có hạn sử dụng 30 ngày.
                                </p>
                            )}
                        </form>
                    ) : (
                        <div className="p-4 sm:p-5 rounded-2xl bg-white/20 border-2 border-white/40 backdrop-blur-md space-y-3 animate-fade-in shadow-2xl">
                            <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm">
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-300" />
                                <span>Chúc mừng bạn đã gia nhập VIP Club!</span>
                            </div>

                            <p className="text-[11.5px] text-white/90">
                                Dùng mã dưới đây tại bước thanh toán để được giảm ngay 500.000đ:
                            </p>

                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-amber-300/60 shadow-inner">
                                <span className="font-mono font-black text-amber-300 text-base sm:text-lg tracking-widest pl-2">
                                    TNTPVIP500K
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyMa}
                                    className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                                >
                                    {daCopy ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-amber-950" />
                                            <span>Đã chép!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Sao chép</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

}
