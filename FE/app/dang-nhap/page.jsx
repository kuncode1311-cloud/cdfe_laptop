'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Mail,
    Lock,
    User,
    Phone,
    ArrowRight,
    ShieldCheck,
    Eye,
    EyeOff,
    Sparkles,
    CheckCircle2,
    Gift,
    Zap,
    KeyRound,
    RefreshCw,
    Check
} from 'lucide-react';
import { useNguoiDung } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function TrangDangNhap() {
    const router = useRouter();
    const {
        daDangNhap,
        dangNhap,
        dangKy,
        kichHoatTaiKhoan,
        guiLaiOtp,
        dangNhapGoogle,
        nguoiDung,
        moModalDangNhap
    } = useNguoiDung();

    const [cheDo, setCheDo] = useState('dang_nhap'); // 'dang_nhap' | 'dang_ky' | 'xac_thuc_otp'
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [maOtp, setMaOtp] = useState('');
    const [demNguoc, setDemNguoc] = useState(0);
    const [hienMatKhau, setHienMatKhau] = useState(false);
    const [dangXuLy, setDangXuLy] = useState(false);
    const [dangXuLyGoogle, setDangXuLyGoogle] = useState(false);

    // Tự động tải thư viện Google Identity Services (GSI)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!document.getElementById('gsi-script')) {
            const s = document.createElement('script');
            s.id = 'gsi-script';
            s.src = 'https://accounts.google.com/gsi/client';
            s.async = true;
            s.defer = true;
            document.head.appendChild(s);
        }
    }, []);

    // Bộ đếm ngược thời gian gửi lại OTP
    useEffect(() => {
        let timer;
        if (demNguoc > 0) {
            timer = setInterval(() => setDemNguoc((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [demNguoc]);

    // Realtime Validation cho form Đăng ký
    const validationDangKy = useMemo(() => {
        const hoTenClean = (hoTen || '').trim();
        const sdtClean = (soDienThoai || '').replace(/\s+/g, '');
        const emailClean = (email || '').trim().toLowerCase();
        const mkClean = matKhau || '';

        const errors = {};

        if (hoTen && hoTenClean.length > 0 && hoTenClean.length < 2) {
            errors.hoTen = 'Tối thiểu 2 ký tự';
        }

        if (soDienThoai && sdtClean.length > 0) {
            if (!/^(0|\+84)[0-9]{9}$/.test(sdtClean)) {
                errors.soDienThoai = 'Cần 10 số VN';
            }
        }

        if (email && emailClean.length > 0) {
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailClean)) {
                errors.email = 'Email chưa đúng';
            }
        }

        if (matKhau && mkClean.length > 0 && mkClean.length < 6) {
            errors.matKhau = 'Tối thiểu 6 ký tự';
        }

        const isValidHoTen = hoTenClean.length >= 2;
        const isValidSdt = /^(0|\+84)[0-9]{9}$/.test(sdtClean);
        const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailClean);
        const isValidMatKhau = mkClean.length >= 6;
        const isAllValid = isValidHoTen && isValidSdt && isValidEmail && isValidMatKhau;

        return {
            errors,
            isValidHoTen,
            isValidSdt,
            isValidEmail,
            isValidMatKhau,
            isAllValid
        };
    }, [hoTen, soDienThoai, email, matKhau]);

    // Định dạng thời gian đếm ngược (90s -> 1p30s, 45s -> 45s)
    const dinhDangDemNguoc = (giay) => {
        if (giay <= 0) return '';
        if (giay >= 60) {
            const p = Math.floor(giay / 60);
            const s = (giay % 60).toString().padStart(2, '0');
            return `${p}p${s}s`;
        }
        return `${giay}s`;
    };

    // Nếu đã đăng nhập thì hiển thị thẻ thông tin
    if (daDangNhap) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold">Bạn đã đăng nhập thành công!</h2>
                <p className="text-sm text-slate-500">Xin chào {nguoiDung?.hoTen || 'Thành viên'}.</p>
                <div className="flex items-center gap-3 pt-2">
                    {nguoiDung?.vaiTro === 'admin' && (
                        <Link href="/admin" className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-all shadow-md">
                            Quản Trị Hệ Thống 👑
                        </Link>
                    )}
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
                const user = await dangNhap(email, matKhau);
                toast.success('Đăng nhập thành công! Chào mừng bạn quay lại.');
                if (user?.vaiTro === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else if (cheDo === 'xac_thuc_otp') {
                const otpClean = maOtp.replace(/\s+/g, '');
                if (!otpClean || otpClean.length !== 6) {
                    toast.error('Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số');
                    setDangXuLy(false);
                    return;
                }
                await kichHoatTaiKhoan(email.trim(), otpClean);
                toast.success('Kích hoạt tài khoản thành công! 🎉 Chào mừng bạn gia nhập TNTP Laptop.');
                router.push('/');
            } else {
                const hoTenClean = hoTen.trim();
                const emailClean = email.trim().toLowerCase();
                const sdtClean = soDienThoai.trim().replace(/\s+/g, '');
                const mkClean = matKhau.trim();

                if (!hoTenClean || !emailClean || !sdtClean || !mkClean) {
                    toast.error('Vui lòng điền đầy đủ các trường thông tin');
                    setDangXuLy(false);
                    return;
                }

                if (hoTenClean.length < 2) {
                    toast.error('Họ và tên phải có tối thiểu 2 ký tự!');
                    setDangXuLy(false);
                    return;
                }

                const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!regexEmail.test(emailClean)) {
                    toast.error('Địa chỉ Email không đúng định dạng (VD: example@gmail.com)!');
                    setDangXuLy(false);
                    return;
                }

                const regexSdt = /^(0|\+84)[0-9]{9}$/;
                if (!regexSdt.test(sdtClean)) {
                    toast.error('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam gồm 10 chữ số (VD: 0912345678).');
                    setDangXuLy(false);
                    return;
                }

                if (mkClean.length < 6) {
                    toast.error('Mật khẩu phải có tối thiểu 6 ký tự!');
                    setDangXuLy(false);
                    return;
                }

                const res = await dangKy(hoTenClean, emailClean, sdtClean, mkClean);
                if (res?.yeuCauOtp) {
                    toast.success(res.thong_diep || `Mã kích hoạt OTP đã gửi tới ${emailClean}. Vui lòng kiểm tra hộp thư!`);
                    setCheDo('xac_thuc_otp');
                    setDemNguoc(90);
                    return;
                }
                toast.success('Đăng ký tài khoản thành công! Đã tặng 200 điểm.');
                router.push('/');
            }
        } catch (err) {
            if (err.message && err.message.toLowerCase().includes('chưa được kích hoạt')) {
                toast.info('Tài khoản chưa kích hoạt. Vui lòng nhập mã OTP đã gửi về email!');
                setCheDo('xac_thuc_otp');
                setDemNguoc(90);
            } else {
                toast.error(err.message || 'Thao tác không thành công, vui lòng thử lại!');
            }
        } finally {
            setDangXuLy(false);
        }
    };

    const xuLyGuiLaiOtp = async () => {
        if (!email) {
            toast.error('Vui lòng nhập email để gửi lại mã OTP');
            return;
        }
        setDangXuLy(true);
        try {
            const res = await guiLaiOtp(email.trim());
            toast.success(res.thong_diep || `Đã gửi lại mã OTP tới ${email}`);
            setDemNguoc(90);
        } catch (err) {
            toast.error(err.message || 'Không thể gửi lại mã OTP');
        } finally {
            setDangXuLy(false);
        }
    };

    // Đăng nhập Google chuẩn Google Identity Services (Không dùng dữ liệu ảo)
    const xuLyDangNhapGoogle = () => {
        if (dangXuLyGoogle || dangXuLy) return;
        setDangXuLyGoogle(true);

        const clientId = GOOGLE_CLIENT_ID;
        if (typeof window !== 'undefined' && window.google?.accounts?.oauth2 && clientId) {
            try {
                const tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'email profile openid',
                    callback: async (tokenResponse) => {
                        if (tokenResponse?.error) {
                            setDangXuLyGoogle(false);
                            if (tokenResponse.error !== 'popup_closed_by_user') {
                                toast.error('Xác thực Google không thành công, vui lòng thử lại!');
                            }
                            return;
                        }
                        try {
                            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                            });
                            const userInfo = await userInfoRes.json();
                            const userGg = await dangNhapGoogle({
                                email: userInfo.email,
                                hoTen: userInfo.name || userInfo.given_name || 'Khách Hàng Google',
                                avatar: userInfo.picture || '',
                                googleId: userInfo.sub
                            });
                            toast.success('Đăng nhập với Google thành công! 🎉');
                            if (userGg?.vaiTro === 'admin') {
                                router.push('/admin');
                            } else {
                                router.push('/');
                            }
                        } catch (err) {
                            toast.error(err.message || 'Đăng nhập Google thất bại');
                        } finally {
                            setDangXuLyGoogle(false);
                        }
                    }
                });
                tokenClient.requestAccessToken({ prompt: 'select_account' });
                return;
            } catch (e) {
                console.warn('Lỗi khởi tạo Google OAuth2:', e);
                toast.error('Không thể mở cửa sổ đăng nhập Google. Vui lòng thử lại!');
                setDangXuLyGoogle(false);
                return;
            }
        }

        toast.info('Đang kết nối dịch vụ Google Sign-In, vui lòng thử lại sau 2 giây!');
        setDangXuLyGoogle(false);
    };

    return (
        <div className="max-w-5xl mx-auto py-4 sm:py-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
                {/* CỘT TRÁI: BANNER THƯƠNG HIỆU & QUYỀN LỢI THÀNH VIÊN */}
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
                                THÀNH VIÊN TNTP
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

                {/* CỘT PHẢI: FORM ĐĂNG NHẬP / ĐĂNG KÝ / XÁC THỰC OTP */}
                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto space-y-6">
                        {/* Tab Switcher */}
                        {cheDo !== 'xac_thuc_otp' ? (
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
                                        onClick={() => { setCheDo('dang_nhap'); setMatKhau(''); }}
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
                                        onClick={() => { setCheDo('dang_ky'); setMatKhau(''); }}
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
                        ) : (
                            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    Xác Thực Mã OTP
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Nhập mã 6 chữ số vừa gửi đến hộp thư: <strong className="text-blue-600">{email}</strong>
                                </p>
                            </div>
                        )}

                        {/* NÚT GOOGLE SIGN-IN: CHỈ HIỂN THỊ Ở TAB ĐĂNG NHẬP (ẨN HOÀN TOÀN Ở TAB ĐĂNG KÝ) */}
                        {cheDo === 'dang_nhap' && (
                            <>
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
                            </>
                        )}

                        {/* Form */}
                        <form onSubmit={xuLySubmit} className="space-y-4">
                            {cheDo === 'xac_thuc_otp' ? (
                                <div className="space-y-4">
                                    <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-center">
                                        <div className="text-xs font-bold text-blue-700 dark:text-blue-300">
                                            Mã kích hoạt OTP đã gửi tới:
                                        </div>
                                        <div className="text-sm font-black text-blue-950 dark:text-blue-200 truncate">
                                            {email}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                                                <span>Nhập mã OTP (6 số)</span>
                                            </label>
                                            <button
                                                type="button"
                                                disabled={demNguoc > 0 || dangXuLy}
                                                onClick={xuLyGuiLaiOtp}
                                                className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer disabled:text-slate-400 disabled:no-underline"
                                            >
                                                <RefreshCw className={`w-3 h-3 ${dangXuLy ? 'animate-spin' : ''}`} />
                                                {demNguoc > 0 ? `Gửi lại (${dinhDangDemNguoc(demNguoc)})` : 'Gửi lại mã'}
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            required
                                            value={maOtp}
                                            onChange={(e) => setMaOtp(e.target.value.replace(/\D/g, ''))}
                                            placeholder="••••••"
                                            className="w-full py-3 rounded-2xl border-2 border-blue-400 bg-blue-50/50 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 text-lg font-black tracking-[8px] text-center focus:outline-none focus:border-blue-600 transition-all"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={dangXuLy || maOtp.length !== 6}
                                        className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
                                    >
                                        <span>{dangXuLy ? 'Đang kích hoạt...' : 'Xác Thực & Kích Hoạt Ngay'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setCheDo('dang_nhap')}
                                        className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer pt-2"
                                    >
                                        ← Quay lại đăng nhập
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {cheDo === 'dang_ky' && (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Họ và Tên</label>
                                                {validationDangKy.errors.hoTen ? (
                                                    <span className="text-[10.5px] text-rose-500 font-bold flex items-center gap-0.5 animate-in fade-in duration-150">
                                                        <span className="text-[9px]">⚠️</span> {validationDangKy.errors.hoTen}
                                                    </span>
                                                ) : validationDangKy.isValidHoTen ? (
                                                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 animate-in fade-in duration-150">
                                                        <Check className="w-3 h-3" /> Hợp lệ
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="relative">
                                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={hoTen}
                                                    onChange={(e) => setHoTen(e.target.value)}
                                                    placeholder="Nguyễn Văn A"
                                                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-slate-900 dark:text-white text-xs focus:outline-none transition-all ${
                                                        validationDangKy.errors.hoTen
                                                            ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 focus:ring-1 focus:ring-rose-500'
                                                            : validationDangKy.isValidHoTen
                                                            ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 focus:ring-1 focus:ring-emerald-500'
                                                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Địa Chỉ Email</label>
                                            {cheDo === 'dang_ky' && (
                                                validationDangKy.errors.email ? (
                                                    <span className="text-[10.5px] text-rose-500 font-bold flex items-center gap-0.5 animate-in fade-in duration-150">
                                                        <span className="text-[9px]">⚠️</span> {validationDangKy.errors.email}
                                                    </span>
                                                ) : validationDangKy.isValidEmail ? (
                                                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 animate-in fade-in duration-150">
                                                        <Check className="w-3 h-3" /> Hợp lệ
                                                    </span>
                                                ) : null
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@example.com"
                                                className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-slate-900 dark:text-white text-xs focus:outline-none transition-all ${
                                                    cheDo === 'dang_ky' && validationDangKy.errors.email
                                                        ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 focus:ring-1 focus:ring-rose-500'
                                                        : cheDo === 'dang_ky' && validationDangKy.isValidEmail
                                                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 focus:ring-1 focus:ring-emerald-500'
                                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {cheDo === 'dang_ky' && (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Số Điện Thoại</label>
                                                {validationDangKy.errors.soDienThoai ? (
                                                    <span className="text-[10.5px] text-rose-500 font-bold flex items-center gap-0.5 animate-in fade-in duration-150">
                                                        <span className="text-[9px]">⚠️</span> {validationDangKy.errors.soDienThoai}
                                                    </span>
                                                ) : validationDangKy.isValidSdt ? (
                                                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 animate-in fade-in duration-150">
                                                        <Check className="w-3 h-3" /> Hợp lệ
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="relative">
                                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="tel"
                                                    required
                                                    value={soDienThoai}
                                                    onChange={(e) => setSoDienThoai(e.target.value)}
                                                    placeholder="0912 345 678"
                                                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border text-slate-900 dark:text-white text-xs focus:outline-none transition-all ${
                                                        validationDangKy.errors.soDienThoai
                                                            ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 focus:ring-1 focus:ring-rose-500'
                                                            : validationDangKy.isValidSdt
                                                            ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 focus:ring-1 focus:ring-emerald-500'
                                                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Mật Khẩu</label>
                                            {cheDo === 'dang_ky' && (
                                                validationDangKy.errors.matKhau ? (
                                                    <span className="text-[10.5px] text-rose-500 font-bold flex items-center gap-0.5 animate-in fade-in duration-150">
                                                        <span className="text-[9px]">⚠️</span> {validationDangKy.errors.matKhau}
                                                    </span>
                                                ) : validationDangKy.isValidMatKhau ? (
                                                    <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 animate-in fade-in duration-150">
                                                        <Check className="w-3 h-3" /> Hợp lệ
                                                    </span>
                                                ) : null
                                            )}
                                            {cheDo === 'dang_nhap' && (
                                                <button
                                                    type="button"
                                                    onClick={() => moModalDangNhap && moModalDangNhap()}
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
                                                className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-slate-900 dark:text-white text-xs focus:outline-none transition-all ${
                                                    cheDo === 'dang_ky' && validationDangKy.errors.matKhau
                                                        ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 focus:ring-1 focus:ring-rose-500'
                                                        : cheDo === 'dang_ky' && validationDangKy.isValidMatKhau
                                                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 focus:ring-1 focus:ring-emerald-500'
                                                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc]'
                                                }`}
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
                                        disabled={dangXuLy || dangXuLyGoogle || (cheDo === 'dang_ky' && !validationDangKy.isAllValid)}
                                        className="w-full py-3.5 rounded-2xl bg-[#0052cc] hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50 mt-2"
                                    >
                                        <span>{dangXuLy ? 'Đang xác thực...' : cheDo === 'dang_nhap' ? 'Đăng Nhập Vào Hệ Thống' : 'Hoàn Tất Đăng Ký (Nhận OTP)'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
