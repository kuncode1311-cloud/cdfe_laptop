'use client';
import {
    X,
    Ticket,
    BadgePercent,
    Gift,
    CircleDollarSign,
    ShoppingBag,
    Layers,
    Calendar,
    Tag,
    Palette,
    Flame,
    FileText,
    Loader2,
    Save
} from 'lucide-react';

// Modal Thêm/Sửa voucher của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ModalVoucher({
    dangMoModalVoucher,
    setDangMoModalVoucher,
    voucherDangSua,
    formVoucher,
    setFormVoucher,
    xuLyLuuVoucher,
    dangLuuVoucher
}) {
    if (!dangMoModalVoucher) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-rose-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                {/* Header Đỏ Rose Sang Trọng */}
                <div className="shrink-0 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                            🎟️
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    {voucherDangSua ? 'Cập Nhật' : 'Tạo Mới'}
                                </span>
                                <span className="text-[11px] text-rose-100 font-mono font-bold uppercase">
                                    {formVoucher.ma_code || 'VOUCHER-CODE'}
                                </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                {voucherDangSua ? 'Sửa Mã Khuyến Mãi' : 'Tạo Voucher Khuyến Mãi Mới'}
                            </h3>
                            <p className="text-xs text-rose-100 font-medium">Thiết lập mức giảm giá, giới hạn số lượng và thời hạn</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => !dangLuuVoucher && setDangMoModalVoucher(false)}
                        className="p-2 rounded-full bg-white/15 hover:bg-white/30 cursor-pointer transition-colors text-white"
                        title="Đóng cửa sổ"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={xuLyLuuVoucher} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">

                        {/* KHỐI 1: THÔNG TIN MÃ & MỨC GIẢM GIÁ */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 shadow-xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-rose-950">
                                <span className="font-black text-rose-900 dark:text-rose-300 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                                    <Ticket className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                    <span>1. Mã Voucher & Mức Giảm</span>
                                </span>
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                                    Bắt buộc
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Ticket className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                        <span>Mã CODE Khuyến Mãi *</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="SALE2026 / TRIKUN500K..."
                                        value={formVoucher.ma_code}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, ma_code: e.target.value.toUpperCase() })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 font-mono font-black text-rose-600 uppercase text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <BadgePercent className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                        <span>Hình Thức Giảm Giá *</span>
                                    </label>
                                    <select
                                        value={formVoucher.loai_giam}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, loai_giam: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="tien_mat">💵 Giảm Tiền Mặt (VNĐ)</option>
                                        <option value="phan_tram">📊 Giảm Theo Phần Trăm (%)</option>
                                        <option value="freeship">🚚 Miễn Phí Vận Chuyển</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <Gift className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                    <span>Tên / Tiêu Đề Voucher *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ưu đãi sinh viên / Tri ân khách hàng thân thiết..."
                                    value={formVoucher.tieu_de}
                                    onChange={(e) => setFormVoucher({ ...formVoucher, tieu_de: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <CircleDollarSign className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                        <span>{formVoucher.loai_giam === 'phan_tram' ? 'Phần Trăm Giảm (%) *' : 'Số Tiền Giảm (VNĐ) *'}</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder={formVoucher.loai_giam === 'phan_tram' ? 'VD: 15' : 'VD: 500000'}
                                        value={formVoucher.gia_tri_giam}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, gia_tri_giam: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 font-black text-rose-600 dark:text-rose-400 text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <ShoppingBag className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                                        <span>Đơn Hàng Tối Thiểu (VNĐ)</span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="VD: 10000000"
                                        value={formVoucher.don_hang_toi_thieu}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, don_hang_toi_thieu: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* KHỐI 2: ĐIỀU KIỆN ÁP DỤNG & GIAO DIỆN THẺ */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="font-black text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                                    <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                    <span>2. Điều Kiện & Giao Diện Thẻ</span>
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                        <span>Số Lượng Phát Hành</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formVoucher.so_luong_phat_hanh || 20}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, so_luong_phat_hanh: Number(e.target.value) })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 font-black text-emerald-600 dark:text-emerald-400 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                        <span>Ngày Hết Hạn Voucher</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formVoucher.ngay_het_han || ''}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, ngay_het_han: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Tag className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                        <span>Chuyên Mục Áp Dụng</span>
                                    </label>
                                    <select
                                        value={formVoucher.chuyen_muc || 'toan_san'}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, chuyen_muc: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="toan_san">🌐 Toàn Sàn</option>
                                        <option value="laptop">💻 Laptop Thường</option>
                                        <option value="gaming">🎮 Laptop Gaming</option>
                                        <option value="sinh_vien">🎓 Sinh Viên / VP</option>
                                        <option value="phu_kien">🎧 Phụ Kiện / Gear</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Palette className="w-3.5 h-3.5 text-amber-500" />
                                        <span>Tone Màu Thẻ</span>
                                    </label>
                                    <select
                                        value={formVoucher.mau_sac || 'rose'}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, mau_sac: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="rose">🔴 Đỏ Thắm (Rose)</option>
                                        <option value="blue">🔵 Xanh Dương (Blue)</option>
                                        <option value="orange">🟠 Cam Cháy (Orange)</option>
                                        <option value="purple">🟣 Tím Neon (Purple)</option>
                                        <option value="emerald">🟢 Xanh Lục (Emerald)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Flame className="w-3.5 h-3.5 text-rose-500" />
                                        <span>Nhãn Badge Nổi Bật</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="HOT DEAL / GIẢM SỐC..."
                                        value={formVoucher.badge || ''}
                                        onChange={(e) => setFormVoucher({ ...formVoucher, badge: e.target.value.toUpperCase() })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs uppercase focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <FileText className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                                    <span>Mô Tả Chi Tiết Điều Kiện Áp Dụng</span>
                                </label>
                                <textarea
                                    rows="2"
                                    value={formVoucher.mo_ta}
                                    onChange={(e) => setFormVoucher({ ...formVoucher, mo_ta: e.target.value })}
                                    placeholder="Áp dụng cho khách hàng mua laptop gaming hoặc phụ kiện trên 20 triệu..."
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:bg-white focus:border-rose-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pinned Footer */}
                    <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                        <button
                            type="button"
                            disabled={dangLuuVoucher}
                            onClick={() => setDangMoModalVoucher(false)}
                            className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuVoucher ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            Hủy Bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={dangLuuVoucher}
                            className={`px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-md shadow-rose-500/25 transition-all ${dangLuuVoucher ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                        >
                            {dangLuuVoucher ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{dangLuuVoucher ? 'Đang lưu voucher...' : (voucherDangSua ? 'Lưu Thay Đổi' : 'Tạo Voucher')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
