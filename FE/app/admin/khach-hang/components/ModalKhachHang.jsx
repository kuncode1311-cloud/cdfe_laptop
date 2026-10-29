'use client';
import { X, User, Mail, Phone, ShieldCheck, Activity, AlertTriangle, Loader2, Save } from 'lucide-react';

// Modal Thêm/Sửa khách hàng của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ModalKhachHang({
    dangMoModalUser,
    setDangMoModalUser,
    userDangSua,
    formUser,
    setFormUser,
    xuLyLuuUser,
    dangLuuUser
}) {
    if (!dangMoModalUser) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-emerald-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                {/* Header Xanh Emerald Thanh Lịch */}
                <div className="shrink-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                            👤
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    {userDangSua ? 'Cập Nhật' : 'Thêm Mới'}
                                </span>
                                <span className="text-[11px] text-emerald-100 font-mono font-bold">
                                    {formUser.vaiTro === 'admin' ? '👑 Admin' : 'Khách hàng'}
                                </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                {userDangSua ? 'Cập Nhật Tài Khoản' : 'Thêm Thành Viên Mới'}
                            </h3>
                            <p className="text-xs text-emerald-100 font-medium">Thiết lập thông tin người dùng và phân quyền hệ thống</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => !dangLuuUser && setDangMoModalUser(false)}
                        className="p-2 rounded-full bg-white/15 hover:bg-white/30 cursor-pointer transition-colors text-white"
                        title="Đóng cửa sổ"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={xuLyLuuUser} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">

                        {/* AVATAR & THÔNG TIN TÓM TẮT TRỰC QUAN */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
                            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-lg font-black shrink-0 shadow-md">
                                {(formUser.hoTen || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="font-black text-slate-900 dark:text-white text-sm truncate">
                                    {formUser.hoTen || 'Người dùng mới'}
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] truncate">
                                    {formUser.email || 'user@example.com'}
                                </div>
                                <div className="mt-1 flex items-center gap-1.5">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        formUser.vaiTro === 'admin'
                                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    }`}>
                                        {formUser.vaiTro === 'admin' ? '👑 Quản Trị Viên' : '👤 Khách Hàng'}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        (formUser.trangThai === 'bi_khoa' || formUser.biKhoa)
                                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    }`}>
                                        {(formUser.trangThai === 'bi_khoa' || formUser.biKhoa) ? '🔒 Tạm khóa' : '🟢 Hoạt động'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>Họ Và Tên *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nguyễn Văn An..."
                                    value={formUser.hoTen}
                                    onChange={(e) => setFormUser({ ...formUser, hoTen: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>Địa Chỉ Email *</span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="user@example.com"
                                    value={formUser.email}
                                    onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                    <span>Số Điện Thoại</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="0912345678"
                                    value={formUser.soDienThoai}
                                    onChange={(e) => setFormUser({ ...formUser, soDienThoai: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold font-mono text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                        <span>Phân Quyền Vai Trò</span>
                                    </label>
                                    <select
                                        value={formUser.vaiTro}
                                        onChange={(e) => setFormUser({ ...formUser, vaiTro: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="khach_hang">👤 Khách Hàng</option>
                                        <option value="admin">👑 Quản Trị Viên (Admin)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                        <span>Trạng Thái Tài Khoản</span>
                                    </label>
                                    <select
                                        value={formUser.trangThai || (formUser.biKhoa ? 'bi_khoa' : 'hoat_dong')}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormUser({
                                                ...formUser,
                                                trangThai: val,
                                                biKhoa: val === 'bi_khoa',
                                                lyDoKhoa: val === 'bi_khoa' ? (formUser.lyDoKhoa || 'Quản trị viên tạm khóa tài khoản') : ''
                                            });
                                        }}
                                        className={`w-full px-3.5 py-2.5 rounded-xl border font-bold text-xs focus:outline-none transition-all cursor-pointer ${
                                            (formUser.trangThai === 'bi_khoa' || formUser.biKhoa)
                                                ? 'border-red-400 bg-red-50/60 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                                                : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-emerald-500'
                                        }`}
                                    >
                                        <option value="hoat_dong">🟢 Đang Hoạt Động</option>
                                        <option value="bi_khoa">🔒 Tạm Khóa</option>
                                        <option value="cho_kich_hoat">⏳ Chờ Kích Hoạt OTP</option>
                                    </select>
                                </div>
                            </div>

                            {(formUser.trangThai === 'bi_khoa' || formUser.biKhoa) && (
                                <div className="space-y-1.5 animate-in fade-in pt-1">
                                    <label className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                                        <span>Lý Do Khóa Tài Khoản</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formUser.lyDoKhoa || ''}
                                        onChange={(e) => setFormUser({ ...formUser, lyDoKhoa: e.target.value })}
                                        placeholder="Ví dụ: Vi phạm chính sách / Nghi ngờ spam..."
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50/30 dark:bg-red-950/20 text-rose-900 dark:text-rose-200 font-medium text-xs focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pinned Footer */}
                    <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                        <button
                            type="button"
                            disabled={dangLuuUser}
                            onClick={() => setDangMoModalUser(false)}
                            className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            Hủy Bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={dangLuuUser}
                            className={`px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all ${dangLuuUser ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                        >
                            {dangLuuUser ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{dangLuuUser ? 'Đang lưu tài khoản...' : (userDangSua ? 'Lưu Thay Đổi' : 'Thêm Tài Khoản')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
