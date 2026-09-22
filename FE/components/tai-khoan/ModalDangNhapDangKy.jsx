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
    Sparkles,
    HelpCircle,
    LifeBuoy,
    Info
} from 'lucide-react';
import { useNguoiDung } from '@/contexts/AuthContext';

// Google Client ID
const GOOGLE_CLIENT_ID =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '789044829668-4uhe7csc4tq093jifv1vul2ofgm5vkt7.apps.googleusercontent.com';

/**
 * Modal Đăng Nhập / Đăng Ký / Quên Mật Khẩu Chuẩn Công Nghệ
 * - Hiệu ứng tan biến mảnh vụn li ti bay lên và hợp nhất chuẩn Telegram (Thanos Dust Disintegration)
 * - Chữ sắc nét 100% (Subpixel crisp, không mờ, không mất nét)
 * - Giữ nguyên đầy đủ hệ thống nút và link điều hướng trên - dưới
 * - Form Đăng ký có 2 lần nhập pass (Mật khẩu + Xác nhận mật khẩu)
 * - Đồng bộ kích thước 2 form không bị lệch chiều cao
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
    const [buocDangKy, setBuocDangKy] = useState(1); // 1: điền form, 2: nhập OTP
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

    // State điều khiển hiệu ứng tan biến & chuyển đổi form hòa hợp
    const [dangTanBien, setDangTanBien] = useState(false);
    const [dangDoiForm, setDangDoiForm] = useState(false);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const googleBtnRef = useRef(null);

    // Tự động đóng modal sau 1.8 giây khi đăng nhập thành công và reset trạng thái
    useEffect(() => {
        let timer;
        if (thanhCong) {
            timer = setTimeout(() => {
                setThanhCong(false);
                dongModalAuth();
            }, 1800);
        }
        return () => clearTimeout(timer);
    }, [thanhCong, dongModalAuth]);

    // Đồng bộ chế độ từ context và RESET SẠCH SẼ trạng thái mỗi khi mở modal
    useEffect(() => {
        if (dangMoModalAuth) {
            setThanhCong(false);
            setDangTanBien(false);
            setDangDoiForm(false);
            setThongBaoLoi('');
            setThongBaoThanhCong('');
            setBuocDangKy(1);
            setBuocQuenPass(1);
            setMaOtp('');
            setMatKhau('');
            setMatKhauXacNhan('');
            if (cheDoAuth) {
                setCheDoHienTai(cheDoAuth);
            }
        }
    }, [cheDoAuth, dangMoModalAuth]);

    const dongModalVaReset = () => {
        setThanhCong(false);
        setDangTanBien(false);
        setDangDoiForm(false);
        dongModalAuth();
    };

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

    // Dọn dẹp animation frame khi unmount
    useEffect(() => {
        return () => {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
            }
        };
    }, []);

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
                const chieuRong = Math.min(googleBtnRef.current.offsetWidth || 380, 420);
                window.google.accounts.id.renderButton(googleBtnRef.current, {
                    type: 'standard',
                    shape: 'pill',
                    theme: 'outline',
                    size: 'large',
                    text: 'continue_with',
                    logo_alignment: 'center',
                    width: chieuRong
                });
            } catch (e) {
                console.warn('Lỗi nút Google:', e);
            }
        };

        const timer = setTimeout(() => {
            if (window.google?.accounts?.id) {
                khoiTaoNutGoogle();
            } else if (!document.getElementById('gsi-script')) {
                const s = document.createElement('script');
                s.id = 'gsi-script';
                s.src = 'https://accounts.google.com/gsi/client';
                s.async = true;
                s.defer = true;
                s.onload = () => setTimeout(khoiTaoNutGoogle, 80);
                document.head.appendChild(s);
            }
        }, 80);

        return () => clearTimeout(timer);
    }, [dangMoModalAuth, cheDoHienTai, buocDangKy, dangNhapGoogle]);

    if (!dangMoModalAuth) return null;

    // =========================================================================
    // HIỆU ỨNG TAN BIẾN MẢNH VỤN LI TI BAY LÊN & HỢP NHẤT HÒA HỢP (TELEGRAM STYLE - TỪ TỐN & MƯỢT MÀ)
    // =========================================================================
    const chayHieuUngTanBienTelegram = (cheDoMoi, buocMoi = 1) => {
        if (cheDoHienTai === cheDoMoi && buocMoi === 1) return;
        const canvas = canvasRef.current;
        if (!canvas) {
            setCheDoHienTai(cheDoMoi);
            return;
        }

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
        }

        setDangTanBien(true);
        setDangDoiForm(true); // Bắt đầu làm mờ êm dịu form cũ (0.32s)

        const bangMau = [
            '#00f0ff', '#38bdf8', '#60a5fa', '#3b82f6',
            '#8b5cf6', '#a855f7', '#c084fc',
            '#f59e0b', '#fbbf24', '#ffffff', '#ec4899'
        ];

        // GIAI ĐOẠN 1: 240 MẢNH VỤN LI TI BÙNG LÊN BAY BỒNG BỀNH TỪ TỪ
        const particles = [];
        const soLuongHat = 240;
        for (let i = 0; i < soLuongHat; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * (canvas.height * 0.8) + 30,
                vx: (Math.random() - 0.5) * 2.4,
                vy: -(Math.random() * 2.0 + 1.0), // Tốc độ trôi êm đềm, không bị quá vội
                size: Math.random() * 3.8 + 1.8,
                color: bangMau[Math.floor(Math.random() * bangMau.length)],
                alpha: Math.random() * 0.3 + 0.7,
                decay: Math.random() * 0.010 + 0.008,
                rotation: Math.random() * Math.PI * 2,
                vRot: (Math.random() - 0.5) * 0.1,
                waveFreq: Math.random() * 0.006 + 0.004,
                phase: Math.random() * Math.PI * 2
            });
        }

        let daDoiForm = false;
        const startTime = performance.now();

        const loop = (currentTime) => {
            const elapsed = currentTime - startTime;

            // ĐIỂM GIAO THOA (280ms): Đủ thời gian cho mắt cảm nhận hạt tan biến, form mới trồi lên hòa quyện
            if (elapsed > 280 && !daDoiForm) {
                daDoiForm = true;
                setCheDoHienTai(cheDoMoi);
                if (chuyenDoiCheDoAuth) chuyenDoiCheDoAuth(cheDoMoi);
                if (cheDoMoi === 'dang_ky') setBuocDangKy(buocMoi);
                if (cheDoMoi === 'quen_mat_khau') setBuocQuenPass(buocMoi);
                setThongBaoLoi('');
                setThongBaoThanhCong('');
                setDangDoiForm(false); // Form mới bắt đầu trồi lên sáng rõ êm đềm (0.32s)

                // 100 hạt bụi ánh sáng kết tinh từ trên cao rơi xuống giao thoa với form mới
                for (let j = 0; j < 100; j++) {
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * 50,
                        vx: (Math.random() - 0.5) * 2.0,
                        vy: Math.random() * 1.8 + 0.8, // Rơi nhẹ như tuyết
                        size: Math.random() * 3.2 + 1.6,
                        color: bangMau[Math.floor(Math.random() * bangMau.length)],
                        alpha: 0.9,
                        decay: Math.random() * 0.012 + 0.009,
                        rotation: Math.random() * Math.PI * 2,
                        vRot: (Math.random() - 0.5) * 0.08,
                        waveFreq: 0.005,
                        phase: Math.random() * Math.PI * 2
                    });
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let activeCount = 0;
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.alpha <= 0) continue;
                activeCount++;

                p.x += p.vx + Math.sin(elapsed * p.waveFreq + p.phase) * 0.7;
                p.y += p.vy;
                p.rotation += p.vRot;
                p.alpha -= p.decay;
                p.size = Math.max(0.6, p.size - 0.01);

                ctx.save();
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 9;
                ctx.shadowColor = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
                ctx.restore();
            }

            if (activeCount > 0 && elapsed < 880) {
                animFrameRef.current = requestAnimationFrame(loop);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setDangTanBien(false);
            }
        };

        animFrameRef.current = requestAnimationFrame(loop);
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
            chayHieuUngTanBienTelegram('quen_mat_khau', 2);
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
            chayHieuUngTanBienTelegram('quen_mat_khau', 3);
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
    // 2. XỬ LÝ ĐĂNG KÝ (XÁC NHẬN MẬT KHẨU 2 LẦN)
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
            setThongBaoThanhCong(res.thong_diep || `Mã kích hoạt đã gửi tới ${email}. Vui lòng kiểm tra email!`);
            chayHieuUngTanBienTelegram('dang_ky', 2);
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

    // MÀN HÌNH THÀNH CÔNG
    if (thanhCong) {
        return (
            <div
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
                onClick={(e) => e.target === e.currentTarget && dongModalVaReset()}
            >
                <div className="relative bg-white dark:bg-slate-900 rounded-[30px] p-8 text-center max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 overflow-hidden">
                    {/* Nút đóng X */}
                    <button
                        onClick={dongModalVaReset}
                        aria-label="Đóng"
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="w-18 h-18 bg-emerald-50 dark:bg-emerald-950/50 border-4 border-emerald-100 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400 shadow-md">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                        {tieuDeThanhCong}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {moTaThanhCong}
                    </p>
                    <button
                        onClick={dongModalVaReset}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-98 transition-all cursor-pointer"
                    >
                        Tiếp tục mua sắm →
                    </button>

                    {/* Thanh tiến trình đếm ngược 1.8s */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 animate-[pulse_1.8s_ease-in-out]" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-md overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && dongModalVaReset()}
        >
            {/* THẺ MODAL ĐẲNG CẤP - CHỮ SẮC NÉT KHÔNG BỊ BLUR/MẤT NÉT */}
            <div className="relative w-full max-w-[450px] my-auto bg-white dark:bg-slate-900 rounded-[28px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] border-2 border-slate-300/80 dark:border-slate-700 overflow-hidden">
                {/* Viền neon rực rỡ trên đỉnh */}
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-600" />

                {/* CANVAS HIỆU ỨNG MẢNH VỤN LI TI TELEGRAM DISINTEGRATION */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none z-50 w-full h-full"
                />

                {/* HEADER SANG TRỌNG */}
                <div className="relative p-6 pb-4 bg-gradient-to-b from-blue-50/80 via-slate-50/40 to-transparent dark:from-slate-800/60 dark:via-slate-800/20 dark:to-transparent border-b-2 border-slate-200 dark:border-slate-800">
                    {/* Nút đóng */}
                    <button
                        onClick={dongModalVaReset}
                        aria-label="Đóng"
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all duration-200 hover:rotate-90 shadow-2xs cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Badge & Thương hiệu */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[11px] tracking-wider shadow-sm shadow-blue-500/30">
                            TNTP
                        </span>
                        <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent flex items-center gap-1">
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

                    {/* TAB CHUYỂN ĐỔI CAO CẤP */}
                    {(cheDoHienTai === 'dang_nhap' || (cheDoHienTai === 'dang_ky' && buocDangKy === 1)) && (
                        <div className="mt-4 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 flex items-center gap-1.5 shadow-inner">
                            <button
                                type="button"
                                onClick={() => chayHieuUngTanBienTelegram('dang_nhap')}
                                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-250 cursor-pointer ${
                                    cheDoHienTai === 'dang_nhap'
                                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/35'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-700/60'
                                }`}
                            >
                                Đăng Nhập
                            </button>
                            <button
                                type="button"
                                onClick={() => chayHieuUngTanBienTelegram('dang_ky')}
                                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-250 cursor-pointer ${
                                    cheDoHienTai === 'dang_ky'
                                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/35'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-700/60'
                                }`}
                            >
                                Đăng Ký Mới
                            </button>
                        </div>
                    )}

                    {cheDoHienTai === 'dang_ky' && buocDangKy === 2 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Nhập mã xác thực 6 số vừa gửi tới hộp thư của bạn
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

                {/* THÂN FORM: ĐỒNG BỘ CHIỀU CAO ~430PX, CHỮ SẮC NÉT TUYỆT ĐỐI */}
                <div className="p-6 pt-5 min-h-[430px] flex flex-col justify-between">
                    <div>
                        {/* Thông báo lỗi */}
                        {thongBaoLoi && (
                            <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2.5">
                                <span className="text-sm shrink-0">⚠️</span>
                                <span className="flex-1">{thongBaoLoi}</span>
                            </div>
                        )}

                        {/* Thông báo thành công */}
                        {thongBaoThanhCong && (
                            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-start gap-2.5">
                                <span className="text-sm shrink-0">✅</span>
                                <span className="flex-1">{thongBaoThanhCong}</span>
                            </div>
                        )}

                        {/* KHUNG NỘI DUNG CHUYỂN CẢNH SIÊU MƯỢT, TỪ TỐN & HÒA QUYỆN */}
                        <div
                            style={{
                                opacity: dangDoiForm ? 0.2 : 1,
                                transform: dangDoiForm ? 'scale(0.98) translateY(6px)' : 'scale(1) translateY(0)',
                                transition: 'opacity 0.32s cubic-bezier(0.4, 0, 0.2, 1), transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            {/* ==================================================== */}
                            {/* 1. FORM ĐĂNG NHẬP                                    */}
                            {/* ==================================================== */}
                            {cheDoHienTai === 'dang_nhap' && (
                                <div className="space-y-3.5">
                                    {/* Google Sign-In */}
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
                                        <div className="border-t-2 border-slate-200 dark:border-slate-700 w-full" />
                                        <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-500 dark:text-slate-400 font-extrabold shrink-0 uppercase tracking-wider">
                                            Hoặc đăng nhập với email
                                        </span>
                                        <div className="border-t-2 border-slate-200 dark:border-slate-700 w-full" />
                                    </div>

                                    <form onSubmit={xuLyDangNhap} className="space-y-3.5">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                                                <span>Địa Chỉ Email</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@example.com"
                                                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm font-semibold shadow-xs hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/15 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                    <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                                    <span>Mật Khẩu</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => chayHieuUngTanBienTelegram('quen_mat_khau')}
                                                    className="text-xs text-blue-600 dark:text-cyan-400 hover:underline font-extrabold cursor-pointer"
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
                                                    className="w-full pl-4 pr-10 py-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs sm:text-sm font-semibold shadow-xs hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/15 transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setHienMatKhau(!hienMatKhau)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                                >
                                                    {hienMatKhau ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={dangXuLy || dangXuLyGoogle}
                                            className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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

                                        {/* Link điều hướng dưới chân form */}
                                        <div className="pt-2 text-center">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">Bạn chưa có tài khoản? </span>
                                            <button
                                                type="button"
                                                onClick={() => chayHieuUngTanBienTelegram('dang_ky')}
                                                className="text-xs font-black text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                                            >
                                                Đăng ký ngay
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ==================================================== */}
                            {/* 2. FORM ĐĂNG KÝ (XÁC NHẬN MẬT KHẨU 2 LẦN)          */}
                            {/* ==================================================== */}
                            {cheDoHienTai === 'dang_ky' && (
                                <div>
                                    {buocDangKy === 1 ? (
                                        <div className="space-y-3">
                                            {/* Google Sign-In */}
                                            <div className="relative min-h-[44px] flex justify-center">
                                                <div ref={googleBtnRef} className="w-full flex justify-center" />
                                            </div>

                                            <div className="relative flex items-center justify-center my-2.5">
                                                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                                                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 dark:text-slate-500 font-bold shrink-0 uppercase tracking-wider">
                                                    Hoặc điền thông tin đăng ký
                                                </span>
                                                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                                            </div>

                                            <form onSubmit={xuLyDangKyGuiOtp} className="space-y-2.5">
                                                {/* Hàng 1: Họ tên + SĐT (2 cột) */}
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
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
                                                    />
                                                </div>

                                                {/* Hàng 3: Mật Khẩu + Xác Nhận Mật Khẩu (2 LẦN) */}
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
                                                                className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                                                                className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                                                    className="w-full mt-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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

                                                {/* Link điều hướng dưới chân form */}
                                                <div className="pt-1 text-center">
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">Bạn đã có tài khoản rồi? </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => chayHieuUngTanBienTelegram('dang_nhap')}
                                                        className="text-xs font-black text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                                                    >
                                                        Đăng nhập ngay
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        /* Bước 2: Nhập OTP kích hoạt */
                                        <form onSubmit={xuLyKichHoatDangKy} className="space-y-4">
                                            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-center">
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
                                                    className="w-full py-3 rounded-2xl border-2 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 text-lg font-black tracking-[8px] text-center focus:outline-none focus:border-blue-600 transition-all"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={dangXuLy}
                                                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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
                                                onClick={() => chayHieuUngTanBienTelegram('dang_ky', 1)}
                                                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Thay đổi thông tin đăng ký
                                            </button>

                                            {/* Hướng dẫn kích hoạt */}
                                            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-purple-50/40 dark:from-slate-800/80 dark:via-blue-950/20 dark:to-indigo-950/30 border-2 border-blue-100 dark:border-slate-700 text-xs space-y-1.5 shadow-2xs">
                                                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11.5px]">
                                                    <Info className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                                                    <span>Lưu ý khi kích hoạt tài khoản:</span>
                                                </div>
                                                <ul className="text-[11px] space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    <li>Mã kích hoạt có hiệu lực trong vòng <b className="text-slate-800 dark:text-slate-200">5 phút</b>.</li>
                                                    <li>Kiểm tra hòm thư <b className="text-slate-800 dark:text-slate-200">Chính</b> hoặc <b className="text-slate-800 dark:text-slate-200">Spam / Thư rác</b>.</li>
                                                    <li>Kích hoạt ngay để nhận quà chào mừng từ TNTP Laptop Store.</li>
                                                </ul>
                                            </div>
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
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
                                                />
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                    Mã OTP 6 số sẽ được gửi trực tiếp đến hộp thư này.
                                                </p>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={dangXuLy}
                                                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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
                                                onClick={() => chayHieuUngTanBienTelegram('dang_nhap')}
                                                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Đăng nhập
                                            </button>

                                            {/* Hướng dẫn 3 bước khôi phục mật khẩu màu sắc rực rỡ & siêu đẹp */}
                                            <div className="pt-2">
                                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-purple-50/60 dark:from-slate-800/90 dark:via-slate-800/60 dark:to-indigo-950/40 border-2 border-indigo-100 dark:border-slate-700 shadow-sm space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <span className="flex items-center gap-1.5 font-black text-slate-800 dark:text-white text-xs">
                                                            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                                                            3 Bước Lấy Lại Mật Khẩu
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-900/60 text-blue-700 dark:text-cyan-300 text-[10px] font-bold">
                                                            Nhanh chóng & Bảo mật
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2 text-center">
                                                        {/* Ô 1: Xanh Dương / Cyan */}
                                                        <div className="p-2.5 rounded-2xl bg-gradient-to-b from-sky-50 via-blue-50 to-blue-100/70 dark:from-sky-950/50 dark:via-blue-950/40 dark:to-blue-900/40 border-2 border-blue-300 dark:border-blue-600/70 shadow-sm shadow-blue-500/15 flex flex-col items-center text-center transition-all hover:scale-102 hover:shadow-md hover:shadow-blue-500/25">
                                                            <span className="w-7 h-7 mx-auto rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/35 mb-1.5">
                                                                1
                                                            </span>
                                                            <div className="font-black text-blue-900 dark:text-blue-200 text-xs">
                                                                Gửi OTP
                                                            </div>
                                                            <div className="text-[10px] font-bold text-blue-600 dark:text-cyan-300 mt-0.5 leading-tight">
                                                                Nhập email
                                                            </div>
                                                        </div>

                                                        {/* Ô 2: Tím / Indigo */}
                                                        <div className="p-2.5 rounded-2xl bg-gradient-to-b from-purple-50 via-indigo-50 to-purple-100/70 dark:from-purple-950/50 dark:via-indigo-950/40 dark:to-purple-900/40 border-2 border-purple-300 dark:border-purple-600/70 shadow-sm shadow-purple-500/15 flex flex-col items-center text-center transition-all hover:scale-102 hover:shadow-md hover:shadow-purple-500/25">
                                                            <span className="w-7 h-7 mx-auto rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-purple-500/35 mb-1.5">
                                                                2
                                                            </span>
                                                            <div className="font-black text-purple-900 dark:text-purple-200 text-xs">
                                                                Xác Thực
                                                            </div>
                                                            <div className="text-[10px] font-bold text-purple-600 dark:text-purple-300 mt-0.5 leading-tight">
                                                                Mã 6 số
                                                            </div>
                                                        </div>

                                                        {/* Ô 3: Xanh Ngọc / Emerald */}
                                                        <div className="p-2.5 rounded-2xl bg-gradient-to-b from-emerald-50 via-teal-50 to-emerald-100/70 dark:from-emerald-950/50 dark:via-teal-950/40 dark:to-emerald-900/40 border-2 border-emerald-300 dark:border-emerald-600/70 shadow-sm shadow-emerald-500/15 flex flex-col items-center text-center transition-all hover:scale-102 hover:shadow-md hover:shadow-emerald-500/25">
                                                            <span className="w-7 h-7 mx-auto rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black text-xs flex items-center justify-center shadow-md shadow-emerald-500/35 mb-1.5">
                                                                3
                                                            </span>
                                                            <div className="font-black text-emerald-900 dark:text-emerald-200 text-xs">
                                                                Đổi Pass
                                                            </div>
                                                            <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-300 mt-0.5 leading-tight">
                                                                Mật khẩu mới
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t-2 border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs">
                                                        <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-bold text-[11.5px]">
                                                            <LifeBuoy className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                                                            <span>Cần hỗ trợ trực tiếp?</span>
                                                        </span>
                                                        <a
                                                            href="tel:18006868"
                                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[11px] shadow-sm shadow-blue-500/30 active:scale-98 transition-all"
                                                        >
                                                            Hotline 1800 6868
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    )}

                                    {buocQuenPass === 2 && (
                                        <form onSubmit={xuLyXacNhanOtpQuenPass} className="space-y-4">
                                            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-center">
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
                                                    className="w-full py-3 rounded-2xl border-2 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 text-lg font-black tracking-[8px] text-center focus:outline-none focus:border-blue-600 transition-all"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={dangXuLy}
                                                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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
                                                onClick={() => chayHieuUngTanBienTelegram('quen_mat_khau', 1)}
                                                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Thay đổi email
                                            </button>

                                            {/* Mẹo nhận mã OTP */}
                                            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-purple-50/40 dark:from-slate-800/80 dark:via-blue-950/20 dark:to-indigo-950/30 border-2 border-blue-100 dark:border-slate-700 text-xs space-y-1.5 shadow-2xs">
                                                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11.5px]">
                                                    <Info className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                                                    <span>Mẹo nhận mã OTP nhanh:</span>
                                                </div>
                                                <ul className="text-[11px] space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400 leading-relaxed">
                                                    <li>Mã xác thực có hiệu lực trong vòng <b className="text-slate-800 dark:text-slate-200">5 phút</b>.</li>
                                                    <li>Kiểm tra mục <b className="text-slate-800 dark:text-slate-200">Spam / Thư rác</b> nếu chưa thấy ở Hộp thư đến.</li>
                                                    <li>Bấm <b className="text-slate-800 dark:text-slate-200">Gửi lại mã</b> nếu bạn chưa nhận được sau 60 giây.</li>
                                                </ul>
                                            </div>
                                        </form>
                                    )}

                                    {buocQuenPass === 3 && (
                                        <form onSubmit={xuLyDoiMatKhau} className="space-y-3.5">
                                            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Mã OTP chính xác! Hãy tạo mật khẩu mới:</span>
                                            </div>

                                            <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                                                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                                <span>Mẹo bảo mật: Mật khẩu nên chứa tối thiểu 6 ký tự, gồm cả chữ và số để tăng cường bảo vệ.</span>
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
                                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                                                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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
                                                onClick={() => chayHieuUngTanBienTelegram('dang_nhap')}
                                                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Đăng nhập
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* DÒNG CAM KẾT BẢO MẬT THÂN THIỆN */}
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
