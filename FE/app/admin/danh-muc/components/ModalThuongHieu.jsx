'use client';
import { X, Building2, Hash, Loader2, Save } from 'lucide-react';

// Modal Thêm/Sửa thương hiệu-danh mục của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ModalThuongHieu({
    dangMoModalDanhMuc,
    setDangMoModalDanhMuc,
    dmDangSua,
    formDm,
    setFormDm,
    xuLyLuuDanhMuc,
    dangLuuDanhMuc
}) {
    if (!dangMoModalDanhMuc) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md border border-purple-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                {/* Header Tím Neon Sang Trọng */}
                <div className="shrink-0 bg-gradient-to-r from-purple-700 via-fuchsia-700 to-pink-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                            <span>🏷️</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    {dmDangSua ? 'Cập Nhật' : 'Thêm Mới'}
                                </span>
                                <span className="text-[11px] text-purple-100 font-mono font-bold">
                                    {formDm.ma_danh_muc || 'brand-code'}
                                </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                {dmDangSua ? 'Chỉnh Sửa' : 'Thêm Mới'} {formDm.loai === 'loai_san_pham' ? 'Loại Sản Phẩm' : formDm.loai === 'nhu_cau' ? 'Nhu Cầu' : 'Thương Hiệu'}
                            </h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => !dangLuuDanhMuc && setDangMoModalDanhMuc(false)}
                        className="p-2 rounded-full bg-white/15 hover:bg-white/30 cursor-pointer transition-colors text-white"
                        title="Đóng cửa sổ"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={xuLyLuuDanhMuc} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">

                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-slate-800 shadow-xs space-y-3.5">
                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                    <span>Tên *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ví dụ: ASUS, Dell, Lenovo, Apple, MSI, Razer..."
                                    value={formDm.ten_danh_muc}
                                    onChange={(e) => {
                                        const ten = e.target.value;
                                        // Thêm mới: tự sinh mã từ tên (bỏ dấu, thay khoảng trắng bằng dấu gạch)
                                        const ma = ten.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                                        setFormDm({ ...formDm, ten_danh_muc: ten, ...(dmDangSua ? {} : { ma_danh_muc: ma }) });
                                    }}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <Hash className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                    <span>Mã (tự điền theo tên)</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    readOnly={!!dmDangSua}
                                    placeholder="asus / logitech / ban-phim-co"
                                    value={formDm.ma_danh_muc}
                                    onChange={(e) => setFormDm({ ...formDm, ma_danh_muc: e.target.value.toLowerCase().replace(/s+/g, '-') })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-purple-600 dark:text-purple-400 font-mono font-bold text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all read-only:opacity-60"
                                />
                                {dmDangSua && <p className="text-[11px] text-slate-500">Không đổi mã khi sửa vì sản phẩm đang dùng mã này.</p>}
                            </div>

                        </div>
                    </div>

                    {/* Pinned Footer */}
                    <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                        <button
                            type="button"
                            disabled={dangLuuDanhMuc}
                            onClick={() => setDangMoModalDanhMuc(false)}
                            className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuDanhMuc ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            Hủy Bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={dangLuuDanhMuc}
                            className={`px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center gap-2 shadow-md shadow-purple-500/25 transition-all ${dangLuuDanhMuc ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                        >
                            {dangLuuDanhMuc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{dangLuuDanhMuc ? 'Đang lưu...' : (dmDangSua ? 'Lưu Thay Đổi' : 'Thêm Mới')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
