'use client';
import { User, Crown, Copy, Check, Mail, AlertCircle, Calendar, RefreshCw } from 'lucide-react';

// Tab "Hồ Sơ Cá Nhân & Thẻ Thành Viên" của trang tài khoản: tách từ app/tai-khoan/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function HoSoCaNhan({
    nguoiDung,
    hoTen,
    daCopyId,
    saoChepMaId,
    xuLyLuuHoSo,
    daChamHoTen,
    loiHoTen,
    setHoTen,
    setDaChamHoTen,
    daChamSoDienThoai,
    loiSoDienThoai,
    soDienThoai,
    setSoDienThoai,
    setDaChamSoDienThoai,
    gioiTinh,
    setGioiTinh,
    daChamNgaySinh,
    loiNgaySinh,
    ngaySinh,
    setNgaySinh,
    setDaChamNgaySinh,
    dangLuuHoSo
}) {
    return (
        <div className="rounded-3xl bg-white border-2 border-blue-300 shadow-xl overflow-hidden space-y-0">
            {/* Dải Banner Header Rực Rỡ Gradient Đa Sắc */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-md shrink-0">
                        <User className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                        <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                            <span>Hồ Sơ Cá Nhân & Thẻ Thành Viên</span>
                        </h2>
                        <p className="text-xs text-blue-100 font-medium mt-0.5">
                            Cập nhật thông tin chính xác để nhận bảo hành chính hãng và ưu đãi thành viên
                        </p>
                    </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black self-start sm:self-auto flex items-center gap-1.5 shadow-xs">
                    <Crown className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Hội Viên TNTP</span>
                </span>
            </div>

            <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-slate-50/40 to-white">

            {/* THẺ HỘI VIÊN TONE SÁNG CAO CẤP: ĐỒNG ĐIỆU GIAO DIỆN, SANG TRỌNG, GỌN GÀNG */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50/70 to-indigo-50 border-2 border-blue-300/90 shadow-sm relative overflow-hidden space-y-3.5">
                <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-blue-200/25 blur-xl pointer-events-none" />
                <div className="absolute right-4 top-2 text-blue-200/50 pointer-events-none">
                    <Crown className="w-24 h-24 stroke-[1.2]" />
                </div>

                {/* Dòng 1: Huy hiệu thành viên */}
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white font-black text-xs tracking-wider shadow-xs flex items-center gap-1">
                            <Crown className="w-3.5 h-3.5 fill-white" />
                            <span>TNTP STORE</span>
                        </span>
                        <span className="text-[11px] font-black text-blue-800 font-mono tracking-widest px-2.5 py-0.5 rounded-lg bg-white border border-blue-200 shadow-2xs">
                            {nguoiDung?.hangThanhVien || 'THÀNH VIÊN'}
                        </span>
                    </div>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-900 text-xs font-black shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        <span>{nguoiDung?.vaiTro === 'admin' ? 'Quản Trị Viên' : 'Thành Viên Hệ Thống'}</span>
                    </span>
                </div>

                {/* Dòng 2: Chủ sở hữu & Mã KH */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 relative z-10">
                    <div>
                        <div className="text-[10px] uppercase font-black text-blue-800/80 tracking-wider">Chủ sở hữu thẻ</div>
                        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide">{hoTen || 'Thành Viên TNTP'}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs self-start sm:self-auto">
                        <span>Mã KH: {nguoiDung?.id || nguoiDung?._id || 'usr_2026'}</span>
                        <button
                            type="button"
                            onClick={() => saoChepMaId(nguoiDung?.id || nguoiDung?._id || 'usr_2026')}
                            className="p-0.5 text-blue-600 hover:text-blue-800 transition-transform active:scale-90 cursor-pointer"
                            title="Sao chép mã"
                        >
                            {daCopyId ? <Check className="w-3.5 h-3.5 text-emerald-600 font-black" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        {daCopyId && <span className="text-[10px] text-emerald-600 font-black">Đã chép!</span>}
                    </div>
                </div>

                {/* Dòng 3: 2 Ô đặc quyền ưu đãi */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-200/80 text-xs relative z-10">
                    <div className="bg-white border-2 border-blue-300 p-2.5 rounded-xl text-center shadow-2xs">
                        <span className="text-blue-900 text-[10px] block font-black uppercase tracking-wider">Ưu đãi thành viên</span>
                        <b className="text-blue-600 font-black text-base sm:text-lg">Giảm thêm 5%</b>
                    </div>
                    <div className="bg-white border-2 border-emerald-300 p-2.5 rounded-xl text-center shadow-2xs">
                        <span className="text-emerald-900 text-[10px] block font-black uppercase tracking-wider">Vận chuyển hỏa tốc</span>
                        <b className="text-emerald-600 font-black text-base sm:text-lg">Freeship 100%</b>
                    </div>
                </div>
            </div>

            {/* CÁC PHẦN FORM ĐƯỢC TÁCH BIỆT BẰNG VIỀN ĐẬM RÕ RÀNG */}
            <form onSubmit={xuLyLuuHoSo} className="space-y-5">
                {/* SECTION 1: TÀI KHOẢN & EMAIL (VIỀN XANH DƯƠNG ĐẬM) */}
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-blue-300 bg-blue-50/80 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-blue-900 uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                            <Mail className="w-3.5 h-3.5" />
                        </div>
                        <span>Tài Khoản & Email Xác Thực</span>
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            disabled
                            value={nguoiDung?.email || ''}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 bg-white text-slate-800 text-xs sm:text-sm font-bold cursor-not-allowed shadow-2xs"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-black border border-emerald-300">
                            ✓ Đã xác thực OTP
                        </span>
                    </div>
                </div>

                {/* SECTION 2: THÔNG TIN GIAO NHẬN (VIỀN CHÀM INDIGO ĐẬM) */}
                <div className="p-4 sm:p-5 rounded-2xl border-2 border-indigo-300 bg-indigo-50/70 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black text-indigo-950 uppercase tracking-wide">
                        <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                            <User className="w-3.5 h-3.5" />
                        </div>
                        <span>Thông Tin Người Nhận Hàng</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <span>Họ và Tên</span>
                                    <span className="text-rose-500">*</span>
                                </span>
                                {daChamHoTen && !loiHoTen && hoTen.trim() && (
                                    <span className="text-[10.5px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                                        <Check className="w-3 h-3" /> Hợp lệ
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={hoTen}
                                    onChange={(e) => {
                                        setHoTen(e.target.value);
                                        setDaChamHoTen(true);
                                    }}
                                    onBlur={() => setDaChamHoTen(true)}
                                    placeholder="Nhập họ và tên..."
                                    className={`w-full px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold focus:outline-none transition-all shadow-xs ${
                                        daChamHoTen && loiHoTen
                                            ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                                            : daChamHoTen && !loiHoTen && hoTen.trim()
                                            ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                                    }`}
                                />
                                {daChamHoTen && loiHoTen && (
                                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                                {daChamHoTen && !loiHoTen && hoTen.trim() && (
                                    <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                            </div>
                            {daChamHoTen && loiHoTen && (
                                <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{loiHoTen}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <span>Số Điện Thoại Nhận Máy</span>
                                    <span className="text-rose-500">*</span>
                                </span>
                                {daChamSoDienThoai && !loiSoDienThoai && soDienThoai.trim() && (
                                    <span className="text-[10.5px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                                        <Check className="w-3 h-3" /> Chuẩn 10 số
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    value={soDienThoai}
                                    onChange={(e) => {
                                        setSoDienThoai(e.target.value);
                                        setDaChamSoDienThoai(true);
                                    }}
                                    onBlur={() => setDaChamSoDienThoai(true)}
                                    placeholder="0912 345 678"
                                    className={`w-full px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold focus:outline-none transition-all shadow-xs ${
                                        daChamSoDienThoai && loiSoDienThoai
                                            ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                                            : daChamSoDienThoai && !loiSoDienThoai && soDienThoai.trim()
                                            ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                                    }`}
                                />
                                {daChamSoDienThoai && loiSoDienThoai && (
                                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                                {daChamSoDienThoai && !loiSoDienThoai && soDienThoai.trim() && (
                                    <Check className="w-4 h-4 text-emerald-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                            </div>
                            {daChamSoDienThoai && loiSoDienThoai && (
                                <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{loiSoDienThoai}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-800">
                                Giới Tính
                            </label>
                            <div className="flex items-center gap-2 pt-0.5">
                                {[
                                    { id: 'nam', label: 'Nam' },
                                    { id: 'nu', label: 'Nữ' },
                                    { id: 'khac', label: 'Khác' }
                                ].map((gt) => (
                                    <button
                                        key={gt.id}
                                        type="button"
                                        onClick={() => setGioiTinh(gt.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                                            gioiTinh === gt.id
                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                                                : 'border-slate-300 bg-white text-slate-700 hover:border-indigo-300'
                                        }`}
                                    >
                                        {gt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Ngày Sinh</span>
                                </span>
                                {daChamNgaySinh && !loiNgaySinh && ngaySinh && (
                                    <span className="text-[10.5px] text-emerald-600 font-extrabold flex items-center gap-0.5">
                                        <Check className="w-3 h-3" /> Hợp lệ
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={ngaySinh}
                                    onChange={(e) => {
                                        setNgaySinh(e.target.value);
                                        setDaChamNgaySinh(true);
                                    }}
                                    onBlur={() => setDaChamNgaySinh(true)}
                                    className={`w-full px-4 py-2 rounded-xl border-2 text-xs sm:text-sm font-bold focus:outline-none transition-all shadow-xs ${
                                        daChamNgaySinh && loiNgaySinh
                                            ? 'border-rose-500 bg-rose-50/40 text-rose-900 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                                            : daChamNgaySinh && !loiNgaySinh && ngaySinh
                                            ? 'border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                            : 'border-slate-300 bg-white text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100'
                                    }`}
                                />
                                {daChamNgaySinh && loiNgaySinh && (
                                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                                {daChamNgaySinh && !loiNgaySinh && ngaySinh && (
                                    <Check className="w-4 h-4 text-emerald-600 absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" />
                                )}
                            </div>
                            {daChamNgaySinh && loiNgaySinh && (
                                <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    <span>{loiNgaySinh}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={dangLuuHoSo || (daChamHoTen && !!loiHoTen) || (daChamSoDienThoai && !!loiSoDienThoai) || (daChamNgaySinh && !!loiNgaySinh)}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-indigo-500/25 active:scale-98 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {dangLuuHoSo ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Đang lưu thông tin...</span>
                            </>
                        ) : (
                            <>
                                <span>Lưu Thông Tin Hồ Sơ</span>
                                <Check className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
    );
}
