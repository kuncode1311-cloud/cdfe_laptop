'use client';
import Image from 'next/image';
import {
    X,
    FileText,
    FolderPlus,
    Hash,
    ImageIcon,
    Upload,
    Link2,
    Sparkles,
    User,
    Clock,
    BookOpen,
    Edit3,
    Flame,
    CheckCircle2,
    Loader2,
    Save
} from 'lucide-react';

// Modal Thêm/Sửa bài viết tin tức của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ModalTinTuc({
    dangMoModalTinTuc,
    setDangMoModalTinTuc,
    tinTucDangSua,
    formTinTuc,
    setFormTinTuc,
    xuLyLuuTinTuc,
    dangLuuTinTuc,
    xuLyUploadAnhTinTuc
}) {
    if (!dangMoModalTinTuc) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl border border-teal-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                {/* Header Xanh Teal Đậm Đà, Sang Trọng */}
                <div className="shrink-0 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                            📰
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    {tinTucDangSua ? 'Cập Nhật' : 'Tạo Mới'}
                                </span>
                                <span className="text-[11px] text-teal-100 font-mono font-bold">
                                    {formTinTuc.id || 'NEWS-ID'}
                                </span>
                            </div>
                            <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                {tinTucDangSua ? 'Chỉnh Sửa Bài Viết Tin Tức' : 'Soạn Thảo Bài Viết Mới'}
                            </h3>
                            <p className="text-xs text-teal-100 font-medium hidden sm:block">Đánh giá công nghệ, tư vấn chọn mua laptop và cẩm nang thủ thuật</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => !dangLuuTinTuc && setDangMoModalTinTuc(false)}
                        className="p-2 rounded-full bg-white/15 hover:bg-white/30 cursor-pointer transition-colors text-white"
                        title="Đóng cửa sổ"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={xuLyLuuTinTuc} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">

                        {/* KHỐI 1: TIÊU ĐỀ & ĐỊNH DANH */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                    <span>Tiêu Đề Bài Viết *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Top 5 Laptop Gaming RTX 40 Series Đáng Mua Nhất..."
                                    value={formTinTuc.tieu_de}
                                    onChange={(e) => setFormTinTuc({ ...formTinTuc, tieu_de: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <FolderPlus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                        <span>Chuyên Mục Bài Viết *</span>
                                    </label>
                                    <select
                                        value={formTinTuc.chuyen_muc}
                                        onChange={(e) => setFormTinTuc({ ...formTinTuc, chuyen_muc: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-teal-500 focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="Tư Vấn Mua Sắm">🛒 Tư Vấn Mua Sắm</option>
                                        <option value="Xu Hướng Công Nghệ">🚀 Xu Hướng Công Nghệ</option>
                                        <option value="Đánh Giá & So Sánh">⚖️ Đánh Giá & So Sánh</option>
                                        <option value="Tin Tức Công Nghệ">⚡ Tin Tức Công Nghệ</option>
                                        <option value="Chia Sẻ Kinh Nghiệm">💡 Chia Sẻ Kinh Nghiệm</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Hash className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                        <span>Mã Slug / ID Bài Viết</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="tin-1 / top-5-laptop-2026"
                                        value={formTinTuc.id}
                                        onChange={(e) => setFormTinTuc({ ...formTinTuc, id: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* KHỐI 2: HÌNH ẢNH BÌA - CÓ TẢI FILE TỪ MÁY & CHỌN MẪU NHANH */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 shadow-xs space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <ImageIcon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                    <span>Hình Ảnh Bìa Bài Viết *</span>
                                </label>
                                <span className="text-[11px] text-teal-700 dark:text-teal-400 font-semibold">Tải từ máy hoặc chọn mẫu</span>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                {/* Ảnh Xem Trước Trực Quan Tỷ Lệ 16:9 */}
                                <div className="w-full sm:w-44 h-28 rounded-2xl bg-slate-950 overflow-hidden relative shrink-0 border-2 border-teal-300 dark:border-teal-800 shadow-sm group">
                                    <Image
                                        src={formTinTuc.hinh_anh || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'}
                                        alt="Preview"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-bold transition-opacity">
                                        <span>Ảnh bìa</span>
                                    </div>
                                </div>

                                {/* Trung Tâm Thao Tác Tải Ảnh */}
                                <div className="flex-1 w-full space-y-2.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Nút Upload trực tiếp từ máy tính */}
                                        <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-teal-500/25 cursor-pointer transition-all active:scale-95 shrink-0">
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>Tải ảnh từ máy tính</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={xuLyUploadAnhTinTuc}
                                            />
                                        </label>

                                        {/* Nút xóa ảnh đưa về mặc định */}
                                        {formTinTuc.hinh_anh && (
                                            <button
                                                type="button"
                                                onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: '/images/tin_gaming_rtx40.jpg' })}
                                                className="px-3 py-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
                                                title="Đưa về ảnh mặc định"
                                            >
                                                Mặc định
                                            </button>
                                        )}
                                    </div>

                                    {/* Ô nhập đường dẫn link URL trực tiếp */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Link2 className="w-3.5 h-3.5" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Hoặc dán URL ảnh (https://... hoặc /images/...)"
                                            value={formTinTuc.hinh_anh}
                                            onChange={(e) => setFormTinTuc({ ...formTinTuc, hinh_anh: e.target.value })}
                                            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] focus:bg-white focus:border-teal-500 focus:outline-none transition-all truncate"
                                        />
                                    </div>

                                    {/* Bộ Ảnh Mẫu Công Nghệ Chọn Nhanh 1-Click */}
                                    <div className="pt-1">
                                        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-amber-500" />
                                            <span>Ảnh mẫu công nghệ chọn nhanh:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: '/images/tin_gaming_rtx40.jpg' })}
                                                className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10.5px] font-bold cursor-pointer transition-colors"
                                            >
                                                🎮 Laptop Gaming RTX
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' })}
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10.5px] font-bold cursor-pointer transition-colors"
                                            >
                                                🍎 MacBook & VP
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80' })}
                                                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10.5px] font-bold cursor-pointer transition-colors"
                                            >
                                                ⚡ Chip AI Mới
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormTinTuc({ ...formTinTuc, hinh_anh: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' })}
                                                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10.5px] font-bold cursor-pointer transition-colors"
                                            >
                                                ⌨️ Phím Cơ & Gear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KHỐI 3: TÁC GIẢ & THỜI LƯỢNG ĐỌC */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <User className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                        <span>Tác Giả Viết Bài *</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formTinTuc.tac_gia}
                                        onChange={(e) => setFormTinTuc({ ...formTinTuc, tac_gia: e.target.value })}
                                        placeholder="Chuyên Gia Công Nghệ TNTP Laptop"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                        <span>Thời Gian Đọc Ước Tính</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="5 phút đọc..."
                                        value={formTinTuc.thoi_gian_doc}
                                        onChange={(e) => setFormTinTuc({ ...formTinTuc, thoi_gian_doc: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* KHỐI 4: TÓM TẮT & NỘI DUNG CHI TIẾT */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                    <span>Tóm Tắt Ngắn (Hiển thị thẻ bài viết ngoài trang chủ) *</span>
                                </label>
                                <textarea
                                    rows="2"
                                    required
                                    value={formTinTuc.tom_tat}
                                    onChange={(e) => setFormTinTuc({ ...formTinTuc, tom_tat: e.target.value })}
                                    placeholder="Đoạn văn ngắn 1-2 câu tóm lược nội dung bài viết..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium text-xs leading-relaxed focus:bg-white focus:border-teal-500 focus:outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <Edit3 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                                        <span>Nội Dung Chi Tiết Bài Viết</span>
                                    </span>
                                    <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Dùng ### cho tiêu đề mục</span>
                                </label>
                                <textarea
                                    rows="7"
                                    value={formTinTuc.noi_dung}
                                    onChange={(e) => setFormTinTuc({ ...formTinTuc, noi_dung: e.target.value })}
                                    placeholder="Soạn thảo nội dung chi tiết bài viết..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 text-slate-900 dark:text-white font-medium text-xs leading-relaxed focus:bg-white focus:border-teal-500 focus:outline-none transition-all font-mono"
                                />
                            </div>

                            {/* Cài đặt trạng thái xuất bản & tiêu điểm */}
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setFormTinTuc({ ...formTinTuc, la_tieu_diem: !formTinTuc.la_tieu_diem })}
                                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                                        formTinTuc.la_tieu_diem
                                            ? 'bg-rose-600 text-white border-rose-700 shadow-md shadow-rose-500/25'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    <Flame className="w-4 h-4 fill-current" />
                                    <span>🔥 Bài Viết Tiêu Điểm Hot</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormTinTuc({ ...formTinTuc, xuat_ban: !formTinTuc.xuat_ban })}
                                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                                        formTinTuc.xuat_ban
                                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/25'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>🟢 Xuất Bản Ngay (Công Khai)</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pinned Footer */}
                    <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                        <button
                            type="button"
                            disabled={dangLuuTinTuc}
                            onClick={() => setDangMoModalTinTuc(false)}
                            className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuTinTuc ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            Hủy Bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={dangLuuTinTuc}
                            className={`px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-2 shadow-md shadow-teal-500/25 transition-all ${dangLuuTinTuc ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                        >
                            {dangLuuTinTuc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{dangLuuTinTuc ? 'Đang lưu bài viết...' : (tinTucDangSua ? 'Lưu Thay Đổi' : 'Lưu & Xuất Bản')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
