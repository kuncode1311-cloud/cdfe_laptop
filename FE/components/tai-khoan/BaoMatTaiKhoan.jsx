'use client';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, KeyRound, Shield, Check, RefreshCw, Mail } from 'lucide-react';

// Tab "Đổi Mật Khẩu & Bảo Mật Tài Khoản" của trang tài khoản: tách từ app/tai-khoan/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function BaoMatTaiKhoan({
    laTaiKhoanGoogle,
    nguoiDung,
    xuLyDoiMatKhau,
    canNhapMatKhauCu,
    hienMatKhauCu,
    matKhauCu,
    setMatKhauCu,
    setLoiMatKhauCu,
    loiMatKhauCu,
    setHienMatKhauCu,
    hienMatKhauMoi,
    matKhauMoi,
    setMatKhauMoi,
    setLoiMatKhauMoi,
    loiMatKhauMoi,
    setHienMatKhauMoi,
    diemDoManh,
    tieuChiMatKhau,
    daChamXacNhan,
    loiXacNhanMatKhau,
    xacNhanMatKhauMoi,
    hienXacNhanMatKhau,
    daGuiOtpDoiMatKhau,
    setXacNhanMatKhauMoi,
    setDaChamXacNhan,
    setHienXacNhanMatKhau,
    demNguocDoiPass,
    dangDoiPass,
    xuLyGuiLaiOtpDoiPass,
    otpDoiMatKhau,
    setOtpDoiMatKhau,
    loiChungDoiPass,
    setDaGuiOtpDoiMatKhau
}) {
    return (
        <div className="rounded-3xl bg-white border-2 border-indigo-300 shadow-xl overflow-hidden space-y-0">
            {/* Dải Banner Header Rực Rỡ Gradient Đa Sắc */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-md shrink-0">
                        <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                            <span>Đổi Mật Khẩu & Bảo Mật Tài Khoản</span>
                        </h2>
                        <p className="text-xs text-blue-100 font-medium mt-0.5">
                            Quản lý mật khẩu đăng nhập, bảo vệ thông tin đơn hàng và tài sản voucher an toàn 100%
                        </p>
                    </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-400/25 border border-emerald-300/40 text-emerald-200 text-xs font-black self-start sm:self-auto flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span>Tài khoản an toàn</span>
                </span>
            </div>

            <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
                {/* Centered Container for Security Form & Google Status Card */}
                <div className="max-w-[490px] mx-auto space-y-5">
                    {/* Banner Trạng Thái Tài Khoản Google (Tone Rực Rỡ, Căn Giữa Gọn Gàng) */}
                    {laTaiKhoanGoogle && (
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/70 to-sky-50 border-2 border-blue-400/80 flex items-start gap-3.5 shadow-md shadow-blue-500/10">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center shrink-0 p-2 border-2 border-blue-200">
                                <svg className="w-full h-full" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0 text-xs">
                                <div className="font-black text-slate-900 flex items-center justify-between gap-2">
                                    <span className="text-sm font-black">Tài Khoản Google</span>
                                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-[10.5px] shadow-xs">
                                        ✓ Bảo vệ 2 lớp
                                    </span>
                                </div>
                                <p className="text-slate-700 mt-1 leading-relaxed text-[11.5px] font-semibold">
                                    Đã liên kết an toàn với email <b className="text-blue-700 underline font-black">{nguoiDung?.email}</b>. Bạn có thể thiết lập thêm mật khẩu độc lập để đăng nhập linh hoạt mọi lúc.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form Đổi Mật Khẩu (Căn Giữa, Tinh Tế, Viền Đậm, Đậm Màu) */}
                    <form onSubmit={xuLyDoiMatKhau} className="rounded-2xl border-2 border-indigo-400/90 bg-white shadow-xl shadow-indigo-500/10 overflow-hidden">
                        {/* Form Card Header Ribbon */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30 text-white flex items-center justify-center shadow-xs">
                                    <KeyRound className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white">
                                        {canNhapMatKhauCu ? 'Đổi Mật Khẩu Đăng Nhập' : 'Thiết Lập Mật Khẩu Mới'}
                                    </h3>
                                    <p className="text-[11px] text-blue-100 font-medium">
                                        {canNhapMatKhauCu ? 'Bảo vệ tài khoản với mật khẩu bảo mật cao' : 'Tạo mật khẩu để đăng nhập bằng Email & Mật khẩu'}
                                    </p>
                                </div>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10.5px] shadow-xs">
                                Bảo mật cao
                            </span>
                        </div>

                        <div className="p-5 sm:p-6 space-y-4.5 bg-gradient-to-b from-white to-indigo-50/20">
                            {/* Mật khẩu cũ nếu có */}
                            {canNhapMatKhauCu && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-800 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-300 shadow-2xs">
                                            <Lock className="w-3 h-3 stroke-[2.5]" />
                                        </span>
                                        <span>Mật Khẩu Hiện Tại</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={hienMatKhauCu ? 'text' : 'password'}
                                            required
                                            value={matKhauCu}
                                            onChange={(e) => { setMatKhauCu(e.target.value); setLoiMatKhauCu(''); }}
                                            placeholder="Nhập mật khẩu đang dùng của bạn..."
                                            className={`w-full px-3.5 pr-11 py-2.5 rounded-xl border-2 hover:border-amber-400 bg-white text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:ring-4 transition-all shadow-xs ${loiMatKhauCu ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20' : 'border-amber-300 focus:border-amber-500 focus:ring-amber-400/20'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setHienMatKhauCu(!hienMatKhauCu)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 cursor-pointer p-1"
                                        >
                                            {hienMatKhauCu ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {loiMatKhauCu && (
                                        <p className="text-[11px] font-black text-rose-600 flex items-center gap-1.5 mt-1 bg-rose-50 p-2 rounded-lg border border-rose-300">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            <span>{loiMatKhauCu}</span>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Mật khẩu mới */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-800 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center border border-blue-300 shadow-2xs">
                                        <KeyRound className="w-3 h-3 stroke-[2.5]" />
                                    </span>
                                    <span>{canNhapMatKhauCu ? 'Mật Khẩu Mới' : 'Mật Khẩu Mới Cần Thiết Lập'}</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={hienMatKhauMoi ? 'text' : 'password'}
                                        required
                                        value={matKhauMoi}
                                        onChange={(e) => { setMatKhauMoi(e.target.value); setLoiMatKhauMoi(''); }}
                                        placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự, có chữ và số)..."
                                        className={`w-full px-3.5 pr-11 py-2.5 rounded-xl border-2 hover:border-blue-400 bg-white text-slate-900 text-xs sm:text-sm font-bold focus:outline-none focus:ring-4 transition-all shadow-xs ${loiMatKhauMoi ? 'border-rose-500 focus:border-rose-600 focus:ring-rose-500/20' : 'border-blue-300 focus:border-blue-600 focus:ring-blue-500/20'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setHienMatKhauMoi(!hienMatKhauMoi)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 cursor-pointer p-1"
                                    >
                                        {hienMatKhauMoi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {loiMatKhauMoi && (
                                    <p className="text-[11px] font-black text-rose-600 flex items-center gap-1.5 mt-1 bg-rose-50 p-2 rounded-lg border border-rose-300">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{loiMatKhauMoi}</span>
                                    </p>
                                )}

                                {/* Visual Meter Đo Độ Mạnh Mật Khẩu (Rực Rỡ, Đậm Màu) */}
                                {matKhauMoi && (
                                    <div className="space-y-2.5 p-3.5 rounded-xl bg-gradient-to-r from-slate-50 via-blue-50/60 to-indigo-50/60 border-2 border-indigo-200 mt-2 shadow-xs">
                                        <div className="flex items-center justify-between text-xs font-black">
                                            <span className="text-slate-600">Độ an toàn:</span>
                                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                                                diemDoManh <= 35
                                                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                                    : diemDoManh <= 70
                                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                            }`}>
                                                {diemDoManh <= 35 ? '⚠️ Yếu (Cần thêm)' : diemDoManh <= 70 ? '⚡ Khá tốt' : '🛡️ Rất mạnh & Chuẩn'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-1.5 h-2">
                                            <div className={`rounded-full transition-all duration-300 ${diemDoManh >= 35 ? (diemDoManh > 70 ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : diemDoManh > 35 ? 'bg-amber-500 shadow-xs shadow-amber-500/50' : 'bg-rose-500 shadow-xs shadow-rose-500/50') : 'bg-slate-200'}`} />
                                            <div className={`rounded-full transition-all duration-300 ${diemDoManh >= 70 ? (diemDoManh > 70 ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-amber-500 shadow-xs shadow-amber-500/50') : 'bg-slate-200'}`} />
                                            <div className={`rounded-full transition-all duration-300 ${diemDoManh >= 100 ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50' : 'bg-slate-200'}`} />
                                        </div>

                                        <div className="grid grid-cols-3 gap-1.5 pt-0.5 text-[11px] font-black text-center">
                                            <span className={`px-2 py-1 rounded-lg border flex items-center justify-center gap-1 transition-all ${tieuChiMatKhau.doDai ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-400 border-slate-200'}`}>
                                                {tieuChiMatKhau.doDai ? '✓' : '•'} ≥ 6 Ký tự
                                            </span>
                                            <span className={`px-2 py-1 rounded-lg border flex items-center justify-center gap-1 transition-all ${tieuChiMatKhau.chuHoaThuong ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-400 border-slate-200'}`}>
                                                {tieuChiMatKhau.chuHoaThuong ? '✓' : '•'} Hoa & Thường
                                            </span>
                                            <span className={`px-2 py-1 rounded-lg border flex items-center justify-center gap-1 transition-all ${tieuChiMatKhau.chuSoHoacKyTu ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-400 border-slate-200'}`}>
                                                {tieuChiMatKhau.chuSoHoacKyTu ? '✓' : '•'} Số / Ký tự
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Xác nhận mật khẩu mới */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center border border-purple-300 shadow-2xs">
                                            <Shield className="w-3 h-3 stroke-[2.5]" />
                                        </span>
                                        <span>Xác Nhận Lại Mật Khẩu</span>
                                    </span>
                                    {daChamXacNhan && !loiXacNhanMatKhau && xacNhanMatKhauMoi && xacNhanMatKhauMoi === matKhauMoi && (
                                        <span className="text-xs text-emerald-600 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Trùng khớp 100%
                                        </span>
                                    )}
                                </label>
                                <div className="relative">
                                    <input
                                        type={hienXacNhanMatKhau ? 'text' : 'password'}
                                        required
                                        disabled={daGuiOtpDoiMatKhau}
                                        value={xacNhanMatKhauMoi}
                                        onChange={(e) => {
                                            setXacNhanMatKhauMoi(e.target.value);
                                            setDaChamXacNhan(true);
                                        }}
                                        onBlur={() => setDaChamXacNhan(true)}
                                        placeholder="Nhập lại chính xác mật khẩu..."
                                        className={`w-full px-3.5 pr-11 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold focus:outline-none transition-all shadow-xs ${
                                            daChamXacNhan && loiXacNhanMatKhau
                                                ? 'border-rose-500 bg-rose-50/50 text-rose-900 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/20'
                                                : daChamXacNhan && !loiXacNhanMatKhau && xacNhanMatKhauMoi && xacNhanMatKhauMoi === matKhauMoi
                                                ? 'border-emerald-500 bg-emerald-50/30 text-slate-900 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20'
                                                : 'border-purple-300 hover:border-purple-400 bg-white text-slate-900 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/20'
                                        } ${daGuiOtpDoiMatKhau ? 'bg-slate-50 cursor-not-allowed opacity-80' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setHienXacNhanMatKhau(!hienXacNhanMatKhau)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 cursor-pointer p-1"
                                    >
                                        {hienXacNhanMatKhau ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {daChamXacNhan && loiXacNhanMatKhau && (
                                    <p className="text-[11px] font-black text-rose-600 flex items-center gap-1.5 mt-1 bg-rose-50 p-2 rounded-lg border border-rose-300">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{loiXacNhanMatKhau}</span>
                                    </p>
                                )}
                            </div>

                            {/* BƯỚC 2: KHUNG NHẬP MÃ OTP KHI ĐÃ GỬI THÀNH CÔNG */}
                            {daGuiOtpDoiMatKhau && (
                                <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 animate-in fade-in duration-200">
                                    <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                                                <KeyRound className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900">Xác Thực Mã OTP Bảo Mật</h4>
                                                <p className="text-[10.5px] text-slate-500">Mã 6 chữ số gửi tới: <strong className="text-blue-600">{nguoiDung?.email}</strong></p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            disabled={demNguocDoiPass > 0 || dangDoiPass}
                                            onClick={xuLyGuiLaiOtpDoiPass}
                                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer disabled:text-slate-400 disabled:no-underline"
                                        >
                                            <RefreshCw className={`w-3 h-3 ${dangDoiPass ? 'animate-spin' : ''}`} />
                                            <span>{demNguocDoiPass > 0 ? `Gửi lại (${demNguocDoiPass}s)` : 'Gửi lại mã OTP'}</span>
                                        </button>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-black text-slate-700">Mã Xác Thực (6 chữ số):</label>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            required
                                            value={otpDoiMatKhau}
                                            onChange={(e) => setOtpDoiMatKhau(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="••••••"
                                            className="w-full py-3 rounded-xl border-2 border-indigo-300 bg-white text-indigo-700 text-xl font-black tracking-[8px] text-center focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-400/20 transition-all shadow-xs"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Lỗi chung / Cảnh báo */}
                            {loiChungDoiPass && (
                                <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-300 rounded-xl p-3 text-xs font-bold text-rose-700">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{loiChungDoiPass}</span>
                                </div>
                            )}

                            {/* Nút Submit Rực Rỡ, Đậm Màu */}
                            <div className="pt-2 space-y-2">
                                <button
                                    type="submit"
                                    disabled={dangDoiPass || (daChamXacNhan && !!loiXacNhanMatKhau) || matKhauMoi.length < 8 || (daGuiOtpDoiMatKhau && otpDoiMatKhau.length !== 6)}
                                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-500/30 border-2 border-indigo-400/60 active:scale-[0.98] transition-all cursor-pointer disabled:from-indigo-400 disabled:via-blue-400 disabled:to-purple-400 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {dangDoiPass ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            <span>Đang xử lý bảo mật...</span>
                                        </>
                                    ) : daGuiOtpDoiMatKhau ? (
                                        <>
                                            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                                            <span>Xác Thực & Cập Nhật Mật Khẩu Ngay</span>
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="w-4 h-4 stroke-[2.5]" />
                                            <span>Tiếp Tục & Gửi Mã OTP Qua Email</span>
                                        </>
                                    )}
                                </button>

                                {daGuiOtpDoiMatKhau && (
                                    <button
                                        type="button"
                                        onClick={() => setDaGuiOtpDoiMatKhau(false)}
                                        className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer pt-1 font-bold transition-colors"
                                    >
                                        ← Quay lại chỉnh sửa thông tin mật khẩu
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
