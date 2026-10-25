'use client';
import { useState } from 'react';
import AnhXemTruoc, { LoiLinkAnh } from '@/components/admin/AnhXemTruoc';
import { loiLinkAnh } from '@/utils/anh-san-pham';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import {
    Barcode,
    BatteryCharging,
    Boxes,
    Briefcase,
    Building2,
    CheckCircle2,
    Cpu,
    DollarSign,
    Edit3,
    Eye,
    FileText,
    Flame,
    HardDrive,
    Headphones,
    ImageIcon,
    Keyboard,
    Laptop,
    Layers,
    Link2,
    Loader2,
    Maximize2,
    MinusCircle,
    Monitor,
    Mouse,
    Palette,
    PlusCircle,
    Radio,
    Save,
    Shield,
    ShieldCheck,
    SlidersHorizontal,
    Sparkles,
    Store,
    Tag,
    Trash2,
    Upload,
    Usb,
    Wifi,
    X,
    Zap,
    ZoomIn,
} from 'lucide-react';

// Modal Thêm/Sửa sản phẩm (4 tab: Thông tin, Thông số kỹ thuật, Biến thể, Ảnh) của trang quản trị:
// tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện).

// Component thanh tiêu đề nhóm thông số kỹ thuật hỗ trợ nút Sửa Tiêu Đề trực tiếp & inline edit

// Component thanh tiêu đề nhóm thông số kỹ thuật hỗ trợ nút Sửa Tiêu Đề trực tiếp & inline edit
function ThanhTieuDeNhom({
    icon: IconComponent,
    value,
    defaultValue,
    onChange,
    mauBg = 'bg-blue-50 dark:bg-blue-950/60',
    mauBorder = 'border-blue-200 dark:border-blue-800',
    mauText = 'text-blue-900 dark:text-blue-300',
    mauIconBg = 'bg-blue-600',
    mauBadge = 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
}) {
    const [dangSua, setDangSua] = useState(false);
    const tieuDeHienThi = value !== undefined && value !== '' ? value : defaultValue;
    const daTuyChinh = Boolean(value && value !== defaultValue);

    return (
        <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${mauBg} ${mauBorder}`}>
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className={`w-6 h-6 rounded-lg text-white flex items-center justify-center text-xs shadow-xs shrink-0 ${mauIconBg}`}>
                    {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                </span>
                {dangSua ? (
                    <input
                        type="text"
                        autoFocus
                        value={tieuDeHienThi}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={() => setDangSua(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                setDangSua(false);
                            }
                        }}
                        placeholder="Nhập tên tiêu đề nhóm mới..."
                        className="bg-white dark:bg-slate-800 border-2 border-blue-500 dark:border-blue-400 rounded-lg px-2.5 py-1 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider focus:outline-none w-full shadow-xs"
                    />
                ) : (
                    <div className="flex items-center gap-2 truncate">
                        <span
                            onClick={() => setDangSua(true)}
                            className={`font-black text-xs uppercase tracking-wider truncate cursor-pointer hover:underline ${mauText}`}
                            title="Bấm vào đây hoặc nút 'Sửa tiêu đề' bên phải để đổi tên"
                        >
                            {tieuDeHienThi}
                        </span>
                        {daTuyChinh && (
                            <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black shrink-0 border border-amber-300 dark:border-amber-700">
                                Đã sửa
                            </span>
                        )}
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={() => setDangSua(!dangSua)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 hover:scale-105 active:scale-95 ${
                    dangSua
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : `${mauBadge} hover:opacity-90`
                }`}
                title={dangSua ? "Xong (Enter)" : "Bấm để đổi tên tiêu đề nhóm"}
            >
                <Edit3 className="w-3 h-3" />
                <span>{dangSua ? 'Xong' : 'Sửa tiêu đề'}</span>
            </button>
        </div>
    );
}

