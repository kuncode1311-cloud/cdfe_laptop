'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
    Sparkles,
    Check
} from 'lucide-react';
import { useNguoiDung } from '@/contexts/AuthContext';

// Google Client ID
const GOOGLE_CLIENT_ID =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '789044829668-4uhe7csc4tq093jifv1vul2ofgm5vkt7.apps.googleusercontent.com';

/**
 * Modal Đăng Nhập / Đăng Ký / Quên Mật Khẩu Chuẩn Công Nghệ Siêu Mượt
 * 1. Pháo hoa bùng nổ rực rỡ (Lightweight 60fps/120fps Particle Fireworks Engine):
 *    - Tối ưu GPU canvas, không dùng shadowBlur gây tụt fps.
 *    - Bắn pháo hoa lung linh mỗi khi chuyển tab, mở form hoặc thành công.
 * 2. Triệt tiêu 100% hiện tượng nhảy giật (Zero Layout Shift):
 *    - Cố định chiều cao form h-[290px] đồng nhất tuyệt đối giữa Đăng Nhập & Đăng Ký.
 *    - Khung modal đứng im bất động ở trung tâm màn hình, không nảy lên thụt xuống 1 pixel nào.
 *    - Nút Google Sign-In được cố định h-[44px], không pop-in giật layout.
 * 3. React Portal cách ly độc lập ra document.body với z-[999999].
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

    const [mounted, setMounted] = useState(false);
    const [cheDoHienTai, setCheDoHienTai] = useState('dang_nhap'); // 'dang_nhap' | 'dang_ky' | 'quen_mat_khau'
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [matKhauXacNhan, setMatKhauXacNhan] = useState('');
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [maOtp, setMaOtp] = useState('');
    const [ghiNho, setGhiNho] = useState(true);
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

    const googleBtnRef = useRef(null);
    const prevMoModalRef = useRef(false);
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // =========================================================================
    // ENGINE PHÁO HOA RỰC RỠ 60FPS (SIÊU NHẸ, KHÔNG GIẬT LAG)
    // =========================================================================
    const banPhaoHoa = (xCustom, yCustom) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
            canvas.width = rect.width;
            canvas.height = rect.height;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
        }

        const colors = [
            '#00f0ff', '#38bdf8', '#3b82f6', '#6366f1',
            '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
            '#fbbf24', '#f59e0b', '#10b981', '#ffffff'
        ];

        const cx = xCustom !== undefined ? xCustom : canvas.width / 2;
        const cy = yCustom !== undefined ? yCustom : canvas.height * 0.4;

        // Tạo 85 hạt pháo hoa bùng nở hình cầu đa sắc
        const particles = [];
        for (let i = 0; i < 85; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5.2 + 1.2;
            particles.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.2,
                size: Math.random() * 3.2 + 1.4,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                decay: Math.random() * 0.022 + 0.012,
                gravity: 0.11,
                sparkle: Math.random() * 10
            });
        }

        const loop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = 0;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                if (p.alpha <= 0) continue;
                active++;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= 0.98;
                p.alpha -= p.decay;
                p.sparkle += 0.25;

                const twinkle = Math.sin(p.sparkle) * 0.35 + 0.65;
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.alpha * twinkle);
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            if (active > 0) {
                animFrameRef.current = requestAnimationFrame(loop);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        };

        animFrameRef.current = requestAnimationFrame(loop);
    };

    // Dọn dẹp animation frame khi unmount
    useEffect(() => {
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // Tự động đóng modal sau 1.8 giây khi thành công
    useEffect(() => {
        let timer;
        if (thanhCong) {
            banPhaoHoa();
            timer = setTimeout(() => {
                setThanhCong(false);
                dongModalAuth();
            }, 1800);
        }
        return () => clearTimeout(timer);
    }, [thanhCong, dongModalAuth]);

    // Chỉ reset trạng thái KHI MỞ MỚI MODAL
    useEffect(() => {
        if (dangMoModalAuth && !prevMoModalRef.current) {
            setThanhCong(false);
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
            // Bắn pháo hoa chào đón nhẹ nhàng khi mở modal
            setTimeout(() => banPhaoHoa(), 150);
        }
        prevMoModalRef.current = dangMoModalAuth;
    }, [dangMoModalAuth, cheDoAuth]);

    const dongModalVaReset = () => {
        setThanhCong(false);
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

    // Khóa cuộn trang mượt mà - KHÔNG dùng position='fixed' gây nhảy layout
    useEffect(() => {
        if (dangMoModalAuth) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [dangMoModalAuth]);

    // Khởi tạo nút Google Sign-In (Khung cố định, nạp 1 lần duy nhất)
    useEffect(() => {
        if (!dangMoModalAuth || !mounted) return;
        if (cheDoHienTai === 'quen_mat_khau' || (cheDoHienTai === 'dang_ky' && buocDangKy === 2)) return;

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
                    callback: xuLyPhanHoiGoogle,
                    auto_select: false,
                    cancel_on_tap_outside: true
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

        let timer;
        if (window.google?.accounts?.id) {
            timer = setTimeout(khoiTaoNutGoogle, 40);
        } else if (!document.getElementById('gsi-script')) {
            const s = document.createElement('script');
            s.id = 'gsi-script';
            s.src = 'https://accounts.google.com/gsi/client';
            s.async = true;
            s.defer = true;
            s.onload = () => setTimeout(khoiTaoNutGoogle, 40);
            document.head.appendChild(s);
        }

        return () => clearTimeout(timer);
    }, [dangMoModalAuth, mounted, dangNhapGoogle, cheDoHienTai, buocDangKy]);

    // Chuyển đổi chế độ kèm pháo hoa rực rỡ và phản hồi tức thời 0ms
    const chuyenCheDo = (cheDoMoi, buocMoi = 1, e) => {
        if (cheDoHienTai === cheDoMoi && (cheDoMoi !== 'dang_ky' || buocDangKy === buocMoi) && (cheDoMoi !== 'quen_mat_khau' || buocQuenPass === buocMoi)) return;
        setThongBaoLoi('');
        setThongBaoThanhCong('');
        setCheDoHienTai(cheDoMoi);
        if (cheDoMoi === 'dang_ky') setBuocDangKy(buocMoi);
        if (cheDoMoi === 'quen_mat_khau') setBuocQuenPass(buocMoi);
        if (chuyenDoiCheDoAuth) chuyenDoiCheDoAuth(cheDoMoi);

        // Kích hoạt pháo hoa tại vị trí bấm hoặc giữa thẻ
        if (e && e.clientX && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            banPhaoHoa(e.clientX - rect.left, e.clientY - rect.top);
        } else {
            banPhaoHoa();
        }
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
            chuyenCheDo('quen_mat_khau', 2);
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
            chuyenCheDo('quen_mat_khau', 3);
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
    // 2. XỬ LÝ ĐĂNG KÝ
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
            chuyenCheDo('dang_ky', 2);
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

    if (!dangMoModalAuth || !mounted) return null;

    // MÀN HÌNH THÀNH CÔNG
    if (thanhCong) {
        return createPortal(
            <div
                className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
                onClick={(e) => e.target === e.currentTarget && dongModalVaReset()}
            >
                <div className="relative bg-white dark:bg-slate-900 rounded-[30px] p-8 text-center max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 pointer-events-none z-50 w-full h-full"
                    />

                    <button
                        onClick={dongModalVaReset}
                        aria-label="Đóng"
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 border-4 border-emerald-100 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400 shadow-md">
                        <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                        {tieuDeThanhCong}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {moTaThanhCong}
                    </p>
                    <button
                        onClick={dongModalVaReset}
                        className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 active:scale-98 transition-all cursor-pointer"
                    >
                        Tiếp tục mua sắm →
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 animate-[pulse_1.8s_ease-in-out]" />
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    const laFormChinh = cheDoHienTai === 'dang_nhap' || (cheDoHienTai === 'dang_ky' && buocDangKy === 1);

    return createPortal(
        <div
            className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && dongModalVaReset()}
        >
            {/* THẺ MODAL CÔNG NGHỆ - CỐ ĐỊNH CHIỀU CAO VÀ VỊ TRÍ, BẤT ĐỘNG 100% KHÔNG NHẢY DỌC */}
            <div className="relative w-full max-w-[450px] bg-white dark:bg-slate-900 rounded-[28px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] border-2 border-slate-300/80 dark:border-slate-700 overflow-hidden">
                {/* Viền neon rực rỡ trên đỉnh */}
                <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-600 to-purple-600" />

                {/* CANVAS PHÁO HOA RỰC RỠ 60FPS */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 pointer-events-none z-50 w-full h-full"
                />

                {/* HEADER SANG TRỌNG */}
                <div className="relative p-5 pb-3.5 bg-gradient-to-b from-blue-50/80 via-slate-50/40 to-transparent dark:from-slate-800/60 dark:via-slate-800/20 dark:to-transparent border-b-2 border-slate-200 dark:border-slate-800">
                    {/* Nút đóng */}
                    <button
                        onClick={dongModalVaReset}
                        aria-label="Đóng"
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all duration-200 hover:rotate-90 shadow-2xs cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Badge & Thương hiệu */}
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-[11px] tracking-wider shadow-sm shadow-blue-500/30">
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
                    {laFormChinh && (
                        <div className="mt-3.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 flex items-center gap-1 shadow-inner">
                            <button
                                type="button"
                                onClick={(e) => chuyenCheDo('dang_nhap', 1, e)}
                                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer ${
                                    cheDoHienTai === 'dang_nhap'
                                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-blue-500/35'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-slate-700/60'
                                }`}
                            >
                                Đăng Nhập
                            </button>
                            <button
                                type="button"
                                onClick={(e) => chuyenCheDo('dang_ky', 1, e)}
                                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer ${
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

                {/* THÂN MODAL */}
                <div className="p-5 pt-4">
                    {/* KHUNG GOOGLE SIGN-IN DÙNG CHUNG CỐ ĐỊNH h-[44px] */}
                    {laFormChinh && (
                        <div className="mb-3">
                            <div className="relative h-[44px] min-h-[44px] flex justify-center overflow-hidden">
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

                            <div className="relative flex items-center justify-center my-2.5">
                                <div className="border-t-2 border-slate-200 dark:border-slate-700 w-full" />
                                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 dark:text-slate-500 font-bold shrink-0 uppercase tracking-wider">
                                    {cheDoHienTai === 'dang_nhap' ? 'Hoặc đăng nhập với email' : 'Hoặc điền thông tin đăng ký'}
                                </span>
                                <div className="border-t-2 border-slate-200 dark:border-slate-700 w-full" />
                            </div>
                        </div>
                    )}

                    {/* Thông báo lỗi */}
                    {thongBaoLoi && (
                        <div className="mb-2.5 p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-start gap-2">
                            <span className="text-sm shrink-0">⚠️</span>
                            <span className="flex-1">{thongBaoLoi}</span>
                        </div>
                    )}

                    {/* Thông báo thành công */}
                    {thongBaoThanhCong && (
                        <div className="mb-2.5 p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-start gap-2">
                            <span className="text-sm shrink-0">✅</span>
                            <span className="flex-1">{thongBaoThanhCong}</span>
                        </div>
                    )}

                    {/* KHUNG NỘI DUNG CHUYỂN FORM - ĐỒNG BỘ CHIỀU CAO CỐ ĐỊNH h-[290px] KHÔNG NHẢY 1 PIXEL */}
                    <div className="min-h-[290px] h-[290px] flex flex-col justify-between overflow-hidden">
                        {/* ==================================================== */}
                        {/* 1. FORM ĐĂNG NHẬP                                    */}
                        {/* ==================================================== */}
                        {cheDoHienTai === 'dang_nhap' && (
                            <form onSubmit={xuLyDangNhap} className="animate-in fade-in duration-200 flex flex-col justify-between h-full">
                                <div className="space-y-3">
                                    <div className="space-y-1">
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
                                            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/15 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                            <span>Mật Khẩu</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={hienMatKhau ? 'text' : 'password'}
                                                value={matKhau}
                                                onChange={(e) => setMatKhau(e.target.value)}
                                                required
                                                placeholder="Nhập mật khẩu..."
                                                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/15 transition-all"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setHienMatKhau(!hienMatKhau)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                                            >
                                                {hienMatKhau ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hàng Ghi nhớ đăng nhập + Quên mật khẩu cân bằng không gian */}
                                    <div className="flex items-center justify-between text-xs pt-0.5">
                                        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={ghiNho}
                                                onChange={(e) => setGhiNho(e.target.checked)}
                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 cursor-pointer"
                                            />
                                            <span className="text-[11.5px]">Ghi nhớ đăng nhập</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={(e) => chuyenCheDo('quen_mat_khau', 1, e)}
                                            className="text-xs text-blue-600 dark:text-cyan-400 hover:underline font-extrabold cursor-pointer"
                                        >
                                            Quên mật khẩu?
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={dangXuLy || dangXuLyGoogle}
                                        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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

                                    <div className="text-center pt-0.5">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">Bạn chưa có tài khoản? </span>
                                        <button
                                            type="button"
                                            onClick={(e) => chuyenCheDo('dang_ky', 1, e)}
                                            className="text-xs font-black text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                                        >
                                            Đăng ký ngay
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {/* ==================================================== */}
                        {/* 2. FORM ĐĂNG KÝ (XÁC NHẬN MẬT KHẨU 2 LẦN)          */}
                        {/* ==================================================== */}
                        {cheDoHienTai === 'dang_ky' && (
                            <div className="animate-in fade-in duration-200 h-full flex flex-col justify-between">
                                {buocDangKy === 1 ? (
                                    <form onSubmit={xuLyDangKyGuiOtp} className="flex flex-col justify-between h-full">
                                        <div className="space-y-2.5">
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
                                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-blue-500/20 transition-all"
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
                                                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-blue-500/20 transition-all"
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
                                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-blue-500/20 transition-all"
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
                                                            className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-blue-500/20 transition-all"
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
                                                            className="w-full pl-3 pr-7 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-3 focus:ring-blue-500/20 transition-all"
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
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <button
                                                type="submit"
                                                disabled={dangXuLy}
                                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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

                                            <div className="text-center pt-0.5">
                                                <span className="text-xs text-slate-500 dark:text-slate-400">Bạn đã có tài khoản rồi? </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => chuyenCheDo('dang_nhap', 1, e)}
                                                    className="text-xs font-black text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                                                >
                                                    Đăng nhập ngay
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    /* Bước 2: Nhập OTP kích hoạt */
                                    <form onSubmit={xuLyKichHoatDangKy} className="flex flex-col justify-between h-full animate-in fade-in duration-200">
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-center">
                                                <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                                                    Mã OTP kích hoạt đã gửi tới email:
                                                </div>
                                                <div className="text-sm font-black text-blue-950 dark:text-blue-200 truncate">
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
                                                    className="w-full py-3 rounded-xl border-2 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 text-lg font-black tracking-[8px] text-center focus:outline-none focus:border-blue-600 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <button
                                                type="submit"
                                                disabled={dangXuLy}
                                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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
                                                onClick={(e) => chuyenCheDo('dang_ky', 1, e)}
                                                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Thay đổi thông tin đăng ký
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* ==================================================== */}
                        {/* 3. FORM QUÊN MẬT KHẨU                                */}
                        {/* ==================================================== */}
                        {cheDoHienTai === 'quen_mat_khau' && (
                            <div className="animate-in fade-in duration-200 h-full flex flex-col justify-between">
                                {buocQuenPass === 1 && (
                                    <form onSubmit={xuLyGuiOtpQuenPass} className="flex flex-col justify-between h-full">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                                                    <span>Địa Chỉ Email Của Bạn</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="name@example.com"
                                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
                                                />
                                            </div>

                                            {/* Quy trình 3 bước */}
                                            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60">
                                                    <span className="w-6 h-6 mx-auto rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center mb-1">1</span>
                                                    <div className="font-bold text-blue-900 dark:text-blue-200 text-xs">Nhập Email</div>
                                                </div>
                                                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                    <span className="w-6 h-6 mx-auto rounded-lg bg-slate-400 text-white font-black text-xs flex items-center justify-center mb-1">2</span>
                                                    <div className="font-bold text-slate-700 dark:text-slate-300 text-xs">Mã OTP</div>
                                                </div>
                                                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                    <span className="w-6 h-6 mx-auto rounded-lg bg-slate-400 text-white font-black text-xs flex items-center justify-center mb-1">3</span>
                                                    <div className="font-bold text-slate-700 dark:text-slate-300 text-xs">Đổi Pass</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <button
                                                type="submit"
                                                disabled={dangXuLy}
                                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
                                            >
                                                {dangXuLy ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                        <span>Đang gửi mã...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Gửi Mã OTP Xác Thực</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(e) => chuyenCheDo('dang_nhap', 1, e)}
                                                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Đăng nhập
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {buocQuenPass === 2 && (
                                    <form onSubmit={xuLyXacNhanOtpQuenPass} className="flex flex-col justify-between h-full animate-in fade-in duration-200">
                                        <div className="space-y-3">
                                            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-center">
                                                <div className="text-[11px] font-bold text-blue-700 dark:text-blue-300">
                                                    Mã OTP đã gửi đến hộp thư:
                                                </div>
                                                <div className="text-sm font-black text-blue-950 dark:text-blue-200 truncate">
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
                                                    className="w-full py-2.5 rounded-xl border-2 border-blue-400 dark:border-blue-600 bg-blue-50/50 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 text-lg font-black tracking-[8px] text-center focus:outline-none focus:border-blue-600 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <button
                                                type="submit"
                                                disabled={dangXuLy}
                                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
                                            >
                                                {dangXuLy ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                        <span>Đang xác thực...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Xác Thực & Tiếp Tục</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={(e) => chuyenCheDo('quen_mat_khau', 1, e)}
                                                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Nhập lại email
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {buocQuenPass === 3 && (
                                    <form onSubmit={xuLyDoiMatKhau} className="flex flex-col justify-between h-full animate-in fade-in duration-200">
                                        <div className="space-y-3">
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
                                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-500/20 transition-all"
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
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <button
                                                type="submit"
                                                disabled={dangXuLy}
                                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer disabled:opacity-60"
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
                                                onClick={(e) => chuyenCheDo('dang_nhap', 1, e)}
                                                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
                                            >
                                                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại Đăng nhập
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {/* DÒNG CAM KẾT BẢO MẬT THÂN THIỆN */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-[11.5px] font-bold shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Cam kết bảo mật thông tin an toàn 100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
