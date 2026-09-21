'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, CheckCircle2, KeyRound, ShieldCheck, ArrowLeft, RefreshCw, Send, Sparkles } from 'lucide-react';
import { useNguoiDung } from '@/contexts/AuthContext';

const GOOGLE_CLIENT_ID = '789044829668-4uhe7csc4tq093jifv1vul2ofgm5vkt7.apps.googleusercontent.com';

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
    const [buocQuenPass, setBuocQuenPass] = useState(1); // 1: nhập email, 2: nhập OTP & pass mới
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

    // Đồng bộ chế độ từ AuthContext
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

    // Timer đếm ngược gửi lại OTP
    useEffect(() => {
        let timer;
        if (demNguoc > 0) {
            timer = setInterval(() => setDemNguoc((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [demNguoc]);

    // Khóa scroll body khi modal mở
    useEffect(() => {
        if (dangMoModalAuth) {
            const scrollY = window.scrollY;
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            return () => {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [dangMoModalAuth]);

    // Google Sign-In button
    useEffect(() => {
        if (!dangMoModalAuth || cheDoHienTai === 'quen_mat_khau' || (cheDoHienTai === 'dang_ky' && buocDangKy === 2)) return;

        const handleCB = async (res) => {
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

        const init = () => {
            if (!window.google?.accounts?.id || !googleBtnRef.current) return;
            try {
                window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCB });
                window.google.accounts.id.renderButton(googleBtnRef.current, {
                    type: 'standard',
                    shape: 'pill',
                    theme: 'outline',
                    size: 'large',
                    text: 'continue_with',
                    logo_alignment: 'center',
                    width: googleBtnRef.current.offsetWidth || 360
                });
            } catch (e) { }
        };

        if (document.getElementById('gsi-s')) setTimeout(init, 200);
        else {
            const s = document.createElement('script');
            s.id = 'gsi-s';
            s.src = 'https://accounts.google.com/gsi/client';
            s.async = true;
            s.defer = true;
            s.onload = () => setTimeout(init, 100);
            document.head.appendChild(s);
        }
    }, [dangMoModalAuth, cheDoHienTai, buocDangKy, dangNhapGoogle]);

    if (!dangMoModalAuth) return null;

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

    // Bước 2: Xác thực mã OTP trước khi cho phép đặt mật khẩu mới
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
            setThongBaoLoi(err.message || 'Mã OTP không chính xác hoặc đã hết hạn, vui lòng kiểm tra lại email!');
        } finally {
            setDangXuLy(false);
        }
    };

    // Bước 3: Đặt lại mật khẩu mới
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
    // 2. XỬ LÝ ĐĂNG KÝ (GỬI OTP KÍCH HOẠT)
    // ==========================================
    const xuLyDangKyGuiOtp = async (e) => {
        e.preventDefault();
        setThongBaoLoi('');
        setThongBaoThanhCong('');
        if (!hoTen.trim() || !email.trim() || !soDienThoai.trim() || !matKhau) {
            setThongBaoLoi('Vui lòng điền đầy đủ tất cả các trường thông tin!');
            return;
        }
        if (matKhau.length < 6) {
            setThongBaoLoi('Mật khẩu phải có tối thiểu 6 ký tự!');
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
            setMoTaThanhCong('Chào mừng bạn gia nhập thành viên TNTP Laptop. Bạn đã nhận được ưu đãi chào mừng!');
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

    // Màn hình thông báo thành công
    if (thanhCong) return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)' }}>
            <div style={{ background: 'white', borderRadius: '24px', padding: '36px 32px', textAlign: 'center', maxWidth: '360px', width: '92%', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.2)' }}>
                <div style={{ width: '68px', height: '68px', background: '#eff6ff', border: '3px solid #dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle2 style={{ width: '38px', height: '38px', color: '#1d4ed8' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>{tieuDeThanhCong}</h3>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 24px', lineHeight: 1.5 }}>{moTaThanhCong}</p>
                <button onClick={dongModalAuth} style={{ width: '100%', padding: '13px', borderRadius: '14px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', fontWeight: '700', fontSize: '14.5px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px -4px rgba(29,78,216,0.35)' }}>
                    Tiếp tục mua sắm →
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={e => e.target === e.currentTarget && dongModalAuth()}>

            <div style={{ width: '100%', maxWidth: '430px', background: 'white', borderRadius: '24px', boxShadow: '0 25px 60px -12px rgba(15,23,42,0.25)', overflow: 'hidden', border: '1px solid #f1f5f9' }}>

                {/* HEADER SANG TRỌNG */}
                <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', padding: '22px 24px 18px', borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
                    <button onClick={dongModalAuth} aria-label="Đóng"
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        <X style={{ width: '16px', height: '16px' }} />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ background: '#1d4ed8', borderRadius: '8px', padding: '3px 9px', fontSize: '11px', fontWeight: '900', color: 'white', letterSpacing: '0.05em' }}>TNTP</div>
                        <span style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: '800', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Laptop Store</span>
                    </div>

                    <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 3px' }}>
                        {cheDoHienTai === 'dang_nhap' && 'Đăng Nhập'}
                        {cheDoHienTai === 'dang_ky' && (buocDangKy === 1 ? 'Đăng Ký Tài Khoản' : 'Xác Thực Email')}
                        {cheDoHienTai === 'quen_mat_khau' && (
                            buocQuenPass === 1 ? 'Quên Mật Khẩu' : (buocQuenPass === 2 ? 'Xác Thực Mã OTP' : 'Đặt Mật Khẩu Mới')
                        )}
                    </h2>

                    {cheDoHienTai === 'dang_nhap' && (
                        <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                            Bạn chưa có tài khoản?
                            <button
                                onClick={() => {
                                    setThongBaoLoi('');
                                    setThongBaoThanhCong('');
                                    setCheDoHienTai('dang_ky');
                                    setBuocDangKy(1);
                                    chuyenDoiCheDoAuth('dang_ky');
                                }}
                                style={{ marginLeft: '6px', color: '#1d4ed8', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12.5px', textDecoration: 'underline' }}>
                                Đăng ký ngay
                            </button>
                        </p>
                    )}

                    {cheDoHienTai === 'dang_ky' && buocDangKy === 1 && (
                        <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                            Bạn đã có tài khoản rồi?
                            <button
                                onClick={() => {
                                    setThongBaoLoi('');
                                    setThongBaoThanhCong('');
                                    setCheDoHienTai('dang_nhap');
                                    chuyenDoiCheDoAuth('dang_nhap');
                                }}
                                style={{ marginLeft: '6px', color: '#1d4ed8', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12.5px', textDecoration: 'underline' }}>
                                Đăng nhập ngay
                            </button>
                        </p>
                    )}

                    {cheDoHienTai === 'dang_ky' && buocDangKy === 2 && (
                        <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                            Nhập mã OTP vừa được gửi về hộp thư email của bạn
                        </p>
                    )}

                    {cheDoHienTai === 'quen_mat_khau' && (
                        <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                            {buocQuenPass === 1 && 'Hệ thống sẽ gửi mã xác thực an toàn tới email của bạn'}
                            {buocQuenPass === 2 && 'Nhập mã OTP 6 số đã được gửi về hộp thư của bạn'}
                            {buocQuenPass === 3 && 'Thiết lập mật khẩu mới cho tài khoản của bạn'}
                        </p>
                    )}
                </div>

                {/* FORM BODY */}
                <div style={{ padding: '22px 26px 26px' }}>

                    {/* Alert lỗi */}
                    {thongBaoLoi && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#b91c1c', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>⚠️</span> <span>{thongBaoLoi}</span>
                        </div>
                    )}

                    {/* Alert thành công */}
                    {thongBaoThanhCong && (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#15803d', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>✅</span> <span>{thongBaoThanhCong}</span>
                        </div>
                    )}

                    {/* ==================================================== */}
                    {/* TRƯỜNG HỢP 1: QUÊN MẬT KHẨU (3 BƯỚC CHUẨN XÁC)       */}
                    {/* ==================================================== */}
                    {cheDoHienTai === 'quen_mat_khau' && (
                        <div>
                            {/* BƯỚC 1: NHẬP EMAIL */}
                            {buocQuenPass === 1 && (
                                <form onSubmit={xuLyGuiOtpQuenPass} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                            Địa Chỉ Email Của Bạn <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: '#94a3b8' }} />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                placeholder="VD: trikun114@gmail.com"
                                                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#f8fafc', fontSize: '14px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                                onFocus={e => { e.target.style.borderColor = '#1d4ed8'; e.target.style.background = '#ffffff'; }}
                                                onBlur={e => { e.target.style.borderColor = '#cbd5e1'; }}
                                            />
                                        </div>
                                        <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '5px 0 0' }}>Mã OTP 6 số sẽ được gửi trực tiếp đến hộp thư này.</p>
                                    </div>

                                    <button type="submit" disabled={dangXuLy}
                                        style={{ padding: '13px', borderRadius: '14px', background: dangXuLy ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', fontWeight: '700', fontSize: '14.5px', border: 'none', cursor: dangXuLy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 18px -2px rgba(29,78,216,0.3)' }}>
                                        {dangXuLy ? (
                                            <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /><span>Đang gửi mã OTP...</span></>
                                        ) : (
                                            <><span>Gửi Mã Xác Thực OTP</span><Send style={{ width: '15px', height: '15px' }} /></>
                                        )}
                                    </button>

                                    <button type="button" onClick={() => { setCheDoHienTai('dang_nhap'); setThongBaoLoi(''); setThongBaoThanhCong(''); }}
                                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <ArrowLeft style={{ width: '15px', height: '15px' }} /> Quay lại Đăng nhập
                                    </button>
                                </form>
                            )}

                            {/* BƯỚC 2: CHỈ NHẬP VÀ XÁC THỰC MÃ OTP */}
                            {buocQuenPass === 2 && (
                                <form onSubmit={xuLyXacNhanOtpQuenPass} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '12px 16px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '2px' }}>Mã OTP đã được gửi đến email:</div>
                                        <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#1d4ed8' }}>{email}</div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                                                Mã Xác Thực OTP (6 số) <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <button
                                                type="button"
                                                disabled={demNguoc > 0 || dangXuLy}
                                                onClick={xuLyGuiOtpQuenPass}
                                                style={{ fontSize: '11.5px', color: demNguoc > 0 ? '#94a3b8' : '#1d4ed8', background: 'none', border: 'none', cursor: demNguoc > 0 ? 'not-allowed' : 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                <RefreshCw style={{ width: '12px', height: '12px' }} />
                                                {demNguoc > 0 ? `Gửi lại sau (${demNguoc}s)` : 'Gửi lại mã'}
                                            </button>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <KeyRound style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: '#1d4ed8' }} />
                                            <input
                                                type="text"
                                                maxLength={6}
                                                required
                                                value={maOtp}
                                                onChange={e => setMaOtp(e.target.value.replace(/\D/g, ''))}
                                                placeholder="Nhập 6 số trong email..."
                                                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '2px solid #93c5fd', background: '#eff6ff', fontSize: '18px', fontWeight: '800', letterSpacing: '6px', color: '#1d4ed8', outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={dangXuLy}
                                        style={{ padding: '13px', borderRadius: '14px', background: dangXuLy ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', fontWeight: '700', fontSize: '14.5px', border: 'none', cursor: dangXuLy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 18px -2px rgba(29,78,216,0.35)' }}>
                                        {dangXuLy ? (
                                            <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /><span>Đang kiểm tra OTP...</span></>
                                        ) : (
                                            <><span>Xác Thực Mã OTP</span><ArrowRight style={{ width: '16px', height: '16px' }} /></>
                                        )}
                                    </button>

                                    <button type="button" onClick={() => { setBuocQuenPass(1); setThongBaoLoi(''); setThongBaoThanhCong(''); }}
                                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <ArrowLeft style={{ width: '14px', height: '14px' }} /> Thay đổi email
                                    </button>
                                </form>
                            )}

                            {/* BƯỚC 3: KHI OTP ĐÃ CHÍNH XÁC MỚI HIỆN Ô NHẬP PASS MỚI */}
                            {buocQuenPass === 3 && (
                                <form onSubmit={xuLyDoiMatKhau} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle2 style={{ width: '18px', height: '18px', color: '#16a34a', flexShrink: 0 }} />
                                        <div style={{ fontSize: '12.5px', color: '#166534', fontWeight: '600' }}>
                                            Mã OTP hợp lệ! Hãy nhập mật khẩu mới cho tài khoản:
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                            Mật Khẩu Mới <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: '#94a3b8' }} />
                                            <input
                                                type={hienMatKhau ? 'text' : 'password'}
                                                value={matKhau}
                                                onChange={e => setMatKhau(e.target.value)}
                                                required
                                                placeholder="Tối thiểu 6 ký tự..."
                                                style={{ width: '100%', padding: '11px 40px 11px 42px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#f8fafc', fontSize: '13.5px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                            <button type="button" onClick={() => setHienMatKhau(!hienMatKhau)}
                                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}>
                                                {hienMatKhau ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                            Xác Nhận Mật Khẩu Mới <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <ShieldCheck style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: '#94a3b8' }} />
                                            <input
                                                type={hienMatKhauXacNhan ? 'text' : 'password'}
                                                value={matKhauXacNhan}
                                                onChange={e => setMatKhauXacNhan(e.target.value)}
                                                required
                                                placeholder="Nhập lại chính xác mật khẩu..."
                                                style={{ width: '100%', padding: '11px 40px 11px 42px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#f8fafc', fontSize: '13.5px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                            />
                                            <button type="button" onClick={() => setHienMatKhauXacNhan(!hienMatKhauXacNhan)}
                                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}>
                                                {hienMatKhauXacNhan ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={dangXuLy}
                                        style={{ marginTop: '6px', padding: '13px', borderRadius: '14px', background: dangXuLy ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', fontWeight: '700', fontSize: '14.5px', border: 'none', cursor: dangXuLy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 18px -2px rgba(29,78,216,0.35)' }}>
                                        {dangXuLy ? (
                                            <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /><span>Đang lưu mật khẩu...</span></>
                                        ) : (
                                            <><span>Lưu Mật Khẩu & Đăng Nhập</span><ArrowRight style={{ width: '16px', height: '16px' }} /></>
                                        )}
                                    </button>

                                    <button type="button" onClick={() => { setCheDoHienTai('dang_nhap'); setThongBaoLoi(''); setThongBaoThanhCong(''); }}
                                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <ArrowLeft style={{ width: '14px', height: '14px' }} /> Quay lại Đăng nhập
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* ==================================================== */}
                    {/* TRƯỜNG HỢP 2: ĐĂNG KÝ TÀI KHOẢN MỚI                  */}
                    {/* ==================================================== */}
                    {cheDoHienTai === 'dang_ky' && (
                        <div>
                            {buocDangKy === 1 ? (
                                /* Bước 1: Điền thông tin đăng ký */
                                <div>
                                    {/* Google Button */}
                                    <div style={{ position: 'relative', minHeight: '44px', display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                                        <div ref={googleBtnRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em' }}>HOẶC ĐIỀN THÔNG TIN</span>
                                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                                    </div>

                                    <form onSubmit={xuLyDangKyGuiOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>Họ và Tên</label>
                                            <div style={{ position: 'relative' }}>
                                                <User style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                                                <input type="text" required value={hoTen} onChange={e => setHoTen(e.target.value)} placeholder="Nguyễn Văn An"
                                                    style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#f8fafc', fontSize: '13.5px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>Email Nhận Mã OTP</label>
                                            <div style={{ position: 'relative' }}>
                                                <Mail style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="VD: trikun114@gmail.com"
                                                    style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#f8fafc', fontSize: '13.5px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>Số Điện Thoại</label>
                                            <div style={{ position: 'relative' }}>
                                                <Phone style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                                                <input type="tel" required value={soDienThoai} onChange={e => setSoDienThoai(e.target.value)} placeholder="0912 345 678"
                                                    style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#f8fafc', fontSize: '13.5px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>Mật Khẩu</label>
                                            <div style={{ position: 'relative' }}>
                                                <Lock style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                                                <input
                                                    type={hienMatKhau ? 'text' : 'password'}
                                                    value={matKhau}
                                                    onChange={e => setMatKhau(e.target.value)}
                                                    required
                                                    placeholder="Tối thiểu 6 ký tự..."
                                                    style={{ width: '100%', padding: '11px 40px 11px 38px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#f8fafc', fontSize: '13.5px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                                />
                                                <button type="button" onClick={() => setHienMatKhau(!hienMatKhau)}
                                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}>
                                                    {hienMatKhau ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                                                </button>
                                            </div>
                                        </div>

                                        <button type="submit" disabled={dangXuLy}
                                            style={{ marginTop: '6px', padding: '13px', borderRadius: '14px', background: dangXuLy ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', fontWeight: '700', fontSize: '14.5px', border: 'none', cursor: dangXuLy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 18px -2px rgba(29,78,216,0.3)' }}>
                                            {dangXuLy ? (
                                                <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /><span>Đang gửi mã OTP...</span></>
                                            ) : (
                                                <><span>Tiếp Tục & Nhận Mã OTP</span><ArrowRight style={{ width: '16px', height: '16px' }} /></>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                /* Bước 2: Nhập OTP kích hoạt */
                                <form onSubmit={xuLyKichHoatDangKy} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '12px 16px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '2px' }}>Mã OTP kích hoạt đã được gửi tới email:</div>
                                        <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#1d4ed8' }}>{email}</div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                            <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                                                Mã Xác Thực OTP (6 số) <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <button
                                                type="button"
                                                disabled={demNguoc > 0 || dangXuLy}
                                                onClick={xuLyDangKyGuiOtp}
                                                style={{ fontSize: '11.5px', color: demNguoc > 0 ? '#94a3b8' : '#1d4ed8', background: 'none', border: 'none', cursor: demNguoc > 0 ? 'not-allowed' : 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                <RefreshCw style={{ width: '12px', height: '12px' }} />
                                                {demNguoc > 0 ? `Gửi lại sau (${demNguoc}s)` : 'Gửi lại mã'}
                                            </button>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <KeyRound style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '17px', height: '17px', color: '#1d4ed8' }} />
                                            <input
                                                type="text"
                                                maxLength={6}
                                                required
                                                value={maOtp}
                                                onChange={e => setMaOtp(e.target.value.replace(/\D/g, ''))}
                                                placeholder="Nhập 6 số trong email..."
                                                style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '2px solid #93c5fd', background: '#eff6ff', fontSize: '18px', fontWeight: '800', letterSpacing: '6px', color: '#1d4ed8', outline: 'none', boxSizing: 'border-box', textAlign: 'center' }}
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={dangXuLy}
                                        style={{ padding: '13px', borderRadius: '14px', background: dangXuLy ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', fontWeight: '700', fontSize: '14.5px', border: 'none', cursor: dangXuLy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 18px -2px rgba(29,78,216,0.35)' }}>
                                        {dangXuLy ? (
                                            <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /><span>Đang kích hoạt...</span></>
                                        ) : (
                                            <><span>Kích Hoạt Tài Khoản Ngay</span><Sparkles style={{ width: '16px', height: '16px' }} /></>
                                        )}
                                    </button>

                                    <button type="button" onClick={() => { setBuocDangKy(1); setThongBaoLoi(''); setThongBaoThanhCong(''); }}
                                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                        <ArrowLeft style={{ width: '14px', height: '14px' }} /> Thay đổi thông tin đăng ký
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {/* ==================================================== */}
                    {/* TRƯỜNG HỢP 3: ĐĂNG NHẬP                              */}
                    {/* ==================================================== */}
                    {cheDoHienTai === 'dang_nhap' && (
                        <div>
                            {/* Google Sign-In */}
                            <div style={{ position: 'relative', minHeight: '44px', display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                <div ref={googleBtnRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
                                {dangXuLyGoogle && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '24px' }}>
                                        <div style={{ width: '16px', height: '16px', border: '2px solid #1d4ed8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                        <span style={{ fontSize: '12.5px', color: '#334155', fontWeight: '600' }}>Đang xác thực Google...</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.06em' }}>HOẶC DÙNG EMAIL</span>
                                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                            </div>

                            <form onSubmit={xuLyDangNhap} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com"
                                            style={{ width: '100%', padding: '11px 14px 11px 38px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#f8fafc', fontSize: '13.5px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                        <label style={{ fontSize: '12.5px', fontWeight: '700', color: '#334155' }}>Mật Khẩu</label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCheDoHienTai('quen_mat_khau');
                                                setBuocQuenPass(1);
                                                setThongBaoLoi('');
                                                setThongBaoThanhCong('');
                                                setMaOtp('');
                                            }}
                                            style={{ fontSize: '12px', color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}
                                        >
                                            Quên mật khẩu?
                                        </button>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Lock style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#94a3b8' }} />
                                        <input
                                            type={hienMatKhau ? 'text' : 'password'}
                                            value={matKhau}
                                            onChange={e => setMatKhau(e.target.value)}
                                            required
                                            placeholder="Nhập mật khẩu..."
                                            style={{ width: '100%', padding: '11px 40px 11px 38px', borderRadius: '12px', border: '1.5px solid #cbd5e1', background: '#f8fafc', fontSize: '13.5px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
                                        />
                                        <button type="button" onClick={() => setHienMatKhau(!hienMatKhau)}
                                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}>
                                            {hienMatKhau ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={dangXuLy || dangXuLyGoogle}
                                    style={{ marginTop: '6px', padding: '13px', borderRadius: '14px', background: dangXuLy ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: 'white', fontWeight: '700', fontSize: '14.5px', border: 'none', cursor: dangXuLy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 6px 18px -2px rgba(29,78,216,0.3)', transition: 'all 0.2s' }}>
                                    {dangXuLy ? (
                                        <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /><span>Đang xử lý...</span></>
                                    ) : (
                                        <><span>Đăng Nhập Ngay</span><ArrowRight style={{ width: '16px', height: '16px' }} /></>
                                    )}
                                </button>

                                <p style={{ textAlign: 'center', fontSize: '11.5px', color: '#94a3b8', margin: '4px 0 0' }}>
                                    🔒 Bảo mật SSL 256-bit · Thông tin được mã hóa an toàn
                                </p>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}
