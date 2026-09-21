'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Mail,
    Lock,
    User,
    Phone,
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle2,
    KeyRound,
    ShieldCheck,
    ArrowLeft,
    RefreshCw,
    Send,
    Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useNguoiDung } from '@/contexts/AuthContext';

// Google Client ID lấy từ biến môi trường NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '789044829668-4uhe7csc4tq093jifv1vul2ofgm5vkt7.apps.googleusercontent.com';

/**
 * Modal Đăng Nhập / Đăng Ký / Quên Mật Khẩu Siêu Cao Cấp
 * - Phối màu sắc nét, rực rỡ, sang trọng chuẩn công nghệ cao
 * - Đồng bộ kích thước form Đăng Nhập & Đăng Ký (Không bị nhảy/lệch kích thước khi chuyển tab)
 * - Hiệu ứng tan biến hạt bụi li ti (Particle Dissolve) cực nhanh và mượt
 * - Bổ sung ô Xác Nhận Mật Khẩu (2 lần) chuẩn xác khi đăng ký
 * - Thông điệp bảo mật thân thiện, trực quan 100%
 */
export default function ModalDangNhapDangKy() {
    const {
        dangMoModalAuth,
        cheDoAuth,
        dongModalAuth,
        chuyenDoiCheDoAuth,
        dangNhap,
        dangKy,
        kichHoatTaiKhoan,
        dangNhapGoogle,
        guiOtpQuenMatKhau,
        xacNhanOtp,
        datLaiMatKhau
    } = useNguoiDung();

    const [cheDoHienTai, setCheDoHienTai] = useState('dang_nhap'); // 'dang_nhap' | 'dang_ky' | 'quen_mat_khau'
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [matKhauXacNhan, setMatKhauXacNhan] = useState('');
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [maOtp, setMaOtp] = useState('');
    const [buocDangKy, setBuocDangKy] = useState(1); // 1: điền form, 2: nhập OTP kích hoạt
    const [buocQuenPass, setBuocQuenPass] = useState(1); // 1: nhập email, 2: OTP, 3: pass mới
    const [demNguoc, setDemNguoc] = useState(0);

    const [hienMatKhau, setHienMatKhau] = useState(false);
    const [hienMatKhauXacNhan, setHienMatKhauXacNhan] = useState(false);
    const [dangXuLy, setDangXuLy] = useState(false);
    const [dangXuLyGoogle, setDangXuLyGoogle] = useState(false);
    const [thongBaoLoi, setThongBaoLoi] = useState('');
    const [thongBaoThanhCong, setThongBaoThanhCong] = useState('');
    const [thanhCong, setThanhCong] = useState(false);
    const [tieuDeThanhCong, setTieuDeThanhCong] = useState('Đăng nhập thành công!');
    const [moTaThanhCong, setMoTaThanhCong] = useState('Chào mừng bạn đến với TNTP Laptop Store 🎉');
    const googleBtnRef = useRef(null);

    // Đồng bộ chế độ từ context
    useEffect(() => {
        if (cheDoAuth) {
            setCheDoHienTai(cheDoAuth);
            setThongBaoLoi('');
            setThongBaoThanhCong('');
            setBuocDangKy(1);
            setBuocQuenPass(1);
            setMaOtp('');
        }
    }, [cheDoAuth, dangMoModalAuth]);

    // Đếm ngược gửi lại OTP
    useEffect(() => {
        let timer;
        if (demNguoc > 0) {
            timer = setInterval(() => setDemNguoc((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [demNguoc]);

    // Khóa cuộn trang khi mở modal
    useEffect(() => {
        if (dangMoModalAuth) {
            const viTriCuon = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${viTriCuon}px`;
            document.body.style.width = '100%';
            return () => {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, viTriCuon);
            };
        }
    }, [dangMoModalAuth]);

    // Khởi tạo nút Google Sign-In
    useEffect(() => {
        if (!dangMoModalAuth || cheDoHienTai === 'quen_mat_khau' || (cheDoHienTai === 'dang_ky' && buocDangKy === 2)) return;

        const xuLyPhanHoiGoogle = async (res) => {
            if (!res?.credential) {
                setThongBaoLoi('Xác thực Google không thành công, vui lòng thử lại!');
                return;
            }
            setThongBaoLoi('');
            setDangXuLyGoogle(true);
            try {
                await dangNhapGoogle({ credential: res.credential });
                setTieuDeThanhCong('Đăng nhập Google thành công!');
                setMoTaThanhCong('Tài khoản Google của bạn đã được xác thực an toàn.');
                setThanhCong(true);
            } catch (e) {
                setThongBaoLoi(e.message || 'Đăng nhập Google thất bại!');
            } finally {
                setDangXuLyGoogle(false);
            }
        };

        const khoiTaoNutGoogle = () => {
            if (!window.google?.accounts?.id || !googleBtnRef.current) return;
            try {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: xuLyPhanHoiGoogle
                });
                const chieuRongNut = Math.min(googleBtnRef.current.offsetWidth || 380, 400);
                window.google.accounts.id.renderButton(googleBtnRef.current, {
                    type: 'standard',
                    shape: 'pill',
                    theme: 'outline',
                    size: 'large',
                    text: 'continue_with',
                    logo_alignment: 'center',
                    width: chieuRongNut
                });
            } catch (e) {
                console.warn('Lỗi nút Google:', e);
            }
        };

        if (document.getElementById('gsi-script')) {
            setTimeout(khoiTaoNutGoogle, 150);
        } else {
            const theScript = document.createElement('script');
            theScript.id = 'gsi-script';
            theScript.src = 'https://accounts.google.com/gsi/client';
            theScript.async = true;
            theScript.defer = true;
            theScript.onload = () => setTimeout(khoiTaoNutGoogle, 100);
            document.head.appendChild(theScript);
        }
    }, [dangMoModalAuth, cheDoHienTai, buocDangKy, dangNhapGoogle]);

    if (!dangMoModalAuth) return null;

    // Hiệu ứng hạt bụi li ti tan biến (Particle Dissolve) khi chuyển form
    const banHatTanBien = (e) => {
        try {
            const rect = e?.currentTarget?.getBoundingClientRect();
            const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
            const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;
            confetti({
                particleCount: 28,
                spread: 60,
                startVelocity: 15,
                ticks: 40,
                origin: { x, y },
                colors: ['#00f0ff', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
                scalar: 0.5,
                shapes: ['circle'],
                disableForReducedMotion: true
            });
        } catch (_) {}
    };

    // Hàm chuyển chế độ mượt mà kèm hiệu ứng tan biến
    const chuyenCheDo = (cheDoMoi, e) => {
        if (cheDoHienTai === cheDoMoi) return;
        banHatTanBien(e);
        setThongBaoLoi('');
        setThongBaoThanhCong('');
        setCheDoHienTai(cheDoMoi);
        chuyenDoiCheDoAuth(cheDoMoi);
        if (cheDoMoi === 'dang_ky') setBuocDangKy(1);
        if (cheDoMoi === 'quen_mat_khau') setBuocQuenPass(1);
    };

    // ==========================================
    // 1. XỬ LÝ QUÊN MẬT KHẨU
    // ==========================================
    const xuLyGuiOtpQuenPass = async (e) => {
        if (e) e.preventDefault();
        if (!email || !email.includes('@')) {
            setThongBaoLoi('Vui lòng nhập địa chỉ Email hợp lệ!');
            return;
        }
        setThongBaoLoi('');
        setThongBaoThanhCong('');
        setDangXuLy(true);
        try {
            const res = await guiOtpQuenMatKhau(email);
            setThongBaoThanhCong(res.thong_diep || `Đã gửi mã xác thực tới ${email}`);
            setBuocQuenPass(2);
            setDemNguoc(60);
        } catch (err) {
            setThongBaoLoi(err.message || 'Không thể gửi mã OTP, vui lòng kiểm tra lại email!');
        } finally {
            setDangXuLy(false);
        }
    };

    const xuLyXacNhanOtpQuenPass = async (e) => {
        e.preventDefault();
        setThongBaoLoi('');
        setThongBaoThanhCong('');
        const otpClean = maOtp.replace(/\s+/g, '');
        if (!otpClean || otpClean.length !== 6) {
            setThongBaoLoi('Vui lòng nhập đầy đủ 6 chữ số mã OTP đã nhận qua email!');
            return;
        }

        setDangXuLy(true);
        try {
            await xacNhanOtp(email, otpClean);
            setThongBaoThanhCong('Xác thực mã OTP chính xác! Mời bạn thiết lập mật khẩu mới.');
            setBuocQuenPass(3);
        } catch (err) {
            setThongBaoLoi(err.message || 'Mã OTP không chính xác hoặc đã hết hạn!');
        } finally {
            setDangXuLy(false);
        }
    };

    const xuLyDoiMatKhau = async (e) => {
        e.preventDefault();
        setThongBaoLoi('');
        const otpClean = maOtp.replace(/\s+/g, '');
        if (!matKhau || matKhau.length < 6) {
            setThongBaoLoi('Mật khẩu mới phải có tối thiểu 6 ký tự!');
            return;
        }
        if (matKhau !== matKhauXacNhan) {
            setThongBaoLoi('Mật khẩu xác nhận không khớp với mật khẩu mới!');
            return;
        }

        setDangXuLy(true);
        try {
            await datLaiMatKhau(email, otpClean, matKhau);
            setTieuDeThanhCong('Đổi mật khẩu thành công!');
            setMoTaThanhCong('Mật khẩu mới đã được cập nhật an toàn. Bạn đã được đăng nhập tự động.');
            setThanhCong(true);
        } catch (err) {
            setThongBaoLoi(err.message || 'Đổi mật khẩu thất bại!');
        } finally {
            setDangXuLy(false);
        }
    };

    // ==========================================
    // 2. XỬ LÝ ĐĂNG KÝ (CÓ XÁC NHẬN MẬT KHẨU 2 LẦN)
    // ==========================================
    const xuLyDangKyGuiOtp = async (e) => {
        e.preventDefault();
        setThongBaoLoi('');
        setThongBaoThanhCong('');

        if (!hoTen.trim() || !email.trim() || !soDienThoai.trim() || !matKhau || !matKhauXacNhan) {
            setThongBaoLoi('Vui lòng điền đầy đủ tất cả các thông tin!');
            return;
        }
        if (matKhau.length < 6) {
            setThongBaoLoi('Mật khẩu phải có tối thiểu 6 ký tự!');
            return;
        }
        if (matKhau !== matKhauXacNhan) {
            setThongBaoLoi('Mật khẩu xác nhận không trùng khớp với mật khẩu đã nhập!');
            return;
        }

        setDangXuLy(true);
        try {
            const res = await dangKy(hoTen.trim(), email.trim(), soDienThoai.trim(), matKhau);
            setThongBaoThanhCong(res.thong_diep || `Mã kích hoạt tài khoản đã gửi tới ${email}. Vui lòng kiểm tra email!`);
            setBuocDangKy(2);
            setDemNguoc(60);
        } catch (err) {
            setThongBaoLoi(err.message || 'Đăng ký tài khoản thất bại!');
        } finally {
            setDangXuLy(false);
        }
    };

    const xuLyKichHoatDangKy = async (e) => {
        e.preventDefault();
        setThongBaoLoi('');
        const otpClean = maOtp.replace(/\s+/g, '');
        if (!otpClean || otpClean.length !== 6) {
            setThongBaoLoi('Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số!');
            return;
        }

        setDangXuLy(true);
        try {
            await kichHoatTaiKhoan(email, otpClean);
            setTieuDeThanhCong('Kích hoạt tài khoản thành công!');
            setMoTaThanhCong('Chào mừng bạn gia nhập thành viên TNTP Laptop Store. Nhận ngay ưu đãi chào mừng!');
            setThanhCong(true);
        } catch (err) {
            setThongBaoLoi(err.message || 'Mã xác thực không chính xác hoặc đã hết hạn!');
        } finally {
            setDangXuLy(false);
        }
    };

    // ==========================================
    // 3. XỬ LÝ ĐĂNG NHẬP
    // ==========================================
    const xuLyDangNhap = async (e) => {
        e.preventDefault();
        setThongBaoLoi('');
        if (!email || !matKhau) {
            setThongBaoLoi('Vui lòng nhập đầy đủ Email và Mật khẩu!');
            return;
        }

        setDangXuLy(true);
        try {
            await dangNhap(email, matKhau);
            setTieuDeThanhCong('Đăng nhập thành công!');
            setMoTaThanhCong('Chào mừng bạn quay trở lại với TNTP Laptop Store.');
            setThanhCong(true);
        } catch (err) {
            setThongBaoLoi(err.message || 'Tài khoản hoặc mật khẩu không chính xác!');
        } finally {
            setDangXuLy(false);
        }
    };

    // Màn hình thành công
    if (thanhCong) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md transition-all">
                <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-[32px] p-8 text-center max-w-sm w-full shadow-[0_0_60px_-10px_rgba(59,130,246,0.5)] border border-blue-500/30 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl" />

                    <div className="w-18 h-18 bg-emerald-500/15 border-2 border-emerald-400/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/20 relative z-10">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 relative z-10">
                        {tieuDeThanhCong}
                    </h3>
                    <p className="text-sm text-slate-300 mb-6 leading-relaxed relative z-10">
                        {moTaThanhCong}
                    </p>
                    <button
                        onClick={dongModalAuth}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/35 hover:shadow-indigo-500/55 active:scale-[0.98] transition-all cursor-pointer relative z-10"
                    >
                        Tiếp tục mua sắm →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && dongModalAuth()}
        >
            {/* CARD MODAL VỚI HÀO QUANG CÔNG NGHỆ RỰC RỠ */}
            <div className="relative w-full max-w-[460px] my-auto bg-white dark:bg-slate-900 rounded-[30px] shadow-[0_20px_70px_-10px_rgba(37,99,235,0.3),0_0_40px_-5px_rgba(99,102,241,0.2)] border border-blue-200/90 dark:border-blue-800/60 overflow-hidden">
                {/* Viền màu chuyển sắc neon rực rỡ */}
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-600" />

                {/* HEADER MÀU SẮC ĐẲNG CẤP */}
                <div className="relative p-6 pb-4 bg-gradient-to-b from-blue-50/90 via-indigo-50/30 to-transparent dark:from-slate-800/70 dark:via-slate-800/30 dark:to-transparent border-b border-slate-100 dark:border-slate-800">
                    {/* Nút đóng */}
                    <button
                        onClick={dongModalAuth}
                        aria-label="Đóng"
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all duration-200 hover:rotate-90 shadow-xs cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Logo & Thương hiệu */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-[11px] tracking-wider shadow-sm shadow-blue-500/30 flex items-center gap-1">
                            TNTP
                        </span>
                        <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent flex items-center gap-1">
                            Laptop Store
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {cheDoHienTai === 'dang_nhap' && 'Đăng Nhập Tài Khoản'}
                        {cheDoHienTai === 'dang_ky' && (buocDangKy === 1 ? 'Đăng Ký Thành Viên' : 'Xác Thực Mã OTP')}
                        {cheDoHienTai === 'quen_mat_khau' && (
                            buocQuenPass === 1
                                ? 'Quên Mật Khẩu'
                                : buocQuenPass === 2
                                ? 'Xác Thực Mã OTP'
                                : 'Thiết Lập Mật Khẩu Mới'
                        )}
                    </h2>

                    {/* TAB CHUYỂN ĐỔI: ĐỒNG BỘ MÀU SẮC NỔI BẬT & BẮN HẠT LI TI TAN BIẾN */}
                    {(cheDoHienTai === 'dang_nhap' || (cheDoHienTai === 'dang_ky' && buocDangKy === 1)) && (
                        <div className="mt-4 p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 flex items-center gap-1.5 shadow-inner">
                            <button
                                type="button"
                                onClick={(e) => chuyenCheDo('dang_nhap', e)}
                                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer ${
                                    cheDoHienTai === 'dang_nhap'
                                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/35 scale-[1.01]'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                Đăng Nhập
                            </button>
                            <button
                                type="button"
                                onClick={(e) => chuyenCheDo('dang_ky', e)}
                                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer ${
                                    cheDoHienTai === 'dang_ky'
                                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/35 scale-[1.01]'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
                                }`}
                            >
                                Đăng Ký Mới
                            </button>
                        </div>
                    )}

                    {cheDoHienTai === 'dang_ky' && buocDangKy === 2 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Nhập mã xác thực 6 số vừa được gửi đến email của bạn
                        </p>
                    )}

                    {cheDoHienTai === 'quen_mat_khau' && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {buocQuenPass === 1 && 'Hệ thống sẽ gửi mã xác thực an toàn tới email của bạn'}
                            {buocQuenPass === 2 && 'Nhập mã OTP 6 số đã được gửi về hộp thư của bạn'}
                            {buocQuenPass === 3 && 'Thiết lập mật khẩu mới an toàn cho tài khoản'}
                        </p>
                    )}
                </div>

                {/* THÂN FORM: CỐ ĐỊNH KÍCH THƯỚC KHÔNG BỊ LỆCH, KÈM HIỆU ỨNG TAN BIẾN LI TI (DISSOLVE) */}
                <div className="p-6 pt-5 min-h-[430px] flex flex-col justify-between">
                    <div>
                        {/* Thông báo lỗi */}
                        {thongBaoLoi && (
                            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
                                <span className="text-sm shrink-0">⚠️</span>
                                <span className="flex-1">{thongBaoLoi}</span>
                            </div>
                        )}

                        {/* Thông báo thành công */}
                        {thongBaoThanhCong && (
                            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in">
                                <span className="text-sm shrink-0">✅</span>
                                <span className="flex-1">{thongBaoThanhCong}</span>
                            </div>
                        )}

                        {/* ANIMATION TAN BIẾN & HỘI TỤ (DISSOLVE) GIỮA CÁC FORM */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={
                                    cheDoHienTai +
                                    (cheDoHienTai === 'dang_ky' ? buocDangKy : '') +
                                    (cheDoHienTai === 'quen_mat_khau' ? buocQuenPass : '')
                                }
                                initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
                                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full"
                            >
                                {/* ==================================================== */}
                                {/* 1. FORM ĐĂNG NHẬP                                    */}
                                {/* ==================================================== */}
                                {cheDoHienTai === 'dang_nhap' && (
                                    <div className="space-y-3.5">
                                        {/* Nút Đăng Nhập Google */}
                                        <div className="relative min-h-[44px] flex justify-center">
                                            <div ref={googleBtnRef} className="w-full flex justify-center" />
                                            {dangXuLyGoogle && (
                                                <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 flex items-center justify-center gap-2 rounded-full border border-blue-200">
                                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                    <span className="text-xs text-slate-700 dark:text-slate-200 font-bold">
                                                        Đang xác thực Google...
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative flex items-center justify-center my-3">
                                            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                                            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 dark:text-slate-500 font-bold shrink-0 uppercase tracking-wider">
                                                Hoặc đăng nhập với email
                                            </span>
                                            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                                        </div>

                                        <form onSubmit={xuLyDangNhap} className="space-y-3.5">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-cyan-500" />
                                                    <span>Địa Chỉ Email</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="name@example.com"
                                                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xs"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                        <Lock className="w-3.5 h-3.5 text-indigo-500" />
                                                        <span>Mật Khẩu</span>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => chuyenCheDo('quen_mat_khau', e)}
                                                        className="text-xs text-blue-600 dark:text-cyan-400 hover:text-indigo-600 font-extrabold cursor-pointer transition-colors"
                                                    >
                                                        Quên mật khẩu?
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <input
                                                        type={hienMatKhau ? 'text' : 'password'}
                                                        value={matKhau}
                                                        onChange={(e) => setMatKhau(e.target.value)}
                                                        required
                                                        placeholder="Nhập mật khẩu..."
                                                        className="w-full pl-4 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xs"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setHienMatKhau(!hienMatKhau)}
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                                    >
                                                        {hienMatKhau ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={dangXuLy || dangXuLyGoogle}
                                                className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                                            >
                                                {dangXuLy ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                        <span>Đang xử lý...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Đăng Nhập Ngay</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {/* ==================================================== */}
                                {/* 2. FORM ĐĂNG KÝ (THIẾT KẾ CÂN XỨNG + CÓ 2 LẦN PASS) */}
                                {/* ==================================================== */}
                                {cheDoHienTai === 'dang_ky' && (
                                    <div>
                                        {buocDangKy === 1 ? (
                                            <div className="space-y-3">
                                                {/* Nút Đăng Ký Google */}
                                                <div className="relative min-h-[44px] flex justify-center">
                                                    <div ref={googleBtnRef} className="w-full flex justify-center" />
                                                </div>

                                                <div className="relative flex items-center justify-center my-2.5">
                                                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                                                    <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 dark:text-slate-500 font-bold shrink-0 uppercase tracking-wider">
                                                        Hoặc điền thông tin thành viên
                                                    </span>
                                                    <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                                                </div>

                                                <form onSubmit={xuLyDangKyGuiOtp} className="space-y-2.5">
                                                    {/* Hàng 1: Họ tên + Số điện thoại (2 cột cực gọn, giữ chiều cao hoàn hảo) */}
                                                    <div className="grid grid-cols-2 gap-2.5">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                <User className="w-3.5 h-3.5 text-amber-500" />
                                                                <span>Họ và Tên</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={hoTen}
                                                                onChange={(e) => setHoTen(e.target.value)}
                                                                placeholder="Nguyễn Văn An"
                                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xs"
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                                                                <span>Số Điện Thoại</span>
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                required
                                                                value={soDienThoai}
                                                                onChange={(e) => setSoDienThoai(e.target.value)}
                                                                placeholder="0912 345 678"
                                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xs"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Hàng 2: Email */}
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                            <Mail className="w-3.5 h-3.5 text-cyan-500" />
                                                            <span>Email Nhận Mã OTP</span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            required
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            placeholder="name@example.com"
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xs"
                                                        />
                                                    </div>

                                                    {/* Hàng 3: Mật Khẩu + Xác Nhận Mật Khẩu (2 lần chuẩn xác) */}
                                                    <div className="grid grid-cols-2 gap-2.5">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                                                                <span>Mật Khẩu</span>
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type={hienMatKhau ? 'text' : 'password'}
                                                                    value={matKhau}
                                                                    onChange={(e) => setMatKhau(e.target.value)}
                                                                    required
                                                                    placeholder="≥ 6 ký tự..."
                                                                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xs"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setHienMatKhau(!hienMatKhau)}
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                                                >
                                                                    {hienMatKhau ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                                                                <span>Nhập Lại Pass</span>
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type={hienMatKhauXacNhan ? 'text' : 'password'}
                                                                    value={matKhauXacNhan}
                                                                    onChange={(e) => setMatKhauXacNhan(e.target.value)}
                                                                    required
                                                                    placeholder="Khớp mật khẩu"
                                                                    className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xs"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setHienMatKhauXacNhan(!hienMatKhauXacNhan)}
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                                                >
                                                                    {hienMatKhauXacNhan ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={dangXuLy}
                                                        className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                                                    >
                                                        {dangXuLy ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                                <span>Đang gửi mã...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>Tiếp Tục & Nhận Mã OTP</span>
                                                                <ArrowRight className="w-4 h-4" />
                                                            </>
                                                        )}
                                                    </button>
                                                </form>
                                            </div>
                                        ) : (
                                            /* Bước 2: Nhập OTP kích hoạt */
                                            <form onSubmit={xuLyKichHoatDangKy} className="space-y-4">
                                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/60 text-center">
                                                    <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                                                        Mã OTP kích hoạt đã gửi tới email:
                                                    </div>
                                                    <div className="text-sm font-black text-blue-950 dark:text-blue-200">
                                                        {email}
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>Mã Xác Thực OTP (6 số)</span>
                                                        </label>
                                                        <button
                                                            type="button"
                                                            disabled={demNguoc > 0 || dangXuLy}
                                                            onClick={xuLyDangKyGuiOtp}
                                                            className="text-[11px] font-black text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer disabled:text-slate-400 disabled:no-underline"
                                                        >
                                                            <RefreshCw className="w-3 h-3" />
                                                            {demNguoc > 0 ? `Gửi lại (${demNguoc}s)` : 'Gửi lại mã'}
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        maxLength={6}
                                                        required
                                                        value={maOtp}
                                                        onChange={(e) => setMaOtp(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="••••••"
                                                        className="w-full py-3 rounded-2xl border-2 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 text-lg font-black tracking-[8px] text-center focus:outline-none focus:border-blue-600 transition-all shadow-sm"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={dangXuLy}
                                                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                                                >
                                                    {dangXuLy ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                            <span>Đang kích hoạt...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Kích Hoạt Tài Khoản Ngay</span>
                                                            <Sparkles className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setBuocDangKy(1);
                                                        setThongBaoLoi('');
                                                        setThongBaoThanhCong('');
                                                    }}
                                                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                                >
                                                    <ArrowLeft className="w-3.5 h-3.5" /> Thay đổi thông tin đăng ký
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}

                                {/* ==================================================== */}
                                {/* 3. FORM QUÊN MẬT KHẨU                                */}
                                {/* ==================================================== */}
                                {cheDoHienTai === 'quen_mat_khau' && (
                                    <div className="space-y-4">
                                        {buocQuenPass === 1 && (
                                            <form onSubmit={xuLyGuiOtpQuenPass} className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-cyan-500" />
                                                        <span>Địa Chỉ Email Của Bạn</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="VD: trikun114@gmail.com"
                                                        className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-2xs"
                                                    />
                                                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                        Mã OTP 6 số sẽ được gửi trực tiếp đến hộp thư này.
                                                    </p>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={dangXuLy}
                                                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                                                >
                                                    {dangXuLy ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                            <span>Đang gửi mã...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Gửi Mã Xác Thực OTP</span>
                                                            <Send className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={(e) => chuyenCheDo('dang_nhap', e)}
                                                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                                >
                                                    <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Đăng nhập
                                                </button>
                                            </form>
                                        )}

                                        {buocQuenPass === 2 && (
                                            <form onSubmit={xuLyXacNhanOtpQuenPass} className="space-y-4">
                                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/60 text-center">
                                                    <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                                                        Mã OTP đã gửi đến hộp thư:
                                                    </div>
                                                    <div className="text-sm font-black text-blue-950 dark:text-blue-200">
                                                        {email}
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>Mã OTP (6 chữ số)</span>
                                                        </label>
                                                        <button
                                                            type="button"
                                                            disabled={demNguoc > 0 || dangXuLy}
                                                            onClick={xuLyGuiOtpQuenPass}
                                                            className="text-[11px] font-black text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer disabled:text-slate-400 disabled:no-underline"
                                                        >
                                                            <RefreshCw className="w-3 h-3" />
                                                            {demNguoc > 0 ? `Gửi lại (${demNguoc}s)` : 'Gửi lại mã'}
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        maxLength={6}
                                                        required
                                                        value={maOtp}
                                                        onChange={(e) => setMaOtp(e.target.value.replace(/\D/g, ''))}
                                                        placeholder="••••••"
                                                        className="w-full py-3 rounded-2xl border-2 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 text-lg font-black tracking-[8px] text-center focus:outline-none focus:border-blue-600 transition-all shadow-sm"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={dangXuLy}
                                                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                                                >
                                                    {dangXuLy ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                            <span>Đang kiểm tra...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Xác Thực Mã OTP</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setBuocQuenPass(1);
                                                        setThongBaoLoi('');
                                                        setThongBaoThanhCong('');
                                                    }}
                                                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                                >
                                                    <ArrowLeft className="w-3.5 h-3.5" /> Thay đổi email
                                                </button>
                                            </form>
                                        )}

                                        {buocQuenPass === 3 && (
                                            <form onSubmit={xuLyDoiMatKhau} className="space-y-3.5">
                                                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                    <span>Mã OTP chính xác! Hãy tạo mật khẩu mới:</span>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        Mật Khẩu Mới
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={hienMatKhau ? 'text' : 'password'}
                                                            value={matKhau}
                                                            onChange={(e) => setMatKhau(e.target.value)}
                                                            required
                                                            placeholder="Tối thiểu 6 ký tự..."
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setHienMatKhau(!hienMatKhau)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                                        >
                                                            {hienMatKhau ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                        Xác Nhận Mật Khẩu Mới
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={hienMatKhauXacNhan ? 'text' : 'password'}
                                                            value={matKhauXacNhan}
                                                            onChange={(e) => setMatKhauXacNhan(e.target.value)}
                                                            required
                                                            placeholder="Khớp mật khẩu mới..."
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setHienMatKhauXacNhan(!hienMatKhauXacNhan)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                                        >
                                                            {hienMatKhauXacNhan ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={dangXuLy}
                                                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                                                >
                                                    {dangXuLy ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                            <span>Đang lưu...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Lưu Mật Khẩu & Đăng Nhập</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={(e) => chuyenCheDo('dang_nhap', e)}
                                                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                                >
                                                    <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Đăng nhập
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* DÒNG CAM KẾT BẢO MẬT THÂN THIỆN (KHÔNG DÙNG THUẬT NGỮ KỸ THUẬT) */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[11.5px] font-bold shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Cam kết bảo mật thông tin an toàn 100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
