'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, CheckCircle2, Laptop, Gift, Zap } from 'lucide-react';
import { useAuth, useNguoiDung } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function TrangDangNhap() {
    const router = useRouter();
    const { daDangNhap, dangNhap, dangKy, dangNhapGoogle, nguoiDung } = useNguoiDung();
    const [cheDo, setCheDo] = useState('dang_nhap'); // 'dang_nhap' | 'dang_ky'
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [hienMatKhau, setHienMatKhau] = useState(false);
    const [dangXuLy, setDangXuLy] = useState(false);
    const [dangXuLyGoogle, setDangXuLyGoogle] = useState(false);

    // Nếu đã đăng nhập thì điều hướng về trang chủ
    if (daDangNhap) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold">Bạn đã đăng nhập thành công!</h2>
                <p className="text-sm text-slate-500">Xin chào {nguoiDung?.hoTen || 'Thành viên VIP'}.</p>
                <div className="flex items-center gap-3 pt-2">
                    <Link href="/khuyen-mai" className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all shadow-md">
                        Săn Voucher Ngay 🎟️
                    </Link>
                    <Link href="/" className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200">
                        Về Trang Chủ
                    </Link>
                </div>
            </div>
        );
    }

    const xuLySubmit = async (e) => {
        e.preventDefault();
        setDangXuLy(true);
        try {
            if (cheDo === 'dang_nhap') {
                if (!email || !matKhau) {
                    toast.error('Vui lòng điền Email và Mật khẩu');
                    setDangXuLy(false);
                    return;
                }
                await dangNhap(email, matKhau);
                toast.success('Đăng nhập thành công! Chào mừng bạn quay lại.');
                router.push('/khuyen-mai');
            } else {
                if (!hoTen || !email || !soDienThoai || !matKhau) {
                    toast.error('Vui lòng điền đầy đủ các trường thông tin');
                    setDangXuLy(false);
                    return;
                }
                await dangKy(hoTen, email, soDienThoai, matKhau);
                toast.success('Đăng ký tài khoản VIP thành công! Đã tặng 200 điểm.');
                router.push('/khuyen-mai');
            }
        } catch (err) {
            toast.error(err.message || 'Thao tác không thành công, vui lòng thử lại!');
        } finally {
            setDangXuLy(false);
        }
    };

    const xuLyDangNhapGoogle = async () => {
        setDangXuLyGoogle(true);
        try {
            await dangNhapGoogle({
                email: 'khachhang.google@gmail.com',
                hoTen: 'Khách Hàng Google VIP',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                googleId: 'gg_' + Date.now()
            });
            toast.success('Đăng nhập với Google thành công! 🎉');
            router.push('/khuyen-mai');
        } catch (err) {
            toast.error(err.message || 'Lỗi kết nối tài khoản Google');
        } finally {
            setDangXuLyGoogle(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-4 sm:py-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                {/* CỘT TRÁI: BANNER THƯƠNG HIỆU & QUYỀN LỢI VIP */}
                <div className="lg:col-span-5 bg-gradient-to-br from-[#00276e] via-[#0040a8] to-[#0052cc] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Họa tiết phát sáng nền */}
                    <div className="absolute -top-16 -left-16 w-52 h-52 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-xl bg-white text-[#0052cc] font-black text-xs shadow-md">
                                TNTP LAPTOP
                            </span>
                            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                VIP MEMBER CLUB
                            </span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
                                MỞ KHÓA KHO VOUCHER <span className="text-amber-300">ĐỘC QUYỀN</span>
                            </h1>
                            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                                Đăng nhập tài khoản để săn mã giảm tới 2.000.000đ, miễn phí vận chuyển 0Đ và bảo hành trọn đời máy.
                            </p>
                        </div>

                        {/* Danh sách đặc quyền */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                                <Gift className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <h4 className="font-extrabold text-white">Ví Voucher Cá Nhân</h4>
                                    <p className="text-blue-100 text-[11px]">Lưu và tích lũy mã giảm giá áp dụng tự động khi thanh toán.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                                <Zap className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <h4 className="font-extrabold text-white">Săn Sale Khung Giờ Vàng</h4>
                                    <p className="text-blue-100 text-[11px]">Đặc quyền săn mã chớp nhoáng lúc 0H, 9H, 12H, 18H, 21H.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15">
                                <ShieldCheck className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                                <div className="text-xs">
                                    <h4 className="font-extrabold text-white">Bảo Hành Spa Laptop Trọn Đời</h4>
                                    <p className="text-blue-100 text-[11px]">Miễn phí vệ sinh, tra keo tản nhiệt và cài đặt phần mềm.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-6 border-t border-white/15 text-[11px] text-blue-200 flex items-center justify-between">
                        <span>Hỗ trợ 24/7: 1900.8946</span>
                        <span>TNTP Technology 2026</span>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM ĐĂNG NHẬP / ĐĂNG KÝ */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto space-y-6">
                        {/* Tab Switcher */}
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {cheDo === 'dang_nhap' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Thành Viên'}
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    {cheDo === 'dang_nhap' ? 'Chào mừng bạn quay trở lại với TNTP Laptop' : 'Tạo tài khoản mới để nhận ngay gói quà tân thủ'}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => setCheDo('dang_nhap')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        cheDo === 'dang_nhap'
                                            ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-cyan-400 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    Đăng Nhập
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCheDo('dang_ky')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        cheDo === 'dang_ky'
                                            ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-cyan-400 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    Đăng Ký
                                </button>
                            </div>
                        </div>

                        {/* Nút Đăng Nhập Với Google */}
                        <button
                            type="button"
                            onClick={xuLyDangNhapGoogle}
                            disabled={dangXuLyGoogle || dangXuLy}
                            className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs hover:border-slate-300 dark:hover:border-slate-600 active:scale-98 cursor-pointer disabled:opacity-50"
                        >
                            {dangXuLyGoogle ? (
                                <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                                </svg>
                            )}
                            <span>{dangXuLyGoogle ? 'Đang kết nối Google...' : 'Đăng nhập nhanh với Google'}</span>
                        </button>

                        <div className="relative flex items-center justify-center">
                            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-bold shrink-0 uppercase tracking-wider">
                                hoặc với tài khoản email
                            </span>
                            <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                        </div>

                        {/* Form */}
                        <form onSubmit={xuLySubmit} className="space-y-4">
                            {cheDo === 'dang_ky' && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Họ và Tên</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={hoTen}
                                            onChange={(e) => setHoTen(e.target.value)}
                                            placeholder="Nguyễn Văn A"
                                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Địa Chỉ Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
                                    />
                                </div>
                            </div>

                            {cheDo === 'dang_ky' && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Số Điện Thoại</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="tel"
                                            required
                                            value={soDienThoai}
                                            onChange={(e) => setSoDienThoai(e.target.value)}
                                            placeholder="0912 345 678"
                                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mật Khẩu</label>
                                    {cheDo === 'dang_nhap' && (
                                        <button
                                            type="button"
                                            onClick={() => alert('Vui lòng liên hệ Hotline 1900.8946 để được cấp lại mật khẩu an toàn!')}
                                            className="text-[11px] text-[#0052cc] dark:text-cyan-400 hover:underline cursor-pointer"
                                        >
                                            Quên mật khẩu?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={hienMatKhau ? 'text' : 'password'}
                                        required
                                        value={matKhau}
                                        onChange={(e) => setMatKhau(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setHienMatKhau(!hienMatKhau)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {hienMatKhau ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={dangXuLy || dangXuLyGoogle}
                                className="w-full py-3.5 rounded-2xl bg-[#0052cc] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
                            >
                                <span>{dangXuLy ? 'Đang xác thực...' : cheDo === 'dang_nhap' ? 'Đăng Nhập Vào Hệ Thống' : 'Hoàn Tất Đăng Ký VIP'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