export default function ModalSanPham({
    NhanDaSua,
    dangLuuSp,
    dangMoModalSp,
    danhSachHangThucTe,
    demSoMucDaSua,
    dongModalSpAnToan,
    formSp,
    formSpGoc,
    hienOUrlAnhChinh,
    hienThongBao,
    layClassInput,
    layClassInputTuyChinh,
    loaiFormSanPham,
    setDangXemTruocCard,
    setFormSp,
    setHienOUrlAnhChinh,
    setLoaiFormSanPham,
    setModalXemAnh,
    setTabModalSp,
    setThongSoTuyChinh,
    spDangSua,
    tabModalSp,
    thongSoTuyChinh,
    xacNhan,
    xuLyLuuSanPham,
    xuLyUploadAnhBienThe,
    xuLyUploadAnhChinh,
    xuLyUploadAnhGallerySp,
}) {
    if (!dangMoModalSp) return null;

    // Các ô bắt buộc còn thiếu (hiện ở chân form để admin biết cần điền gì)
    const oConThieu = [
        [formSp.ten_san_pham, 'Tên sản phẩm'],
        [formSp.ma_san_pham, 'Mã SKU'],
        [formSp.hang_san_xuat, 'Hãng'],
        [formSp.hinh_anh_chinh, 'Ảnh đại diện'],
        [formSp.gia_khuyen_mai, 'Giá bán']
    ].filter(([giaTri]) => !String(giaTri ?? '').trim()).map(([, ten]) => ten);

    return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-5xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
                        {/* Header Sang Trọng, Tinh Tế, Đồng Bộ Tone Với Thân Modal */}
                        <div className="shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-xl shrink-0 shadow-xs">
                                    {loaiFormSanPham === 'ban_phim' ? '⌨️' :
                                     loaiFormSanPham === 'chuot' ? '🖱️' :
                                     loaiFormSanPham === 'balo' ? '🎒' :
                                     loaiFormSanPham === 'tai_nghe' ? '🎧' :
                                     loaiFormSanPham === 'sac_hub' ? '⚡' :
                                     loaiFormSanPham === 'linh_kien' ? '💾' : '💻'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                                            spDangSua
                                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800'
                                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
                                        }`}>
                                            {spDangSua ? 'Chỉnh Sửa' : 'Thêm Mới'}
                                        </span>
                                        {formSp.tuy_chon_phien_ban && formSp.tuy_chon_phien_ban.length > 0 && (
                                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-[11px] font-semibold">
                                                {formSp.tuy_chon_phien_ban.length} biến thể
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug truncate" title={formSp.ten_san_pham}>
                                        {formSp.ten_san_pham || (spDangSua ? 'Sản Phẩm Chưa Có Tên' : 'Nhập Tên Sản Phẩm Mới')}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setDangXemTruocCard(true)}
                                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                                    title="Xem trước sản phẩm hiển thị ngoài web"
                                >
                                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span className="hidden sm:inline">Xem Trước</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={dangLuuSp}
                                    onClick={dongModalSpAnToan}
                                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer transition-colors shrink-0"
                                    title="Đóng cửa sổ"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Thanh 4 Tabs Chức Năng Rõ Ràng - Bố Cục Lưới Cân Đối & Phân Màu Đa Sắc Trực Quan */}
                        <div className="shrink-0 px-4 sm:px-6 py-2.5 bg-slate-50/80 dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 bg-slate-200/70 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                {/* Tab 1: Xanh Dương (Thông Tin & Giá) */}
                                <button
                                    type="button"
                                    onClick={() => setTabModalSp('thong_tin')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        tabModalSp === 'thong_tin'
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border border-blue-600 font-extrabold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/80 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Tag className={`w-4 h-4 shrink-0 ${tabModalSp === 'thong_tin' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                                    <span className="truncate">1. Thông Tin & Giá</span>
                                </button>

                                {/* Tab 2: Tím Indigo (Cấu Hình Chi Tiết) */}
                                <button
                                    type="button"
                                    onClick={() => setTabModalSp('thong_so')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        tabModalSp === 'thong_so'
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-600 font-extrabold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/80 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <SlidersHorizontal className={`w-4 h-4 shrink-0 ${tabModalSp === 'thong_so' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`} />
                                    <span className="truncate">2. Cấu Hình Chi Tiết</span>
                                </button>

                                {/* Tab 3: Hồng Fuchsia (Biến Thể Màu) */}
                                <button
                                    type="button"
                                    onClick={() => setTabModalSp('bien_the')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        tabModalSp === 'bien_the'
                                            ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25 border border-fuchsia-600 font-extrabold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 hover:bg-white/80 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Palette className={`w-4 h-4 shrink-0 ${tabModalSp === 'bien_the' ? 'text-white' : 'text-fuchsia-600 dark:text-fuchsia-400'}`} />
                                    <span className="truncate">3. Biến Thể Màu</span>
                                    {formSp.tuy_chon_phien_ban && formSp.tuy_chon_phien_ban.length > 0 && (
                                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                                            tabModalSp === 'bien_the'
                                                ? 'bg-white/30 text-white'
                                                : 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950 dark:text-fuchsia-300'
                                        }`}>
                                            {formSp.tuy_chon_phien_ban.length}
                                        </span>
                                    )}
                                </button>

                                {/* Tab 4: Vàng Hổ Phách (Ảnh & Quà Tặng) */}
                                <button
                                    type="button"
                                    onClick={() => setTabModalSp('hinh_anh')}
                                    className={`py-2 px-2.5 sm:px-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        tabModalSp === 'hinh_anh'
                                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25 border border-amber-500 font-extrabold'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/80 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <Sparkles className={`w-4 h-4 shrink-0 ${tabModalSp === 'hinh_anh' ? 'text-white' : 'text-amber-500 dark:text-amber-400'}`} />
                                    <span className="truncate">4. Ảnh & Bộ Sưu Tập</span>
                                </button>
                            </div>
                        </div>

                        {/* Form Body Cuộn Độc Lập - Nền Slate-100 Đậm Hơn Giúp Tôn Card Trắng & Đệm Đáy Thoải Mái */}
                        <form onSubmit={xuLyLuuSanPham} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs bg-slate-200/70 dark:bg-slate-950/80 pb-28">
                                
                                {/* TAB 1: THÔNG TIN CƠ BẢN & GIÁ BÁN */}
                                {tabModalSp === 'thong_tin' && (
                                    <div className="space-y-4 animate-in fade-in duration-150">
                                        {/* KHỐI 1: ĐỊNH DANH & ẢNH ĐẠI DIỆN SẢN PHẨM */}
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-800 shadow-sm overflow-hidden">
                                            {/* Header Khối 1 */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800/70 dark:to-slate-900 border-b-2 border-blue-300 dark:border-blue-800 flex items-center justify-between">
                                                <div className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <Tag className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>1. Định Danh & Ảnh Đại Diện Sản Phẩm</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                                                    Bắt buộc
                                                </span>
                                            </div>

                                            <div className="p-4 space-y-3.5">
                                                {/* Hàng 1: Khung Ảnh Thumbnail + Thông Tin Phân Loại SKU/Hãng/Ngành hàng */}
                                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                                    {/* KHUNG ẢNH ĐẠI DIỆN TRỰC QUAN CÓ UPLOAD FILE TỪ MÁY */}
                                                    <div className="w-full sm:w-auto shrink-0 flex sm:flex-col items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                                                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 flex items-center justify-center relative overflow-hidden group shadow-2xs">
                                                            {(formSp.hinh_anh_chinh || formSp.hinh_anh) ? (
                                                                <AnhXemTruoc src={formSp.hinh_anh_chinh || formSp.hinh_anh} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                                                            ) : (
                                                                <div className="text-center p-1 text-slate-400">
                                                                    <ImageIcon className="w-6 h-6 mx-auto mb-0.5 opacity-60" />
                                                                    <span className="text-[10px] block font-medium">Chưa có ảnh</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 sm:w-24 flex flex-col gap-1.5">
                                                            {/* Nút upload ảnh từ máy */}
                                                            <label className="w-full px-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-2xs transition-all active:scale-95 text-center">
                                                                <Upload className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">Tải ảnh máy</span>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={xuLyUploadAnhChinh}
                                                                />
                                                            </label>
                                                            {/* Nút dán link */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setHienOUrlAnhChinh(!hienOUrlAnhChinh)}
                                                                className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer"
                                                            >
                                                                <Link2 className="w-2.5 h-2.5" />
                                                                <span>{hienOUrlAnhChinh ? 'Ẩn link' : 'Dán link'}</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Lưới 3 trường SKU, Hãng, Ngành Hàng */}
                                                    <div className="flex-1 w-full space-y-3">
                                                        {hienOUrlAnhChinh && (
                                                            <div className="space-y-1">
                                                                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                                                    <Link2 className="w-3 h-3 text-blue-500" />
                                                                    <span>Đường dẫn link ảnh online:</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="https://... hoặc /images/sp/..."
                                                                    value={formSp.hinh_anh_chinh || formSp.hinh_anh || ''}
                                                                    onChange={(e) => {
                                                                        setFormSp({ ...formSp, hinh_anh_chinh: e.target.value, hinh_anh: e.target.value });
                                                                    }}
                                                                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                                                                />
<LoiLinkAnh loi={loiLinkAnh(formSp.hinh_anh_chinh)} />
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                            {/* Mã SKU */}
                                                            <div className="space-y-1">
                                                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs">
                                                                    <span className="flex items-center gap-1">
                                                                        <Barcode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                        <span>Mã SKU / Mã SP *</span>
                                                                    </span>
                                                                    <NhanDaSua fieldName="ma_san_pham" />
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    value={formSp.ma_san_pham}
                                                                    onChange={(e) => setFormSp({ ...formSp, ma_san_pham: e.target.value })}
                                                                    placeholder="VD: G834JYR-R9054W"
                                                                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all"
                                                                />
                                                            </div>

                                                            {/* Hãng Sản Xuất */}
                                                            <div className="space-y-1">
                                                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-xs">
                                                                    <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                    <span>Hãng Sản Xuất *</span>
                                                                </label>
                                                                <select
                                                                    value={formSp.hang_san_xuat}
                                                                    onChange={(e) => setFormSp({ ...formSp, hang_san_xuat: e.target.value })}
                                                                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold capitalize text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                                                                >
                                                                    <option value="">-- Chọn hãng --</option>
                                                                    {danhSachHangThucTe.map(h => (
                                                                        <option key={h.ma} value={h.ma}>{h.ten}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {/* Nhóm Ngành Hàng */}
                                                            <div className="space-y-1">
                                                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 text-xs">
                                                                    <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                    <span>Nhóm Ngành Hàng *</span>
                                                                </label>
                                                                <select
                                                                    value={loaiFormSanPham}
                                                                    onChange={(e) => setLoaiFormSanPham(e.target.value)}
                                                                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all cursor-pointer"
                                                                >
                                                                    <option value="laptop">💻 Laptop Gaming & Văn Phòng</option>
                                                                    <option value="ban_phim">⌨️ Bàn Phím Cơ Custom</option>
                                                                    <option value="chuot">🖱️ Chuột Gaming Siêu Nhẹ</option>
                                                                    <option value="balo">🎒 Balo & Túi Chống Sốc</option>
                                                                    <option value="tai_nghe">🎧 Tai Nghe & Loa Âm Thanh</option>
                                                                    <option value="sac_hub">⚡ Củ Sạc GaN & Hub Đa Năng</option>
                                                                    <option value="linh_kien">💾 Linh Kiện RAM / SSD</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Tên Đầy Đủ Của Sản Phẩm */}
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between text-xs">
                                                                <span className="flex items-center gap-1">
                                                                    <Laptop className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                                    <span>Tên Đầy Đủ Của Sản Phẩm *</span>
                                                                </span>
                                                                <NhanDaSua fieldName="ten_san_pham" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={formSp.ten_san_pham}
                                                                onChange={(e) => setFormSp({ ...formSp, ten_san_pham: e.target.value })}
                                                                placeholder="Nhập tên sản phẩm đầy đủ và chi tiết..."
                                                                className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 2: THIẾT LẬP GIÁ BÁN & TỒN KHO THỰC TẾ (Sạch sẽ, Tinh Tế, Gọn Gàng) */}
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-800 shadow-sm overflow-hidden">
                                            {/* Header Khối 2 */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-white dark:from-slate-800/70 dark:to-slate-900 border-b-2 border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                                                <div className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <DollarSign className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>2. Thiết Lập Giá Bán & Tồn Kho Thực Tế</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                    Tiền tệ: VNĐ
                                                </span>
                                            </div>

                                            <div className="p-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                                    {/* CỘT 1: GIÁ NIÊM YẾT GỐC */}
                                                    <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                                                        <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                                                                <span>Giá Niêm Yết Gốc</span>
                                                            </span>
                                                            <NhanDaSua fieldName="gia_goc" />
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={formSp.gia_goc}
                                                            onChange={(e) => setFormSp({ ...formSp, gia_goc: e.target.value })}
                                                            placeholder="VD: 120000000"
                                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200 text-xs focus:border-blue-500 focus:outline-none"
                                                        />
                                                    </div>

                                                    {/* CỘT 2: GIÁ KHUYẾN MÃI THỰC THU (Tone Rose Điểm Nhấn) */}
                                                    <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
                                                        <label className="font-bold text-rose-800 dark:text-rose-300 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1">
                                                                <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                                                <span>Giá Bán (Thực Thu) *</span>
                                                            </span>
                                                            <NhanDaSua fieldName="gia_khuyen_mai" />
                                                        </label>
                                                        <input
                                                            type="number"
                                                            required
                                                            value={formSp.gia_khuyen_mai}
                                                            onChange={(e) => setFormSp({ ...formSp, gia_khuyen_mai: e.target.value })}
                                                            placeholder="VD: 109990000"
                                                            className="w-full px-3 py-2 rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 font-black text-rose-600 dark:text-rose-400 text-xs focus:border-rose-500 focus:outline-none"
                                                        />
                                                        <div className="text-[11px] font-bold flex items-center justify-between px-1">
                                                            <span className="text-rose-600 dark:text-rose-400 font-black">{dinhDangTienVND(formSp.gia_khuyen_mai)}</span>
                                                            {Number(formSp.gia_goc) > Number(formSp.gia_khuyen_mai) && (
                                                                <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[10px]">
                                                                    -{Math.round(((Number(formSp.gia_goc) - Number(formSp.gia_khuyen_mai)) / Number(formSp.gia_goc)) * 100)}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* CỘT 3: TỒN KHO THỰC TẾ (Tone Emerald Điểm Nhấn) */}
                                                    <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-1.5">
                                                        <label className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs">
                                                            <span className="flex items-center gap-1">
                                                                <Boxes className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                                <span>Số Lượng Tồn Kho</span>
                                                            </span>
                                                            <NhanDaSua fieldName="so_luong_ton_kho" />
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={formSp.so_luong_ton_kho}
                                                            onChange={(e) => setFormSp({ ...formSp, so_luong_ton_kho: e.target.value })}
                                                            placeholder="VD: 7"
                                                            className="w-full px-3 py-2 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 font-black text-emerald-700 dark:text-emerald-300 text-xs focus:border-emerald-500 focus:outline-none"
                                                        />
                                                        <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between px-1">
                                                            <span className="flex items-center gap-1">
                                                                <span className={`w-2 h-2 rounded-full ${Number(formSp.so_luong_ton_kho) > 5 ? 'bg-emerald-500' : Number(formSp.so_luong_ton_kho) > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                                <span>{Number(formSp.so_luong_ton_kho) > 5 ? 'Sẵn sàng giao' : Number(formSp.so_luong_ton_kho) > 0 ? 'Sắp hết hàng' : 'Hết hàng'}</span>
                                                            </span>
                                                            <span className="font-black">{formSp.so_luong_ton_kho || 0} máy</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 3: BẢO HÀNH & TRẠNG THÁI KINH DOANH */}
                                        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-300 dark:border-indigo-800 shadow-sm overflow-hidden">
                                            {/* Header Khối 3 */}
                                            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-white dark:from-slate-800/70 dark:to-slate-900 border-b-2 border-indigo-300 dark:border-indigo-800 flex items-center justify-between">
                                                <div className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>3. Bảo Hành & Trạng Thái Kinh Doanh</span>
                                                </div>
                                                <NhanDaSua fieldName="che_do_bao_hanh" />
                                            </div>

                                            <div className="p-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                                    {/* Chính Sách Bảo Hành */}
                                                    <div className="space-y-1.5">
                                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                                            <span>Chính Sách Bảo Hành Chính Hãng</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ví dụ: 24 tháng chính hãng tại TNTP Laptop..."
                                                            value={formSp.che_do_bao_hanh}
                                                            onChange={(e) => setFormSp({ ...formSp, che_do_bao_hanh: e.target.value })}
                                                            className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:outline-none transition-all"
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <input type="number" min="1" max="120" value={formSp.thoi_han_bao_hanh_thang ?? 24} onChange={(e) => setFormSp({ ...formSp, thoi_han_bao_hanh_thang: e.target.value })} className="w-24 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-black text-xs focus:border-indigo-500 focus:outline-none" aria-label="Thời hạn bảo hành theo tháng" />
                                                            <span className="text-[11px] font-bold text-slate-500">tháng mặc định</span>
                                                        </div>
                                                    </div>

                                                    {/* 3 Nút Huy Hiệu Trực Quan Ngoài Website */}
                                                    <div className="space-y-1.5">
                                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                                            <span>Huy Hiệu Trực Quan Ngoài Website</span>
                                                        </label>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {/* Flash Sale Toggle */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormSp({ ...formSp, la_flash_sale: !formSp.la_flash_sale })}
                                                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                                                    formSp.la_flash_sale
                                                                        ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                                                                        : 'bg-rose-50 dark:bg-slate-800 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100'
                                                                }`}
                                                            >
                                                                <Flame className="w-3.5 h-3.5 fill-current text-inherit" />
                                                                <span>⚡ Flash Sale</span>
                                                            </button>

                                                            {/* Bán Chạy Toggle */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormSp({ ...formSp, la_ban_chay: !formSp.la_ban_chay })}
                                                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                                                    formSp.la_ban_chay
                                                                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                                                        : 'bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50 hover:bg-amber-100'
                                                                }`}
                                                            >
                                                                <Sparkles className="w-3.5 h-3.5 fill-current text-inherit" />
                                                                <span>🔥 Bán Chạy</span>
                                                            </button>

                                                            {/* Đang Mở Bán Toggle */}
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormSp({ ...formSp, con_hang: !formSp.con_hang })}
                                                                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                                                                    formSp.con_hang
                                                                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                                                        : 'bg-emerald-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100'
                                                                }`}
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                <span>✅ Đang Mở Bán</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: CẤU HÌNH & THÔNG SỐ KỸ THUẬT (CHUYÊN BIỆT CHO MẶT HÀNG ĐANG CHỌN) */}
                                {tabModalSp === 'thong_so' && (
                                    <div className="space-y-4 animate-in fade-in duration-150">
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
                                                    <SlidersHorizontal className="w-4 h-4" />
                                                </span>
                                                <div>
                                                    <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs block">
                                                        2. Thông Số Kỹ Thuật {loaiFormSanPham === 'laptop' ? 'Laptop Gaming & Văn Phòng' : loaiFormSanPham === 'ban_phim' ? 'Bàn Phím Cơ Custom' : loaiFormSanPham === 'chuot' ? 'Chuột Gaming Siêu Nhẹ' : loaiFormSanPham === 'balo' ? 'Balo & Túi Chống Sốc' : loaiFormSanPham === 'tai_nghe' ? 'Tai Nghe & Loa' : loaiFormSanPham === 'sac_hub' ? 'Củ Sạc GaN & Hub' : 'Linh Kiện RAM / SSD'}
                                                    </span>
                                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                        Cấu hình kỹ thuật chuyên biệt cho nhóm hàng này
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Selector chuyển nhanh loại thông số nếu cần */}
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-slate-500 font-bold hidden sm:inline">Đổi mẫu:</span>
                                                <select
                                                    value={loaiFormSanPham}
                                                    onChange={(e) => setLoaiFormSanPham(e.target.value)}
                                                    className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-slate-800 border-2 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 text-xs font-black focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                                >
                                                    <option value="laptop">💻 Laptop</option>
                                                    <option value="ban_phim">⌨️ Bàn Phím Cơ</option>
                                                    <option value="chuot">🖱️ Chuột Gaming</option>
                                                    <option value="balo">🎒 Balo & Túi</option>
                                                    <option value="tai_nghe">🎧 Tai Nghe / Loa</option>
                                                    <option value="sac_hub">⚡ Củ Sạc / Hub</option>
                                                    <option value="linh_kien">💾 Linh Kiện</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* 1. CẤU HÌNH KỸ THUẬT LAPTOP */}
                                        {loaiFormSanPham === 'laptop' && (
                                            <div className="space-y-4">
                                                {/* Nhóm 1: Vi Xử Lý & Hiệu Năng (CPU) */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Cpu}
                                                        value={formSp.tieu_de_nhom_cpu}
                                                        defaultValue="1. Bộ Xử Lý & Hiệu Năng (CPU)"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_cpu: val })}
                                                        mauBg="bg-blue-50 dark:bg-blue-950/60"
                                                        mauBorder="border-blue-200 dark:border-blue-800"
                                                        mauText="text-blue-900 dark:text-blue-300"
                                                        mauIconBg="bg-blue-600"
                                                        mauBadge="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ CPU (Tên Vi Xử Lý Chi Tiết)</span>
                                                                <NhanDaSua fieldName="cpu" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Intel® Core™ i9-14900HX (24 nhân 32 luồng, Turbo 5.8GHz, 36MB Cache)..."
                                                                value={formSp.cpu}
                                                                onChange={(e) => setFormSp({ ...formSp, cpu: e.target.value })}
                                                                className={layClassInput('cpu')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Số Nhân & Số Luồng</span>
                                                                <NhanDaSua fieldName="so_nhan_luong" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="24 Nhân (8 P-Core + 16 E-Core), 32 Luồng..."
                                                                value={formSp.so_nhan_luong}
                                                                onChange={(e) => setFormSp({ ...formSp, so_nhan_luong: e.target.value })}
                                                                className={layClassInput('so_nhan_luong')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tốc Độ Xung Nhịp Tối Đa</span>
                                                                <NhanDaSua fieldName="xung_nhip_toi_da" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="5.8 GHz Turbo Boost..."
                                                                value={formSp.xung_nhip_toi_da}
                                                                onChange={(e) => setFormSp({ ...formSp, xung_nhip_toi_da: e.target.value })}
                                                                className={layClassInput('xung_nhip_toi_da')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Bộ Nhớ Đệm (Cache)</span>
                                                                <NhanDaSua fieldName="bo_nho_dem_cache" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="36MB Intel Smart Cache..."
                                                                value={formSp.bo_nho_dem_cache}
                                                                onChange={(e) => setFormSp({ ...formSp, bo_nho_dem_cache: e.target.value })}
                                                                className={layClassInput('bo_nho_dem_cache')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chip AI NPU & Hiệu Năng TOPS</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="chip_ai_npu" />
                                                                    <NhanDaSua fieldName="hieu_nang_ai_tops" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Intel AI Boost NPU..."
                                                                    value={formSp.chip_ai_npu}
                                                                    onChange={(e) => setFormSp({ ...formSp, chip_ai_npu: e.target.value })}
                                                                    className={layClassInput('chip_ai_npu')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="45 TOPS..."
                                                                    value={formSp.hieu_nang_ai_tops}
                                                                    onChange={(e) => setFormSp({ ...formSp, hieu_nang_ai_tops: e.target.value })}
                                                                    className={layClassInput('hieu_nang_ai_tops')}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 2: Đồ Họa & Xử Lý Hình Ảnh (GPU) */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Zap}
                                                        value={formSp.tieu_de_nhom_gpu}
                                                        defaultValue="2. Đồ Họa & Xử Lý Hình Ảnh (GPU)"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_gpu: val })}
                                                        mauBg="bg-purple-50 dark:bg-purple-950/60"
                                                        mauBorder="border-purple-200 dark:border-purple-800"
                                                        mauText="text-purple-900 dark:text-purple-300"
                                                        mauIconBg="bg-purple-600"
                                                        mauBadge="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Card Đồ Họa (GPU)</span>
                                                                <NhanDaSua fieldName="card_do_hoa" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="NVIDIA® GeForce RTX™ 4090 Laptop GPU 16GB GDDR6 (175W TGP)..."
                                                                value={formSp.card_do_hoa}
                                                                onChange={(e) => setFormSp({ ...formSp, card_do_hoa: e.target.value })}
                                                                className={layClassInput('card_do_hoa')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Bộ Nhớ Đồ Họa (VRAM)</span>
                                                                <NhanDaSua fieldName="dung_luong_vram" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="16GB GDDR6 / 8GB GDDR6..."
                                                                value={formSp.dung_luong_vram}
                                                                onChange={(e) => setFormSp({ ...formSp, dung_luong_vram: e.target.value })}
                                                                className={layClassInput('dung_luong_vram')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Suất TGP Tối Đa (W) & Ray Tracing</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="cong_suat_tgp" />
                                                                    <NhanDaSua fieldName="ho_tro_ray_tracing" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="175 (Watt)..."
                                                                    value={formSp.cong_suat_tgp}
                                                                    onChange={(e) => setFormSp({ ...formSp, cong_suat_tgp: e.target.value })}
                                                                    className={layClassInput('cong_suat_tgp')}
                                                                />
                                                                <select
                                                                    value={formSp.ho_tro_ray_tracing ? 'true' : 'false'}
                                                                    onChange={(e) => setFormSp({ ...formSp, ho_tro_ray_tracing: e.target.value === 'true' })}
                                                                    className={layClassInput('ho_tro_ray_tracing')}
                                                                >
                                                                    <option value="true">✅ Có Ray Tracing & DLSS</option>
                                                                    <option value="false">❌ Không hỗ trợ</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 3: Bộ Nhớ RAM & Ổ Cứng Lưu Trữ */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={HardDrive}
                                                        value={formSp.tieu_de_nhom_ram}
                                                        defaultValue="3. Bộ Nhớ RAM & Ổ Cứng Lưu Trữ (SSD)"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_ram: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng RAM</span>
                                                                <NhanDaSua fieldName="ram" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="64GB DDR5-5600MHz (2x32GB)..."
                                                                value={formSp.ram}
                                                                onChange={(e) => setFormSp({ ...formSp, ram: e.target.value })}
                                                                className={layClassInput('ram')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Loại RAM & Tốc Độ Bus</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="loai_ram" />
                                                                    <NhanDaSua fieldName="toc_do_bus" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="DDR5..."
                                                                    value={formSp.loai_ram}
                                                                    onChange={(e) => setFormSp({ ...formSp, loai_ram: e.target.value })}
                                                                    className={layClassInput('loai_ram')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="5600 (MHz)..."
                                                                    value={formSp.toc_do_bus}
                                                                    onChange={(e) => setFormSp({ ...formSp, toc_do_bus: e.target.value })}
                                                                    className={layClassInput('toc_do_bus')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khả Năng Nâng Cấp RAM</span>
                                                                <NhanDaSua fieldName="nang_cap_ram_toi_da" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Lên tới 64GB (2 khe SODIMM)..."
                                                                value={formSp.nang_cap_ram_toi_da}
                                                                onChange={(e) => setFormSp({ ...formSp, nang_cap_ram_toi_da: e.target.value })}
                                                                className={layClassInput('nang_cap_ram_toi_da')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Ổ Cứng SSD</span>
                                                                <NhanDaSua fieldName="o_cung" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2TB PCIe® 4.0 NVMe™ M.2 SSD (Raid 0)..."
                                                                value={formSp.o_cung}
                                                                onChange={(e) => setFormSp({ ...formSp, o_cung: e.target.value })}
                                                                className={layClassInput('o_cung')}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khe Cắm Mở Rộng SSD/M.2</span>
                                                                <NhanDaSua fieldName="khe_cam_mo_rong" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2 khe M.2 PCIe Gen 4 (Đã cắm 1, còn trống 1 khe)..."
                                                                value={formSp.khe_cam_mo_rong}
                                                                onChange={(e) => setFormSp({ ...formSp, khe_cam_mo_rong: e.target.value })}
                                                                className={layClassInput('khe_cam_mo_rong')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 4: Màn Hình & Công Nghệ Hiển Thị */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-600 shadow-md shadow-sky-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Monitor}
                                                        value={formSp.tieu_de_nhom_man_hinh}
                                                        defaultValue="4. Màn Hình & Công Nghệ Hiển Thị"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_man_hinh: val })}
                                                        mauBg="bg-sky-50 dark:bg-sky-950/60"
                                                        mauBorder="border-sky-200 dark:border-sky-800"
                                                        mauText="text-sky-900 dark:text-sky-300"
                                                        mauIconBg="bg-sky-600"
                                                        mauBadge="bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Kích Thước & Tên Màn Hình</span>
                                                                <NhanDaSua fieldName="man_hinh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="18.0 inch QHD+ (2560 x 1600) ROG Nebula HDR Mini-LED 240Hz 3ms..."
                                                                value={formSp.man_hinh}
                                                                onChange={(e) => setFormSp({ ...formSp, man_hinh: e.target.value })}
                                                                className={layClassInput('man_hinh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Phân Giải Chuẩn</span>
                                                                <NhanDaSua fieldName="do_phan_giai" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2.5K QHD+ (2560 x 1600), tỷ lệ 16:10..."
                                                                value={formSp.do_phan_giai}
                                                                onChange={(e) => setFormSp({ ...formSp, do_phan_giai: e.target.value })}
                                                                className={layClassInput('do_phan_giai')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tần Số Quét (Hz) & Độ Sáng (nits)</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="tan_so_quet" />
                                                                    <NhanDaSua fieldName="do_sang_nits" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="240 (Hz)..."
                                                                    value={formSp.tan_so_quet}
                                                                    onChange={(e) => setFormSp({ ...formSp, tan_so_quet: e.target.value })}
                                                                    className={layClassInput('tan_so_quet')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="1100 (nits)..."
                                                                    value={formSp.do_sang_nits}
                                                                    onChange={(e) => setFormSp({ ...formSp, do_sang_nits: e.target.value })}
                                                                    className={layClassInput('do_sang_nits')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Tấm Nền</span>
                                                                <NhanDaSua fieldName="tam_nen" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Mini-LED, ROG Nebula HDR Display, IPS-level..."
                                                                value={formSp.tam_nen}
                                                                onChange={(e) => setFormSp({ ...formSp, tam_nen: e.target.value })}
                                                                className={layClassInput('tam_nen')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Phủ Gam Màu</span>
                                                                <NhanDaSua fieldName="do_phu_mau" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="100% DCI-P3, Chuẩn màu Pantone Validated..."
                                                                value={formSp.do_phu_mau}
                                                                onChange={(e) => setFormSp({ ...formSp, do_phu_mau: e.target.value })}
                                                                className={layClassInput('do_phu_mau')}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Màn Hình Hỗ Trợ (phân tách bởi dấu phẩy)</span>
                                                                <NhanDaSua fieldName="cong_nghe_man_hinh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="G-Sync, Dolby Vision HDR, Chống chói Anti-Glare..."
                                                                value={formSp.cong_nghe_man_hinh}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_nghe_man_hinh: e.target.value })}
                                                                className={layClassInput('cong_nghe_man_hinh')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 5: Kích Thước, Pin & Tản Nhiệt */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600 shadow-md shadow-amber-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={BatteryCharging}
                                                        value={formSp.tieu_de_nhom_pin}
                                                        defaultValue="5. Kích Thước, Pin & Hệ Thống Tản Nhiệt"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_pin: val })}
                                                        mauBg="bg-amber-50 dark:bg-amber-950/60"
                                                        mauBorder="border-amber-200 dark:border-amber-800"
                                                        mauText="text-amber-900 dark:text-amber-300"
                                                        mauIconBg="bg-amber-500"
                                                        mauBadge="bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Pin</span>
                                                                <NhanDaSua fieldName="pin" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="90WHrs, 4-cell Li-ion..."
                                                                value={formSp.pin}
                                                                onChange={(e) => setFormSp({ ...formSp, pin: e.target.value })}
                                                                className={layClassInput('pin')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Thời Lượng Pin Ước Tính</span>
                                                                <NhanDaSua fieldName="thoi_luong_su_dung_uoc_tinh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Khoảng 6 - 8 tiếng sử dụng cơ bản..."
                                                                value={formSp.thoi_luong_su_dung_uoc_tinh}
                                                                onChange={(e) => setFormSp({ ...formSp, thoi_luong_su_dung_uoc_tinh: e.target.value })}
                                                                className={layClassInput('thoi_luong_su_dung_uoc_tinh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Suất Bộ Sạc Đi Kèm</span>
                                                                <NhanDaSua fieldName="cong_suat_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="330W AC Adapter, sạc nhanh Type-C PD 100W..."
                                                                value={formSp.cong_suat_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_suat_sac: e.target.value })}
                                                                className={layClassInput('cong_suat_sac')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khối Lượng Thiết Bị (kg)</span>
                                                                <NhanDaSua fieldName="trong_luong" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="3.1 kg..."
                                                                value={formSp.trong_luong}
                                                                onChange={(e) => setFormSp({ ...formSp, trong_luong: e.target.value })}
                                                                className={layClassInput('trong_luong')}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Hệ Thống Tản Nhiệt</span>
                                                                <NhanDaSua fieldName="he_thong_tan_nhiet" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Hệ thống ROG Intelligent Cooling, buồng hơi Vapor Chamber, kim loại lỏng Conductonaut Extreme..."
                                                                value={formSp.he_thong_tan_nhiet}
                                                                onChange={(e) => setFormSp({ ...formSp, he_thong_tan_nhiet: e.target.value })}
                                                                className={layClassInput('he_thong_tan_nhiet')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Kích Thước (Dài x Rộng x Dày)</span>
                                                                <NhanDaSua fieldName="kich_thuoc" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="39.9 x 29.4 x 2.31 ~ 3.08 cm..."
                                                                value={formSp.kich_thuoc}
                                                                onChange={(e) => setFormSp({ ...formSp, kich_thuoc: e.target.value })}
                                                                className={layClassInput('kich_thuoc')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Thân Vỏ Máy</span>
                                                                <NhanDaSua fieldName="chat_lieu_vo" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Hợp kim Nhôm - Magie cao cấp phay xước viền LED Aura Sync..."
                                                                value={formSp.chat_lieu_vo}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_vo: e.target.value })}
                                                                className={layClassInput('chat_lieu_vo')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nhóm 6: Cổng Kết Nối & Hệ Điều Hành */}
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Radio}
                                                        value={formSp.tieu_de_nhom_thiet_ke}
                                                        defaultValue="6. Cổng Kết Nối, Hệ Điều Hành & Khác"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_thiet_ke: val })}
                                                        mauBg="bg-indigo-50 dark:bg-indigo-950/60"
                                                        mauBorder="border-indigo-200 dark:border-indigo-800"
                                                        mauText="text-indigo-900 dark:text-indigo-300"
                                                        mauIconBg="bg-indigo-600"
                                                        mauBadge="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Cổng Kết Nối Ngoại Vi (phân tách bởi dấu phẩy)</span>
                                                                <NhanDaSua fieldName="cong_ket_noi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="1x Thunderbolt 4, 1x USB 3.2 Gen 2 Type-C, 2x USB 3.2 Gen 2 Type-A, 1x HDMI 2.1, 1x LAN 2.5G, 1x Jack 3.5mm..."
                                                                value={formSp.cong_ket_noi}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_ket_noi: e.target.value })}
                                                                className={layClassInput('cong_ket_noi')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chuẩn Wi-Fi & Bluetooth</span>
                                                                <NhanDaSua fieldName="chuan_wifi_bluetooth" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Wi-Fi 7 (802.11be) 3 băng tần + Bluetooth 5.4..."
                                                                value={formSp.chuan_wifi_bluetooth}
                                                                onChange={(e) => setFormSp({ ...formSp, chuan_wifi_bluetooth: e.target.value })}
                                                                className={layClassInput('chuan_wifi_bluetooth')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Bàn Phím & Đèn Nền</span>
                                                                <NhanDaSua fieldName="ban_phim" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Bàn phím Chiclet Per-Key RGB Aura Sync, hành trình 2.0mm..."
                                                                value={formSp.ban_phim}
                                                                onChange={(e) => setFormSp({ ...formSp, ban_phim: e.target.value })}
                                                                className={layClassInput('ban_phim')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Âm Thanh</span>
                                                                <NhanDaSua fieldName="am_thanh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Hệ thống 4 loa công nghệ Dolby Atmos, Smart Amp, Khử ồn AI..."
                                                                value={formSp.am_thanh}
                                                                onChange={(e) => setFormSp({ ...formSp, am_thanh: e.target.value })}
                                                                className={layClassInput('am_thanh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Hệ Điều Hành Tích Hợp</span>
                                                                <NhanDaSua fieldName="he_dieu_hanh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Windows 11 Home bản quyền vĩnh viễn..."
                                                                value={formSp.he_dieu_hanh}
                                                                onChange={(e) => setFormSp({ ...formSp, he_dieu_hanh: e.target.value })}
                                                                className={layClassInput('he_dieu_hanh')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. BÀN PHÍM CƠ */}
                                        {loaiFormSanPham === 'ban_phim' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Keyboard}
                                                        value={formSp.tieu_de_nhom_phim_switch}
                                                        defaultValue="1. Switch & Cảm Giác Gõ Phím"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_phim_switch: val })}
                                                        mauBg="bg-indigo-50 dark:bg-indigo-950/60"
                                                        mauBorder="border-indigo-200 dark:border-indigo-800"
                                                        mauText="text-indigo-900 dark:text-indigo-300"
                                                        mauIconBg="bg-indigo-600"
                                                        mauBadge="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Loại Switch Cơ Học</span>
                                                                <NhanDaSua fieldName="loai_switch" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Gateron Jupiter Brown HIFI..."
                                                                value={formSp.loai_switch}
                                                                onChange={(e) => setFormSp({ ...formSp, loai_switch: e.target.value })}
                                                                className={layClassInput('loai_switch')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tính Năng Đặc Biệt & Hot-Swap</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="tinh_nang_dac_biet" />
                                                                    <NhanDaSua fieldName="hot_swap" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Tính năng nổi bật..."
                                                                    value={formSp.tinh_nang_dac_biet}
                                                                    onChange={(e) => setFormSp({ ...formSp, tinh_nang_dac_biet: e.target.value })}
                                                                    className={layClassInput('tinh_nang_dac_biet')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Hot-swap 5-pin..."
                                                                    value={formSp.hot_swap}
                                                                    onChange={(e) => setFormSp({ ...formSp, hot_swap: e.target.value })}
                                                                    className={layClassInput('hot_swap')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Cấu Trúc Giảm Chấn (Mount)</span>
                                                                <NhanDaSua fieldName="cau_truc_mount" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Gasket Mount kèm lót Foam Poron tiêu âm..."
                                                                value={formSp.cau_truc_mount}
                                                                onChange={(e) => setFormSp({ ...formSp, cau_truc_mount: e.target.value })}
                                                                className={layClassInput('cau_truc_mount')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Layers}
                                                        value={formSp.tieu_de_nhom_phim_layout}
                                                        defaultValue="2. Layout, Keycap & Khung Vỏ"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_phim_layout: val })}
                                                        mauBg="bg-purple-50 dark:bg-purple-950/60"
                                                        mauBorder="border-purple-200 dark:border-purple-800"
                                                        mauText="text-purple-900 dark:text-purple-300"
                                                        mauIconBg="bg-purple-600"
                                                        mauBadge="bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Layout Bàn Phím</span>
                                                                <NhanDaSua fieldName="layout_ban_phim" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="75% Gasket Mount (82 Phím)..."
                                                                value={formSp.layout_ban_phim}
                                                                onChange={(e) => setFormSp({ ...formSp, layout_ban_phim: e.target.value })}
                                                                className={layClassInput('layout_ban_phim')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Keycap</span>
                                                                <NhanDaSua fieldName="keycap_chat_lieu" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="PBT Double-shot OSA Profile..."
                                                                value={formSp.keycap_chat_lieu}
                                                                onChange={(e) => setFormSp({ ...formSp, keycap_chat_lieu: e.target.value })}
                                                                className={layClassInput('keycap_chat_lieu')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Thân Vỏ (Case)</span>
                                                                <NhanDaSua fieldName="chat_lieu_case" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Nhôm CNC Anodized nguyên khối..."
                                                                value={formSp.chat_lieu_case}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_case: e.target.value })}
                                                                className={layClassInput('chat_lieu_case')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khối Lượng Thiết Bị</span>
                                                                <NhanDaSua fieldName="trong_luong_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="1.2 kg..."
                                                                value={formSp.trong_luong_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, trong_luong_gear: e.target.value })}
                                                                className={layClassInput('trong_luong_gear')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Wifi}
                                                        value={formSp.tieu_de_nhom_phim_ket_noi}
                                                        defaultValue="3. Kết Nối, Đèn LED & Pin"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_phim_ket_noi: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Phương Thức Kết Nối</span>
                                                                <NhanDaSua fieldName="kieu_ket_noi_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Type-C, Wireless 2.4GHz, Bluetooth 5.1..."
                                                                value={formSp.kieu_ket_noi_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, kieu_ket_noi_gear: e.target.value })}
                                                                className={layClassInput('kieu_ket_noi_gear')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Hệ Thống Đèn LED</span>
                                                                <NhanDaSua fieldName="led_rgb_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="RGB South-facing 16.8 triệu màu..."
                                                                value={formSp.led_rgb_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, led_rgb_gear: e.target.value })}
                                                                className={layClassInput('led_rgb_gear')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Pin (mAh) / Nguồn</span>
                                                                <NhanDaSua fieldName="dung_luong_pin_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="4000 mAh (Lên tới 300 giờ)..."
                                                                value={formSp.dung_luong_pin_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, dung_luong_pin_gear: e.target.value })}
                                                                className={layClassInput('dung_luong_pin_gear')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khả Năng Tương Thích</span>
                                                                <NhanDaSua fieldName="tuong_thich_gear" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Windows, macOS, Linux, Android..."
                                                                value={formSp.tuong_thich_gear}
                                                                onChange={(e) => setFormSp({ ...formSp, tuong_thich_gear: e.target.value })}
                                                                className={layClassInput('tuong_thich_gear')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. CHUỘT & LÓT CHUỘT */}
                                        {loaiFormSanPham === 'chuot' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-violet-400 dark:border-violet-600 shadow-md shadow-violet-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Mouse}
                                                        value={formSp.tieu_de_nhom_chuot_cam_bien}
                                                        defaultValue="1. Cảm Biến, DPI & Độ Chính Xác"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_chuot_cam_bien: val })}
                                                        mauBg="bg-violet-50 dark:bg-violet-950/60"
                                                        mauBorder="border-violet-200 dark:border-violet-800"
                                                        mauText="text-violet-900 dark:text-violet-300"
                                                        mauIconBg="bg-violet-600"
                                                        mauBadge="bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Mắt Đọc Cảm Biến</span>
                                                                <NhanDaSua fieldName="cam_bien_chuot" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="PixArt PAW3395 đỉnh cao..."
                                                                value={formSp.cam_bien_chuot}
                                                                onChange={(e) => setFormSp({ ...formSp, cam_bien_chuot: e.target.value })}
                                                                className={layClassInput('cam_bien_chuot')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Phân Giải Tối Đa (DPI)</span>
                                                                <NhanDaSua fieldName="do_phan_giai_dpi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="26.000 DPI (6 nấc tùy chỉnh)..."
                                                                value={formSp.do_phan_giai_dpi}
                                                                onChange={(e) => setFormSp({ ...formSp, do_phan_giai_dpi: e.target.value })}
                                                                className={layClassInput('do_phan_giai_dpi')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tốc Độ Theo Dõi & Gia Tốc</span>
                                                                <NhanDaSua fieldName="toc_do_ips_gia_toc" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="650 IPS / 50G..."
                                                                value={formSp.toc_do_ips_gia_toc}
                                                                onChange={(e) => setFormSp({ ...formSp, toc_do_ips_gia_toc: e.target.value })}
                                                                className={layClassInput('toc_do_ips_gia_toc')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Switch Chuột & Polling Rate</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="switch_chuot" />
                                                                    <NhanDaSua fieldName="polling_rate" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Optical Huano 100M..."
                                                                    value={formSp.switch_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, switch_chuot: e.target.value })}
                                                                    className={layClassInput('switch_chuot')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="1000Hz - 4000Hz..."
                                                                    value={formSp.polling_rate}
                                                                    onChange={(e) => setFormSp({ ...formSp, polling_rate: e.target.value })}
                                                                    className={layClassInput('polling_rate')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Loại Lót Chuột & Bề Mặt</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="loai_lot_chuot" />
                                                                    <NhanDaSua fieldName="chat_lieu_be_mat" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Speed & Control..."
                                                                    value={formSp.loai_lot_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, loai_lot_chuot: e.target.value })}
                                                                    className={layClassInput('loai_lot_chuot')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Vải Cordura..."
                                                                    value={formSp.chat_lieu_be_mat}
                                                                    onChange={(e) => setFormSp({ ...formSp, chat_lieu_be_mat: e.target.value })}
                                                                    className={layClassInput('chat_lieu_be_mat')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Đế Lót Chuột Chống Trượt</span>
                                                                <NhanDaSua fieldName="chat_lieu_de" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Cao su Poron tự nhiên..."
                                                                value={formSp.chat_lieu_de}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_de: e.target.value })}
                                                                className={layClassInput('chat_lieu_de')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={BatteryCharging}
                                                        value={formSp.tieu_de_nhom_chuot_ket_noi}
                                                        defaultValue="2. Kết Nối, Kích Thước & Thời Lượng Pin"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_chuot_ket_noi: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Phương Thức Kết Nối</span>
                                                                <NhanDaSua fieldName="kieu_ket_noi_chuot" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Wireless 2.4GHz + Bluetooth + Type-C..."
                                                                value={formSp.kieu_ket_noi_chuot}
                                                                onChange={(e) => setFormSp({ ...formSp, kieu_ket_noi_chuot: e.target.value })}
                                                                className={layClassInput('kieu_ket_noi_chuot')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Thời Lượng Pin & LED</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="thoi_luong_pin_chuot" />
                                                                    <NhanDaSua fieldName="che_do_led" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Lên tới 200 giờ..."
                                                                    value={formSp.thoi_luong_pin_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, thoi_luong_pin_chuot: e.target.value })}
                                                                    className={layClassInput('thoi_luong_pin_chuot')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="LED RGB..."
                                                                    value={formSp.che_do_led}
                                                                    onChange={(e) => setFormSp({ ...formSp, che_do_led: e.target.value })}
                                                                    className={layClassInput('che_do_led')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Đế Chuột (Feet PTFE)</span>
                                                                <NhanDaSua fieldName="chat_lieu_feet" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="100% Virgin PTFE bo cong..."
                                                                value={formSp.chat_lieu_feet}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_feet: e.target.value })}
                                                                className={layClassInput('chat_lieu_feet')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Trọng Lượng & Kích Thước</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="trong_luong_chuot" />
                                                                    <NhanDaSua fieldName="kich_thuoc_chuot" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="49g..."
                                                                    value={formSp.trong_luong_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, trong_luong_chuot: e.target.value })}
                                                                    className={layClassInput('trong_luong_chuot')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="120 x 65 x 37.8 mm..."
                                                                    value={formSp.kich_thuoc_chuot}
                                                                    onChange={(e) => setFormSp({ ...formSp, kich_thuoc_chuot: e.target.value })}
                                                                    className={layClassInput('kich_thuoc_chuot')}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. BALO & TÚI CHỐNG SỐC */}
                                        {loaiFormSanPham === 'balo' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-400 dark:border-amber-600 shadow-md shadow-amber-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Briefcase}
                                                        value={formSp.tieu_de_nhom_balo_ngan_chua}
                                                        defaultValue="1. Ngăn Chứa & Kích Thước Máy"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_balo_ngan_chua: val })}
                                                        mauBg="bg-amber-50 dark:bg-amber-950/60"
                                                        mauBorder="border-amber-200 dark:border-amber-800"
                                                        mauText="text-amber-900 dark:text-amber-300"
                                                        mauIconBg="bg-amber-500"
                                                        mauBadge="bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Kích Cỡ Laptop Phù Hợp</span>
                                                                <NhanDaSua fieldName="kich_co_laptop_phu_hop" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Phù hợp laptop 15.6 - 18 inch..."
                                                                value={formSp.kich_co_laptop_phu_hop}
                                                                onChange={(e) => setFormSp({ ...formSp, kich_co_laptop_phu_hop: e.target.value })}
                                                                className={layClassInput('kich_co_laptop_phu_hop')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Tích & Số Ngăn Chứa</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="dung_tich_balo" />
                                                                    <NhanDaSua fieldName="so_ngan_chua" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="36 Lít..."
                                                                    value={formSp.dung_tich_balo}
                                                                    onChange={(e) => setFormSp({ ...formSp, dung_tich_balo: e.target.value })}
                                                                    className={layClassInput('dung_tich_balo')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="1 chính + 6 phụ..."
                                                                    value={formSp.so_ngan_chua}
                                                                    onChange={(e) => setFormSp({ ...formSp, so_ngan_chua: e.target.value })}
                                                                    className={layClassInput('so_ngan_chua')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Kích Thước Bên Ngoài</span>
                                                                <NhanDaSua fieldName="kich_thuoc_balo" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="510 x 340 x 200 mm..."
                                                                value={formSp.kich_thuoc_balo}
                                                                onChange={(e) => setFormSp({ ...formSp, kich_thuoc_balo: e.target.value })}
                                                                className={layClassInput('kich_thuoc_balo')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khối Lượng Thiết Bị (kg)</span>
                                                                <NhanDaSua fieldName="trong_luong_tui" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="1.4 kg..."
                                                                value={formSp.trong_luong_tui}
                                                                onChange={(e) => setFormSp({ ...formSp, trong_luong_tui: e.target.value })}
                                                                className={layClassInput('trong_luong_tui')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Layers}
                                                        value={formSp.tieu_de_nhom_balo_chat_lieu}
                                                        defaultValue="2. Chất Liệu & Khả Năng Kháng Nước"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_balo_chat_lieu: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Vải Chính</span>
                                                                <NhanDaSua fieldName="chat_lieu_chinh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Polyester 1680D kháng nước..."
                                                                value={formSp.chat_lieu_chinh}
                                                                onChange={(e) => setFormSp({ ...formSp, chat_lieu_chinh: e.target.value })}
                                                                className={layClassInput('chat_lieu_chinh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Lớp Lót Bảo Vệ & Khóa Kéo</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="lop_lot_bao_ve" />
                                                                    <NhanDaSua fieldName="khoa_keo" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Lót bọt khí EVA..."
                                                                    value={formSp.lop_lot_bao_ve}
                                                                    onChange={(e) => setFormSp({ ...formSp, lop_lot_bao_ve: e.target.value })}
                                                                    className={layClassInput('lop_lot_bao_ve')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Khóa YKK..."
                                                                    value={formSp.khoa_keo}
                                                                    onChange={(e) => setFormSp({ ...formSp, khoa_keo: e.target.value })}
                                                                    className={layClassInput('khoa_keo')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tiêu Chuẩn Kháng Nước</span>
                                                                <NhanDaSua fieldName="kha_nang_khang_nuoc" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Trượt nước IPX4 kèm áo mưa trùm..."
                                                                value={formSp.kha_nang_khang_nuoc}
                                                                onChange={(e) => setFormSp({ ...formSp, kha_nang_khang_nuoc: e.target.value })}
                                                                className={layClassInput('kha_nang_khang_nuoc')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Đệm Lưng Thoáng Khí</span>
                                                                <NhanDaSua fieldName="dem_lung_thoang_khi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Đệm lưng 3D EVA thoáng khí..."
                                                                value={formSp.dem_lung_thoang_khi}
                                                                onChange={(e) => setFormSp({ ...formSp, dem_lung_thoang_khi: e.target.value })}
                                                                className={layClassInput('dem_lung_thoang_khi')}
                                                            />
                                                        </div>
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tính Năng Nổi Bật (phân tách bởi dấu phẩy)</span>
                                                                <NhanDaSua fieldName="cong_tinh_nang" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Cổng sạc USB ngoài, ngăn ẩn chống trộm RFID, đai vali..."
                                                                value={formSp.cong_tinh_nang}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_tinh_nang: e.target.value })}
                                                                className={layClassInput('cong_tinh_nang')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. TAI NGHE & THIẾT BỊ ÂM THANH */}
                                        {loaiFormSanPham === 'tai_nghe' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-rose-400 dark:border-rose-600 shadow-md shadow-rose-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Headphones}
                                                        value={formSp.tieu_de_nhom_tai_nghe_am_thanh}
                                                        defaultValue="1. Màng Loa, Âm Thanh & Chống Ồn ANC"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_tai_nghe_am_thanh: val })}
                                                        mauBg="bg-rose-50 dark:bg-rose-950/60"
                                                        mauBorder="border-rose-200 dark:border-rose-800"
                                                        mauText="text-rose-900 dark:text-rose-300"
                                                        mauIconBg="bg-rose-600"
                                                        mauBadge="bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Màng Loa / Củ Loa Driver</span>
                                                                <NhanDaSua fieldName="mang_loa_driver" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Graphene 50mm Hi-Res Audio..."
                                                                value={formSp.mang_loa_driver}
                                                                onChange={(e) => setFormSp({ ...formSp, mang_loa_driver: e.target.value })}
                                                                className={layClassInput('mang_loa_driver')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Âm Thanh</span>
                                                                <NhanDaSua fieldName="cong_nghe_am_thanh" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Âm thanh vòm 7.1 DTS Headphone:X 2.0..."
                                                                value={formSp.cong_nghe_am_thanh}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_nghe_am_thanh: e.target.value })}
                                                                className={layClassInput('cong_nghe_am_thanh')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dải Tần Số Đáp Ứng</span>
                                                                <NhanDaSua fieldName="tan_so_dap_ung" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="20Hz - 40.000Hz..."
                                                                value={formSp.tan_so_dap_ung}
                                                                onChange={(e) => setFormSp({ ...formSp, tan_so_dap_ung: e.target.value })}
                                                                className={layClassInput('tan_so_dap_ung')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Trở Kháng & Độ Nhạy</span>
                                                                <NhanDaSua fieldName="tro_khang_do_nhay" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="32 Ohm / 100 dB SPL @ 1kHz..."
                                                                value={formSp.tro_khang_do_nhay}
                                                                onChange={(e) => setFormSp({ ...formSp, tro_khang_do_nhay: e.target.value })}
                                                                className={layClassInput('tro_khang_do_nhay')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Chống Ồn ANC</span>
                                                                <NhanDaSua fieldName="chong_on_anc" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Chống ồn chủ động ANC Hybrid đa cấp..."
                                                                value={formSp.chong_on_anc}
                                                                onChange={(e) => setFormSp({ ...formSp, chong_on_anc: e.target.value })}
                                                                className={layClassInput('chong_on_anc')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Microphone Đàm Thoại</span>
                                                                <NhanDaSua fieldName="micro_dam_thoai" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Micro Blue VO!CE lọc ồn AI rời..."
                                                                value={formSp.micro_dam_thoai}
                                                                onChange={(e) => setFormSp({ ...formSp, micro_dam_thoai: e.target.value })}
                                                                className={layClassInput('micro_dam_thoai')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={BatteryCharging}
                                                        value={formSp.tieu_de_nhom_tai_nghe_ket_noi}
                                                        defaultValue="2. Kết Nối, Micro & Thời Lượng Pin"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_tai_nghe_ket_noi: val })}
                                                        mauBg="bg-emerald-50 dark:bg-emerald-950/60"
                                                        mauBorder="border-emerald-200 dark:border-emerald-800"
                                                        mauText="text-emerald-900 dark:text-emerald-300"
                                                        mauIconBg="bg-emerald-600"
                                                        mauBadge="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chuẩn Kết Nối</span>
                                                                <NhanDaSua fieldName="kieu_ket_noi_tai_nghe" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Lightspeed 2.4GHz + Bluetooth + Jack 3.5mm..."
                                                                value={formSp.kieu_ket_noi_tai_nghe}
                                                                onChange={(e) => setFormSp({ ...formSp, kieu_ket_noi_tai_nghe: e.target.value })}
                                                                className={layClassInput('kieu_ket_noi_tai_nghe')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Thời Lượng Pin & Kháng Nước</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="thoi_luong_pin_tai_nghe" />
                                                                    <NhanDaSua fieldName="khang_nuoc_tai_nghe" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Lên tới 50 giờ..."
                                                                    value={formSp.thoi_luong_pin_tai_nghe}
                                                                    onChange={(e) => setFormSp({ ...formSp, thoi_luong_pin_tai_nghe: e.target.value })}
                                                                    className={layClassInput('thoi_luong_pin_tai_nghe')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="IPX4..."
                                                                    value={formSp.khang_nuoc_tai_nghe}
                                                                    onChange={(e) => setFormSp({ ...formSp, khang_nuoc_tai_nghe: e.target.value })}
                                                                    className={layClassInput('khang_nuoc_tai_nghe')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chất Liệu Đệm Tai & Điều Khiển</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="dem_tai" />
                                                                    <NhanDaSua fieldName="bo_dieu_khien" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Memory Foam bọc da..."
                                                                    value={formSp.dem_tai}
                                                                    onChange={(e) => setFormSp({ ...formSp, dem_tai: e.target.value })}
                                                                    className={layClassInput('dem_tai')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Nút bấm trên củ tai..."
                                                                    value={formSp.bo_dieu_khien}
                                                                    onChange={(e) => setFormSp({ ...formSp, bo_dieu_khien: e.target.value })}
                                                                    className={layClassInput('bo_dieu_khien')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Trọng Lượng & Kích Thước</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="trong_luong_tai_nghe" />
                                                                    <NhanDaSua fieldName="kich_thuoc_tai_nghe" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="320g..."
                                                                    value={formSp.trong_luong_tai_nghe}
                                                                    onChange={(e) => setFormSp({ ...formSp, trong_luong_tai_nghe: e.target.value })}
                                                                    className={layClassInput('trong_luong_tai_nghe')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="190 x 180 x 85 mm..."
                                                                    value={formSp.kich_thuoc_tai_nghe}
                                                                    onChange={(e) => setFormSp({ ...formSp, kich_thuoc_tai_nghe: e.target.value })}
                                                                    className={layClassInput('kich_thuoc_tai_nghe')}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 6. CỦ SẠC & HUB CHUYỂN ĐỔI */}
                                        {loaiFormSanPham === 'sac_hub' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-orange-400 dark:border-orange-600 shadow-md shadow-orange-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Zap}
                                                        value={formSp.tieu_de_nhom_sac_cong_suat}
                                                        defaultValue="1. Công Suất & Công Nghệ Sạc Nhanh GaN"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_sac_cong_suat: val })}
                                                        mauBg="bg-orange-50 dark:bg-orange-950/60"
                                                        mauBorder="border-orange-200 dark:border-orange-800"
                                                        mauText="text-orange-900 dark:text-orange-300"
                                                        mauIconBg="bg-orange-600"
                                                        mauBadge="bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Suất Sạc Tối Đa (Watt)</span>
                                                                <NhanDaSua fieldName="cong_suat_tong" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="140W GaN Fast Charger..."
                                                                value={formSp.cong_suat_tong}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_suat_tong: e.target.value })}
                                                                className={layClassInput('cong_suat_tong')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Công Nghệ Sạc Nhanh</span>
                                                                <NhanDaSua fieldName="cong_nghe_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="PD 3.1, QC 4.0+, PPS, GaN III..."
                                                                value={formSp.cong_nghe_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, cong_nghe_sac: e.target.value })}
                                                                className={layClassInput('cong_nghe_sac')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Giao Thức Sạc Hỗ Trợ</span>
                                                                <NhanDaSua fieldName="giao_thuc_ho_tro" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Power Delivery 3.1, Quick Charge 4.0..."
                                                                value={formSp.giao_thuc_ho_tro}
                                                                onChange={(e) => setFormSp({ ...formSp, giao_thuc_ho_tro: e.target.value })}
                                                                className={layClassInput('giao_thuc_ho_tro')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Pin (nếu là sạc dự phòng)</span>
                                                                <NhanDaSua fieldName="dung_luong_pin_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="24.000 mAh 86.4Wh..."
                                                                value={formSp.dung_luong_pin_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, dung_luong_pin_sac: e.target.value })}
                                                                className={layClassInput('dung_luong_pin_sac')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Màn Hình Hiển Thị</span>
                                                                <NhanDaSua fieldName="man_hinh_hien_thi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Màn hình TFT màu hiển thị công suất thực..."
                                                                value={formSp.man_hinh_hien_thi}
                                                                onChange={(e) => setFormSp({ ...formSp, man_hinh_hien_thi: e.target.value })}
                                                                className={layClassInput('man_hinh_hien_thi')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tính Năng An Toàn</span>
                                                                <NhanDaSua fieldName="tinh_nang_an_toan" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="ActiveShield 2.0 kiểm soát nhiệt..."
                                                                value={formSp.tinh_nang_an_toan}
                                                                onChange={(e) => setFormSp({ ...formSp, tinh_nang_an_toan: e.target.value })}
                                                                className={layClassInput('tinh_nang_an_toan')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Usb}
                                                        value={formSp.tieu_de_nhom_sac_cong_ket_noi}
                                                        defaultValue="2. Cổng Kết Nối & Băng Thông Truyền Tải"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_sac_cong_ket_noi: val })}
                                                        mauBg="bg-blue-50 dark:bg-blue-950/60"
                                                        mauBorder="border-blue-200 dark:border-blue-800"
                                                        mauText="text-blue-900 dark:text-blue-300"
                                                        mauIconBg="bg-blue-600"
                                                        mauBadge="bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="sm:col-span-2 space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Số Lượng & Loại Cổng Ra (phân tách bởi dấu phẩy)</span>
                                                                <NhanDaSua fieldName="so_cong_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2 x Type-C (140W max), 1 x USB-A (22.5W)..."
                                                                value={formSp.so_cong_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, so_cong_sac: e.target.value })}
                                                                className={layClassInput('so_cong_sac')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Băng Thông Truyền Dữ Liệu</span>
                                                                <NhanDaSua fieldName="bang_thong_truyen_du_lieu" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="10Gbps USB 3.2 Gen 2 / 40Gbps USB4..."
                                                                value={formSp.bang_thong_truyen_du_lieu}
                                                                onChange={(e) => setFormSp({ ...formSp, bang_thong_truyen_du_lieu: e.target.value })}
                                                                className={layClassInput('bang_thong_truyen_du_lieu')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Sạc Pass-through & Xuất Hình</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="cong_suat_sac_pass_through" />
                                                                    <NhanDaSua fieldName="xuat_hinh_anh" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="100W PD..."
                                                                    value={formSp.cong_suat_sac_pass_through}
                                                                    onChange={(e) => setFormSp({ ...formSp, cong_suat_sac_pass_through: e.target.value })}
                                                                    className={layClassInput('cong_suat_sac_pass_through')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="HDMI 2.1 4K@120Hz..."
                                                                    value={formSp.xuat_hinh_anh}
                                                                    onChange={(e) => setFormSp({ ...formSp, xuat_hinh_anh: e.target.value })}
                                                                    className={layClassInput('xuat_hinh_anh')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chiều Dài Cáp & Vỏ Máy</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="chieu_dai_cap" />
                                                                    <NhanDaSua fieldName="chat_lieu_vo_sac" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="1.8 mét bọc dù..."
                                                                    value={formSp.chieu_dai_cap}
                                                                    onChange={(e) => setFormSp({ ...formSp, chieu_dai_cap: e.target.value })}
                                                                    className={layClassInput('chieu_dai_cap')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Nhôm tản nhiệt..."
                                                                    value={formSp.chat_lieu_vo_sac}
                                                                    onChange={(e) => setFormSp({ ...formSp, chat_lieu_vo_sac: e.target.value })}
                                                                    className={layClassInput('chat_lieu_vo_sac')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tương Thích Thiết Bị</span>
                                                                <NhanDaSua fieldName="tuong_thich_sac" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Laptop Gaming, MacBook Pro 16, Dell XPS, iPhone..."
                                                                value={formSp.tuong_thich_sac}
                                                                onChange={(e) => setFormSp({ ...formSp, tuong_thich_sac: e.target.value })}
                                                                className={layClassInput('tuong_thich_sac')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 7. LINH KIỆN & TẢN NHIỆT */}
                                        {loaiFormSanPham === 'linh_kien' && (
                                            <div className="space-y-4">
                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-teal-400 dark:border-teal-600 shadow-md shadow-teal-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={HardDrive}
                                                        value={formSp.tieu_de_nhom_linh_kien_hieu_nang}
                                                        defaultValue="1. Hiệu Năng & Tốc Độ Truyền Tải"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_linh_kien_hieu_nang: val })}
                                                        mauBg="bg-teal-50 dark:bg-teal-950/60"
                                                        mauBorder="border-teal-200 dark:border-teal-800"
                                                        mauText="text-teal-900 dark:text-teal-300"
                                                        mauIconBg="bg-teal-600"
                                                        mauBadge="bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Loại Linh Kiện / Thiết Bị</span>
                                                                <NhanDaSua fieldName="loai_linh_kien" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Ổ cứng SSD / RAM / Đế tản nhiệt / Keo tản nhiệt..."
                                                                value={formSp.loai_linh_kien}
                                                                onChange={(e) => setFormSp({ ...formSp, loai_linh_kien: e.target.value })}
                                                                className={layClassInput('loai_linh_kien')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Dung Lượng Bộ Nhớ / Lưu Trữ</span>
                                                                <NhanDaSua fieldName="dung_luong_linh_kien" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="2TB (2048GB) / 32GB RAM..."
                                                                value={formSp.dung_luong_linh_kien}
                                                                onChange={(e) => setFormSp({ ...formSp, dung_luong_linh_kien: e.target.value })}
                                                                className={layClassInput('dung_luong_linh_kien')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tốc Độ Đọc / Ghi Tuần Tự</span>
                                                                <NhanDaSua fieldName="toc_do_doc_ghi" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Đọc 7.450 MB/s - Ghi 6.900 MB/s..."
                                                                value={formSp.toc_do_doc_ghi}
                                                                onChange={(e) => setFormSp({ ...formSp, toc_do_doc_ghi: e.target.value })}
                                                                className={layClassInput('toc_do_doc_ghi')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tốc Độ Bus RAM & CAS Latency</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="toc_do_bus_linh_kien" />
                                                                    <NhanDaSua fieldName="do_tre_cl" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="5600 MHz..."
                                                                    value={formSp.toc_do_bus_linh_kien}
                                                                    onChange={(e) => setFormSp({ ...formSp, toc_do_bus_linh_kien: e.target.value })}
                                                                    className={layClassInput('toc_do_bus_linh_kien')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="CL46..."
                                                                    value={formSp.do_tre_cl}
                                                                    onChange={(e) => setFormSp({ ...formSp, do_tre_cl: e.target.value })}
                                                                    className={layClassInput('do_tre_cl')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Hiệu Quả Giảm Nhiệt & Quạt</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <NhanDaSua fieldName="hieu_qua_giam_nhiet" />
                                                                    <NhanDaSua fieldName="toc_do_quat" />
                                                                </div>
                                                            </label>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Giảm 15°C - 25°C..."
                                                                    value={formSp.hieu_qua_giam_nhiet}
                                                                    onChange={(e) => setFormSp({ ...formSp, hieu_qua_giam_nhiet: e.target.value })}
                                                                    className={layClassInput('hieu_qua_giam_nhiet')}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="2800 RPM..."
                                                                    value={formSp.toc_do_quat}
                                                                    onChange={(e) => setFormSp({ ...formSp, toc_do_quat: e.target.value })}
                                                                    className={layClassInput('toc_do_quat')}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Dẫn Nhiệt (W/m-K)</span>
                                                                <NhanDaSua fieldName="do_dan_nhiet" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="14.2 W/m-K (keo tản nhiệt)..."
                                                                value={formSp.do_dan_nhiet}
                                                                onChange={(e) => setFormSp({ ...formSp, do_dan_nhiet: e.target.value })}
                                                                className={layClassInput('do_dan_nhiet')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-cyan-400 dark:border-cyan-600 shadow-md shadow-cyan-500/5 space-y-3.5">
                                                    <ThanhTieuDeNhom
                                                        icon={Zap}
                                                        value={formSp.tieu_de_nhom_linh_kien_chuan}
                                                        defaultValue="2. Chuẩn Giao Tiếp & Độ Bền"
                                                        onChange={(val) => setFormSp({ ...formSp, tieu_de_nhom_linh_kien_chuan: val })}
                                                        mauBg="bg-cyan-50 dark:bg-cyan-950/60"
                                                        mauBorder="border-cyan-200 dark:border-cyan-800"
                                                        mauText="text-cyan-900 dark:text-cyan-300"
                                                        mauIconBg="bg-cyan-600"
                                                        mauBadge="bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300"
                                                    />
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Chuẩn Giao Tiếp / Khe Cắm</span>
                                                                <NhanDaSua fieldName="chuan_giao_tiep" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="PCIe Gen 4.0 x4 M.2 2280 NVMe / DDR5 SODIMM..."
                                                                value={formSp.chuan_giao_tiep}
                                                                onChange={(e) => setFormSp({ ...formSp, chuan_giao_tiep: e.target.value })}
                                                                className={layClassInput('chuan_giao_tiep')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Độ Bền Ghi Xóa (TBW / MTBF)</span>
                                                                <NhanDaSua fieldName="do_ben_tbw" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="1.200 TBW - 1.5 triệu giờ MTBF..."
                                                                value={formSp.do_ben_tbw}
                                                                onChange={(e) => setFormSp({ ...formSp, do_ben_tbw: e.target.value })}
                                                                className={layClassInput('do_ben_tbw')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Tản Nhiệt Đi Kèm</span>
                                                                <NhanDaSua fieldName="he_thong_tan_nhiet" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Heatsink Nhôm Hàng Không tản nhiệt thụ động..."
                                                                value={formSp.he_thong_tan_nhiet}
                                                                onChange={(e) => setFormSp({ ...formSp, he_thong_tan_nhiet: e.target.value })}
                                                                className={layClassInput('he_thong_tan_nhiet')}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                                                <span>Khả Năng Tương Thích</span>
                                                                <NhanDaSua fieldName="tuong_thich_linh_kien" />
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="Laptop Gaming, PC Desktop, PS5..."
                                                                value={formSp.tuong_thich_linh_kien}
                                                                onChange={(e) => setFormSp({ ...formSp, tuong_thich_linh_kien: e.target.value })}
                                                                className={layClassInput('tuong_thich_linh_kien')}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Chế Độ Bảo Hành Dùng Chung */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md shadow-emerald-500/5 space-y-3">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                                                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                                                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>Chế Độ Bảo Hành Chính Hãng Cho Dòng Máy Này</span>
                                                </div>
                                                <NhanDaSua fieldName="che_do_bao_hanh" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="24 tháng chính hãng tại TNTP Store..."
                                                value={formSp.che_do_bao_hanh}
                                                onChange={(e) => setFormSp({ ...formSp, che_do_bao_hanh: e.target.value })}
                                                            className={layClassInput('che_do_bao_hanh')}
                                                        />
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <input type="number" min="1" max="120" value={formSp.thoi_han_bao_hanh_thang ?? 24} onChange={(e) => setFormSp({ ...formSp, thoi_han_bao_hanh_thang: e.target.value })} className={`${layClassInput('thoi_han_bao_hanh_thang')} max-w-24`} aria-label="Thời hạn bảo hành theo tháng" />
                                                            <span className="text-[11px] font-bold text-slate-500">tháng mặc định</span>
                                                        </div>
                                        </div>

                                        {/* Thông số tùy chỉnh động */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 gap-2">
                                                <div>
                                                    <span className="font-black text-xs uppercase tracking-wider text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <SlidersHorizontal className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Thông Số Kỹ Thuật Bổ Sung</span>
                                                    </span>
                                                    <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5 font-medium">
                                                        💡 Bạn có thể thêm bất kỳ thông số nào bằng Tiếng Việt (ví dụ: Khe cắm mở rộng, Chuẩn Wi-Fi, Bàn phím cơ...).
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setThongSoTuyChinh([...thongSoTuyChinh, { key: '', value: '' }])}
                                                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-1.5 cursor-pointer text-xs shadow-xs transition-all shrink-0 self-start sm:self-auto"
                                                >
                                                    <PlusCircle className="w-3.5 h-3.5" />
                                                    <span>+ Thêm thông số</span>
                                                </button>
                                            </div>

                                            {thongSoTuyChinh.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Tên thông số (vd: Khe cắm mở rộng, Chuẩn Wi-Fi)..."
                                                        value={item.key}
                                                        onChange={(e) => {
                                                            const updated = [...thongSoTuyChinh];
                                                            updated[idx].key = e.target.value;
                                                            setThongSoTuyChinh(updated);
                                                        }}
                                                        className={`w-1/3 ${layClassInputTuyChinh(idx, 'key')}`}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Giá trị (vd: 2 khe M.2 PCIe Gen 4)..."
                                                        value={item.value}
                                                        onChange={(e) => {
                                                            const updated = [...thongSoTuyChinh];
                                                            updated[idx].value = e.target.value;
                                                            setThongSoTuyChinh(updated);
                                                        }}
                                                        className={`flex-1 ${layClassInputTuyChinh(idx, 'value')}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            const tenTs = item.key?.trim() ? `"${item.key}"` : `thông số dòng #${idx + 1}`;
                                                            const dongY = await xacNhan({
                                                                tieuDe: 'Xóa Thông Số Kỹ Thuật?',
                                                                noiDung: `Bạn có chắc chắn muốn xóa thông số ${tenTs} khỏi cấu hình sản phẩm này không?`,
                                                                loai: 'danger',
                                                                nutXacNhan: 'Xóa Thông Số',
                                                                nutHuy: 'Hủy Bỏ'
                                                            });
                                                            if (!dongY) return;
                                                            setThongSoTuyChinh(thongSoTuyChinh.filter((_, i) => i !== idx));
                                                        }}
                                                        className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl cursor-pointer transition-colors shrink-0"
                                                        title="Xóa thông số này"
                                                    >
                                                        <MinusCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: MÀU SẮC & CÁC SẢN PHẨM PHỤ / BIẾN THỂ */}
                                {tabModalSp === 'bien_the' && (
                                    <div className="space-y-4 animate-in fade-in duration-150">
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
                                                    <Palette className="w-5 h-5" />
                                                </span>
                                                <div>
                                                    <h4 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wider">
                                                        <span>3. Màu Sắc & Tùy Chọn Phiên Bản (Không Bắt Buộc)</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black">
                                                            {formSp.tuy_chon_phien_ban?.length || 0} mục
                                                        </span>
                                                    </h4>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                                                        Chỉ cần thiết lập nếu sản phẩm này có nhiều màu (Đen, Bạc, Trắng...) hoặc cấu hình RAM/SSD riêng cho khách chọn.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                                {formSp.tuy_chon_phien_ban && formSp.tuy_chon_phien_ban.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            const dongY = await xacNhan({
                                                                tieuDe: 'Xóa Toàn Bộ Biến Thể Màu Sắc?',
                                                                noiDung: 'Bạn có chắc chắn muốn xóa tất cả biến thể màu sắc để đưa sản phẩm về phiên bản chuẩn duy nhất không?',
                                                                loai: 'danger',
                                                                nutXacNhan: 'Xóa Hết Biến Thể',
                                                                nutHuy: 'Hủy Bỏ'
                                                            });
                                                            if (!dongY) return;
                                                            setFormSp({ ...formSp, tuy_chon_phien_ban: [] });
                                                        }}
                                                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
                                                        title="Bỏ các biến thể để dùng 1 màu chuẩn duy nhất ở Tab 1"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                                        <span>Xóa Hết (Dùng 1 Màu Chuẩn)</span>
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const count = (formSp.tuy_chon_phien_ban?.length || 0) + 1;
                                                        const newVar = {
                                                            ma_tuy_chon: `VAR_${count}_${Date.now().toString().slice(-4)}`,
                                                            ten_tuy_chon: `Màu mới #${count}`,
                                                            ram: formSp.ram || '',
                                                            o_cung: formSp.o_cung || '',
                                                            chenh_lech_gia: 0,
                                                            hinh_anh: formSp.hinh_anh || ''
                                                        };
                                                        setFormSp({
                                                            ...formSp,
                                                            tuy_chon_phien_ban: [...(formSp.tuy_chon_phien_ban || []), newVar]
                                                        });
                                                    }}
                                                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/25 transition-all cursor-pointer"
                                                >
                                                    <PlusCircle className="w-4 h-4" />
                                                    <span>+ Thêm Màu / Biến Thể</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Danh sách biến thể */}
                                        {(!formSp.tuy_chon_phien_ban || formSp.tuy_chon_phien_ban.length === 0) ? (
                                            <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto text-xl shadow-xs">
                                                    👌
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 dark:text-slate-200 text-sm">
                                                        Sản phẩm đang áp dụng 1 phiên bản chuẩn (Không bắt buộc thêm màu)
                                                    </p>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs max-w-lg mx-auto mt-1 leading-relaxed">
                                                        Đa số sản phẩm (như chuột, sạc, balo, hay laptop chỉ có 1 màu) <b>không cần thêm biến thể ở đây</b>. Website sẽ tự động hiển thị theo ảnh và cấu hình mặc định tại <b>Tab 1</b> và <b>Tab 4</b>.
                                                    </p>
                                                </div>
                                                <div className="pt-1 flex items-center justify-center gap-2">
                                                    <span className="text-slate-400 text-xs italic">
                                                        Chỉ bấm nút <b>"+ Thêm Màu / Biến Thể"</b> nếu sản phẩm này có nhiều màu cho khách lựa chọn khi đặt hàng.
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {formSp.tuy_chon_phien_ban.map((bt, bIdx) => {
                                                    const giaGocSp = Number(formSp.gia_khuyen_mai || formSp.gia_chinh_thuc || 0);
                                                    const giaBienThe = giaGocSp + Number(bt.chenh_lech_gia || 0);
                                                    const btGoc = formSpGoc?.tuy_chon_phien_ban?.[bIdx];
                                                    const daSuaTenBt = spDangSua && (!btGoc || btGoc.ten_tuy_chon !== bt.ten_tuy_chon);
                                                    const daSuaGiaBt = spDangSua && (!btGoc || Number(btGoc.chenh_lech_gia) !== Number(bt.chenh_lech_gia));
                                                    return (
                                                        <div
                                                            key={bt.ma_tuy_chon || bIdx}
                                                            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-purple-400/90 dark:border-purple-600 shadow-md shadow-purple-500/5 space-y-4 transition-all hover:border-purple-500"
                                                        >
                                                            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                                                        #{bIdx + 1}
                                                                    </span>
                                                                    <span className="font-black text-purple-950 dark:text-purple-200 text-xs">
                                                                        {bt.ten_tuy_chon || `Biến thể #${bIdx + 1}`}
                                                                    </span>
                                                                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black border border-purple-200 dark:border-purple-800">
                                                                        {bt.ma_tuy_chon}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-purple-200 dark:border-purple-800">
                                                                        Giá bán web: <span className="font-black text-purple-600 dark:text-purple-400">{dinhDangTienVND(giaBienThe)}</span>
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={async () => {
                                                                            const tenBt = bt.ten_tuy_chon || `Biến thể #${bIdx + 1}`;
                                                                            const dongY = await xacNhan({
                                                                                tieuDe: 'Xóa Biến Thể Sản Phẩm?',
                                                                                noiDung: `Bạn có chắc muốn xóa biến thể "${tenBt}" không? Cấu hình giá riêng và hình ảnh của biến thể này sẽ bị gỡ bỏ.`,
                                                                                loai: 'danger',
                                                                                nutXacNhan: 'Xóa Biến Thể',
                                                                                nutHuy: 'Hủy Bỏ'
                                                                            });
                                                                            if (!dongY) return;
                                                                            const updated = formSp.tuy_chon_phien_ban.filter((_, idx) => idx !== bIdx);
                                                                            setFormSp({ ...formSp, tuy_chon_phien_ban: updated });
                                                                        }}
                                                                        className="p-1.5 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl transition-colors cursor-pointer"
                                                                        title="Xóa biến thể này"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                                                                {/* 1. Tên màu sắc / Tùy chọn */}
                                                                <div className="sm:col-span-5 space-y-1">
                                                                    <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                                                                        <span>Tên màu sắc / Phiên bản *</span>
                                                                        {daSuaTenBt && (
                                                                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/70 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-600">
                                                                                Đã sửa
                                                                            </span>
                                                                        )}
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        placeholder="vd: Đen Titan, Xám Không Gian, Trắng..."
                                                                        value={bt.ten_tuy_chon || ''}
                                                                        onChange={(e) => {
                                                                            const updated = [...formSp.tuy_chon_phien_ban];
                                                                            updated[bIdx] = { ...updated[bIdx], ten_tuy_chon: e.target.value };
                                                                            setFormSp({ ...formSp, tuy_chon_phien_ban: updated });
                                                                        }}
                                                                        className={daSuaTenBt
                                                                            ? "w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-bold text-xs ring-2 ring-amber-400/30 focus:outline-none transition-all"
                                                                            : "w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-blue-50/60 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all"}
                                                                    />
                                                                </div>

                                                                {/* 2. Giá bán phiên bản này (nhập trực tiếp, tự quy đổi chênh lệch) */}
                                                                <div className="sm:col-span-3 space-y-1">
                                                                    <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                                                                        <span>Giá bán web bản này (VNĐ)</span>
                                                                        {daSuaGiaBt && (
                                                                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/70 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-600">
                                                                                Đã sửa
                                                                            </span>
                                                                        )}
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        step="50000"
                                                                        placeholder="Nhập giá bán..."
                                                                        value={giaBienThe}
                                                                        onChange={(e) => {
                                                                            const giaNhap = Number(e.target.value) || 0;
                                                                            const chenhLech = giaNhap - giaGocSp;
                                                                            const updated = [...formSp.tuy_chon_phien_ban];
                                                                            updated[bIdx] = { ...updated[bIdx], chenh_lech_gia: chenhLech };
                                                                            setFormSp({ ...formSp, tuy_chon_phien_ban: updated });
                                                                        }}
                                                                        className={daSuaGiaBt
                                                                            ? "w-full px-3 py-2.5 rounded-xl border-2 border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-black text-xs ring-2 ring-amber-400/30 focus:outline-none transition-all"
                                                                            : "w-full px-3 py-2.5 rounded-xl border-2 border-purple-300 dark:border-purple-700 bg-purple-50/60 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-black text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all"}
                                                                    />
                                                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold truncate">
                                                                        {Number(bt.chenh_lech_gia) > 0 ? `+${dinhDangTienVND(bt.chenh_lech_gia)} so với bản gốc` : Number(bt.chenh_lech_gia) < 0 ? `-${dinhDangTienVND(Math.abs(bt.chenh_lech_gia))} so với bản gốc` : 'Bằng giá bản gốc'}
                                                                    </div>
                                                                </div>

                                                                {/* 3. Ảnh màu này - Trực quan có nút tải từ máy tính */}
                                                                <div className="sm:col-span-4 space-y-1">
                                                                    <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                                                                        Ảnh riêng cho màu này
                                                                    </label>
                                                                    <div className="flex items-center gap-2">
                                                                        {/* Thumbnail Preview */}
                                                                        <div
                                                                            onClick={() => bt.hinh_anh && setModalXemAnh({
                                                                                url: bt.hinh_anh,
                                                                                ten: `${formSp.ten_san_pham} - ${bt.ten_tuy_chon}`,
                                                                                gia: giaBienThe,
                                                                                sku: bt.ma_tuy_chon || formSp.ma_san_pham,
                                                                                hang: formSp.hang_san_xuat
                                                                            })}
                                                                            className={`w-11 h-11 rounded-xl border-2 overflow-hidden flex items-center justify-center shrink-0 shadow-xs relative group ${bt.hinh_anh ? 'border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-slate-800 cursor-zoom-in' : 'border-dashed border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                                                                            title={bt.hinh_anh ? 'Bấm phóng to ảnh này' : 'Chưa có ảnh'}
                                                                        >
                                                                            {bt.hinh_anh ? (
                                                                                <>
                                                                                    <img src={bt.hinh_anh} alt="" className="w-full h-full object-contain" />
                                                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                                                                        <ZoomIn className="w-3.5 h-3.5" />
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                                                            )}
                                                                        </div>

                                                                        {/* Nút Upload trực tiếp từ máy tính */}
                                                                        <label className="px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center gap-1.5 cursor-pointer border border-purple-300 dark:border-purple-800 transition-all shrink-0">
                                                                            <Upload className="w-3.5 h-3.5" />
                                                                            <span>Tải ảnh</span>
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                className="hidden"
                                                                                onChange={(e) => xuLyUploadAnhBienThe(bIdx, e)}
                                                                            />
                                                                        </label>

                                                                        {/* Ô nhập link phụ nếu có URL */}
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Hoặc dán URL..."
                                                                            value={bt.hinh_anh || ''}
                                                                            onChange={(e) => {
                                                                                const updated = [...formSp.tuy_chon_phien_ban];
                                                                                updated[bIdx] = { ...updated[bIdx], hinh_anh: e.target.value };
                                                                                setFormSp({ ...formSp, tuy_chon_phien_ban: updated });
                                                                            }}
                                                                            className="flex-1 min-w-0 px-2.5 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px] focus:bg-white focus:border-purple-500 focus:outline-none transition-all truncate"
                                                                            title={bt.hinh_anh}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 4: HÌNH ẢNH & MÔ TẢ CHI TIẾT */}
                                {tabModalSp === 'hinh_anh' && (
                                    <div className="space-y-4 animate-in fade-in duration-150">
                                        {/* KHỐI 1: ẢNH ĐẠI DIỆN CHÍNH */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                                                <div className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                        <ImageIcon className="w-3.5 h-3.5" />
                                                    </span>
                                                    <span>Ảnh Đại Diện Chính Sản Phẩm</span>
                                                </div>
                                                {(formSp.hinh_anh_chinh || formSp.hinh_anh) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setModalXemAnh({
                                                            url: formSp.hinh_anh_chinh || formSp.hinh_anh,
                                                            ten: formSp.ten_san_pham,
                                                            gia: formSp.gia_khuyen_mai || formSp.gia_chinh_thuc,
                                                            sku: formSp.ma_san_pham,
                                                            hang: formSp.hang_san_xuat,
                                                            variants: formSp.tuy_chon_phien_ban
                                                        })}
                                                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer shadow-2xs"
                                                    >
                                                        <Maximize2 className="w-3.5 h-3.5" />
                                                        <span>Phóng to xem thử</span>
                                                    </button>
                                                )}
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-5 items-center">
                                                {/* Visual Preview Box */}
                                                <div
                                                    onClick={() => (formSp.hinh_anh_chinh || formSp.hinh_anh) && setModalXemAnh({
                                                        url: formSp.hinh_anh_chinh || formSp.hinh_anh,
                                                        ten: formSp.ten_san_pham,
                                                        gia: formSp.gia_khuyen_mai || formSp.gia_chinh_thuc,
                                                        sku: formSp.ma_san_pham,
                                                        hang: formSp.hang_san_xuat,
                                                        variants: formSp.tuy_chon_phien_ban
                                                    })}
                                                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-2 flex items-center justify-center shrink-0 cursor-zoom-in relative group overflow-hidden shadow-xs"
                                                >
                                                    {(formSp.hinh_anh_chinh || formSp.hinh_anh) ? (
                                                        <>
                                                            <AnhXemTruoc src={formSp.hinh_anh_chinh || formSp.hinh_anh} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                                                            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs gap-1.5">
                                                                <ZoomIn className="w-4 h-4" />
                                                                <span>Xem To</span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center p-2">
                                                            <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                                                            <span className="text-slate-400 font-bold text-xs mt-1 block">Chưa có ảnh</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Upload Action Center */}
                                                <div className="flex-1 w-full space-y-3">
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white text-xs block">
                                                            Tải ảnh đại diện từ máy tính hoặc chọn mẫu nhanh:
                                                        </span>
                                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                                            Chọn tệp ảnh từ máy (JPG, PNG, WebP) - tự động nén tối ưu hiển thị siêu nét.
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2.5">
                                                        {/* Nút chính: Tải file trực tiếp từ máy tính */}
                                                        <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95">
                                                            <Upload className="w-4 h-4" />
                                                            <span>Tải ảnh từ máy tính</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={xuLyUploadAnhChinh}
                                                            />
                                                        </label>

                                                        {/* Nút phụ: Dán link nếu có URL mạng */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setHienOUrlAnhChinh(!hienOUrlAnhChinh)}
                                                            className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                                                        >
                                                            <Link2 className="w-3.5 h-3.5" />
                                                            <span>{hienOUrlAnhChinh ? 'Ẩn ô dán link' : 'Hoặc dán link URL'}</span>
                                                        </button>

                                                        {/* Nút xóa ảnh */}
                                                        {(formSp.hinh_anh_chinh || formSp.hinh_anh) && (
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    const dongY = await xacNhan({
                                                                        tieuDe: 'Gỡ Ảnh Đại Diện Chính?',
                                                                        noiDung: 'Bạn có chắc chắn muốn xóa hình ảnh đại diện chính của sản phẩm này không?',
                                                                        loai: 'danger',
                                                                        nutXacNhan: 'Gỡ Ảnh',
                                                                        nutHuy: 'Giữ Lại'
                                                                    });
                                                                    if (!dongY) return;
                                                                    setFormSp({ ...formSp, hinh_anh_chinh: '', hinh_anh: '' });
                                                                    hienThongBao('Đã xóa ảnh đại diện!');
                                                                }}
                                                                className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                <span>Xóa ảnh</span>
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Ô nhập URL thu gọn (chỉ hiện khi click) */}
                                                    {hienOUrlAnhChinh && (
                                                        <div className="pt-1 animate-in fade-in duration-150">
                                                            <input
                                                                type="text"
                                                                placeholder="Dán link ảnh online (vd: https://... hoặc /images/sp/...)"
                                                                value={formSp.hinh_anh_chinh || formSp.hinh_anh || ''}
                                                                onChange={(e) => {
                                                                    setFormSp({ ...formSp, hinh_anh_chinh: e.target.value, hinh_anh: e.target.value });
                                                                }}
                                                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-semibold focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                                                            />
<LoiLinkAnh loi={loiLinkAnh(formSp.hinh_anh_chinh)} />
                                                        </div>
                                                    )}

                                                    {/* Chọn nhanh ảnh mẫu laptop chuẩn */}
                                                    <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                                                        <span className="text-slate-400 font-bold">Mẫu nhanh:</span>
                                                        {[
                                                            { ten: '🎮 ROG Strix', src: '/images/sp/asus_rog_scar18.jpg' },
                                                            { ten: '🍎 MacBook Pro', src: '/images/sp/macbook_pro_m3.jpg' },
                                                            { ten: '⚡ Legion Pro', src: '/images/sp/lenovo_legion_pro7.jpg' },
                                                            { ten: '💼 Dell XPS', src: '/images/sp/dell_xps_16.jpg' }
                                                        ].map(m => (
                                                            <button
                                                                key={m.src}
                                                                type="button"
                                                                onClick={() => setFormSp({ ...formSp, hinh_anh_chinh: m.src, hinh_anh: m.src })}
                                                                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer transition-colors"
                                                            >
                                                                {m.ten}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 2: THƯ VIỆN GALLERY SẢN PHẨM (UPLOAD NHIỀU ẢNH TỪ MÁY) */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 gap-2">
                                                <div>
                                                    <div className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <ImageIcon className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Thư Viện Ảnh Gallery (Nhiều Góc Chụp)</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black">
                                                            {(formSp.thu_vien_hinh_anh || []).length} ảnh
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                                        Tải lên nhiều ảnh từ máy tính (góc nghiêng, bàn phím, tản nhiệt, mặt lưng) để khách xem ngoài web.
                                                    </p>
                                                </div>

                                                <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all shrink-0 self-start sm:self-auto">
                                                    <Upload className="w-3.5 h-3.5" />
                                                    <span>Tải nhiều ảnh từ máy</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={xuLyUploadAnhGallerySp}
                                                    />
                                                </label>
                                            </div>

                                            {/* Grid hiển thị danh sách ảnh Gallery đã tải lên */}
                                            {(!formSp.thu_vien_hinh_anh || formSp.thu_vien_hinh_anh.length === 0) ? (
                                                <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                                                    <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        Chưa có ảnh trong thư viện Gallery. Bấm nút "Tải nhiều ảnh từ máy" phía trên để bổ sung.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                                    {formSp.thu_vien_hinh_anh.map((imgUrl, idx) => (
                                                        <div key={idx} className="relative group aspect-square rounded-xl border border-slate-200 dark:border-slate-700 p-1.5 bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-2xs">
                                                            <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const updated = formSp.thu_vien_hinh_anh.filter((_, i) => i !== idx);
                                                                    setFormSp({ ...formSp, thu_vien_hinh_anh: updated });
                                                                }}
                                                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
                                                                title="Gỡ ảnh này khỏi Gallery"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* KHỐI 3: MÔ TẢ NGẮN & MÔ TẢ CHI TIẾT */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
                                            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                                                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                    <FileText className="w-3.5 h-3.5" />
                                                </span>
                                                <span>Nội Dung Giới Thiệu & Mô Tả Chi Tiết</span>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="space-y-1">
                                                    <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center justify-between">
                                                        <span>Mô Tả Ngắn Tóm Tắt (Xuất hiện dưới tên sản phẩm ngoài web)</span>
                                                        <NhanDaSua fieldName="mo_ta_ngan" />
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Vd: Cỗ máy gaming đỉnh cao 2026 với Core i9 thế hệ 14 và RTX 4090..."
                                                        value={formSp.mo_ta_ngan}
                                                        onChange={(e) => setFormSp({ ...formSp, mo_ta_ngan: e.target.value })}
                                                        className={layClassInput('mo_ta_ngan')}
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <label className="font-extrabold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                                                            <span>Bài Viết Giới Thiệu Chuyên Sâu (Hỗ trợ định dạng văn bản chi tiết)</span>
                                                        </label>
                                                        <NhanDaSua fieldName="mo_ta_chi_tiet" />
                                                    </div>
                                                    <textarea
                                                        rows="5"
                                                        placeholder="Viết bài đánh giá chi tiết về thiết kế, màn hình, tản nhiệt, trải nghiệm thực tế..."
                                                        value={formSp.mo_ta_chi_tiet}
                                                        onChange={(e) => setFormSp({ ...formSp, mo_ta_chi_tiet: e.target.value })}
                                                        className={layClassInput('mo_ta_chi_tiet')}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* KHỐI 4: ĐẶC ĐIỂM NỔI BẬT ĐÁNG CHÚ Ý */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 gap-2">
                                                <div>
                                                    <span className="font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                                        <span className="w-6 h-6 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-xs shadow-xs">
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                        </span>
                                                        <span>Đặc Điểm Nổi Bật Đáng Chú Ý</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-black">
                                                            {formSp.dac_diem_noi_bat?.length || 0} điểm
                                                        </span>
                                                    </span>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                                        💡 Các dòng gạch đầu dòng nổi bật hiển thị ngay cạnh ảnh sản phẩm ở trang chi tiết.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const current = Array.isArray(formSp.dac_diem_noi_bat) ? formSp.dac_diem_noi_bat : [];
                                                        setFormSp({ ...formSp, dac_diem_noi_bat: [...current, ''] });
                                                    }}
                                                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black flex items-center gap-1.5 cursor-pointer text-xs shadow-xs transition-all shrink-0 self-start sm:self-auto active:scale-95"
                                                >
                                                    <PlusCircle className="w-3.5 h-3.5" />
                                                    <span>+ Thêm đặc điểm</span>
                                                </button>
                                            </div>

                                            {(!formSp.dac_diem_noi_bat || formSp.dac_diem_noi_bat.length === 0) ? (
                                                <div className="text-center py-6 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                                                    <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        Chưa thiết lập đặc điểm nổi bật. Bấm nút phía trên để thêm mới.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2.5">
                                                    {formSp.dac_diem_noi_bat.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs font-black shrink-0">
                                                                {idx + 1}
                                                            </div>
                                                            <input
                                                                type="text"
                                                                placeholder={`Đặc điểm nổi bật #${idx + 1} (vd: Màn hình 18-inch Mini-LED 2.5K 240Hz Nebula HDR...)`}
                                                                value={item}
                                                                onChange={(e) => {
                                                                    const updated = [...formSp.dac_diem_noi_bat];
                                                                    updated[idx] = e.target.value;
                                                                    setFormSp({ ...formSp, dac_diem_noi_bat: updated });
                                                                }}
                                                                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:border-cyan-500 focus:outline-none transition-all"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    const dongY = await xacNhan({
                                                                        tieuDe: 'Xóa Đặc Điểm Nổi Bật?',
                                                                        noiDung: `Bạn có chắc chắn muốn xóa đặc điểm dòng #${idx + 1} này không?`,
                                                                        loai: 'danger',
                                                                        nutXacNhan: 'Xóa Dòng',
                                                                        nutHuy: 'Hủy Bỏ'
                                                                    });
                                                                    if (!dongY) return;
                                                                    const updated = formSp.dac_diem_noi_bat.filter((_, i) => i !== idx);
                                                                    setFormSp({ ...formSp, dac_diem_noi_bat: updated });
                                                                }}
                                                                className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl cursor-pointer transition-colors shrink-0"
                                                                title="Xóa dòng đặc điểm này"
                                                            >
                                                                <MinusCircle className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        
                                    </div>
                                )}
                            </div>

                            {/* Footer Cố Định - Thiết Kế Hiện Đại, Nút Bấm Rõ Ràng */}
                            <div className="shrink-0 p-3.5 sm:p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-3 shadow-md z-10">
                                <div className="text-xs text-slate-600 dark:text-slate-400 hidden sm:flex items-center gap-2 font-medium">
                                    {spDangSua && demSoMucDaSua() > 0 ? (
                                        <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                            <span>Đang sửa <b>{demSoMucDaSua()}</b> mục thông tin</span>
                                        </span>
                                    ) : (
                                        oConThieu.length > 0 ? (
                                            <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-800 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                                <span>Còn thiếu: <b>{oConThieu.join(', ')}</b></span>
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-2 border-emerald-300 dark:border-emerald-800 flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                <span>Đã đủ thông tin bắt buộc</span>
                                            </span>
                                        )
                                    )}
                                </div>
                                <div className="flex items-center gap-2.5 ml-auto">
                                    <button
                                        type="button"
                                        disabled={dangLuuSp}
                                        onClick={dongModalSpAnToan}
                                        className={`px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors shadow-xs ${dangLuuSp ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                    >
                                        Hủy Bỏ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={dangLuuSp}
                                        className={`px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all ${dangLuuSp ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                    >
                                        {dangLuuSp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        <span>{dangLuuSp ? 'Đang lưu vào kho...' : 'Lưu Sản Phẩm'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
    );
}
