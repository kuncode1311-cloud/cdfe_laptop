'use client';
import {
    MapPin,
    Plus,
    Loader2,
    Save,
    Trash2,
    ExternalLink
} from 'lucide-react';

// Component Tab "Cấu Hình Showroom & Tọa Độ GPS Bản Đồ" của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
// Lưu ý: "xuLyDatLamMacDinh" được giữ nguyên tham chiếu trực tiếp (không truyền qua props) để bảo toàn 100% hành vi gốc của file page.jsx
// (biến này không được định nghĩa ở bất kỳ đâu trong page.jsx gốc, nên hành vi gốc vốn đã là lỗi ReferenceError tiềm ẩn khi bấm chọn "Đặt làm Showroom chính" - refactor không được phép sửa lỗi hành vi này)
export default function CauHinhShowroom({
    xuLyThemShowroomMoi,
    dangLuuShowroom,
    xuLyLuuShowroom,
    danhSachShowroomAdmin,
    showroomDangXemTruoc,
    setShowroomDangXemTruoc,
    xuLyXoaShowroom,
    xuLyThayDoiShowroom
}) {
    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Toolbar Gọn Gàng */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-sky-50/90 via-blue-50/40 to-white dark:from-[#0a1526] dark:via-sky-950/20 dark:to-[#0d1527] p-4 sm:p-5 rounded-3xl border-2 border-sky-200/80 dark:border-sky-800/60 shadow-md shadow-sky-500/5">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/35 ring-4 ring-white/80 dark:ring-sky-900/40">
                            <MapPin className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                                Cấu Hình Showroom & Tọa Độ Bản Đồ
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Cập nhật địa chỉ, hotline và tọa độ GPS (Vĩ độ, Kinh độ) để Google Maps hiển thị chính xác 100%.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        type="button"
                        onClick={xuLyThemShowroomMoi}
                        disabled={dangLuuShowroom}
                        className="px-4 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm Cửa Hàng</span>
                    </button>

                    <button
                        type="button"
                        onClick={xuLyLuuShowroom}
                        disabled={dangLuuShowroom}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                    >
                        {dangLuuShowroom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{dangLuuShowroom ? 'Đang lưu...' : 'Lưu Cấu Hình'}</span>
                    </button>
                </div>
            </div>

            {/* Bố Cục 2 Cột: Cột Trái Danh Sách Cửa Hàng - Cột Phải Live Preview Google Maps */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Cột Trái: Danh Sách Showroom (7 Cột) */}
                <div className="xl:col-span-7 space-y-4">
                    {danhSachShowroomAdmin.map((sr, idx) => {
                        const dangChon = showroomDangXemTruoc === idx;
                        return (
                            <div
                                key={sr.id || idx}
                                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                                    dangChon
                                        ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                                        : 'bg-white/90 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                                }`}
                            >
                                {/* Header Card Chi Nhánh */}
                                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-700/60">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <span className="font-black text-sm text-slate-900 dark:text-white">
                                            {sr.ten || `Cửa hàng #${idx + 1}`}
                                        </span>
                                        {sr.la_mac_dinh && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                                Trụ sở chính
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowroomDangXemTruoc(idx)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                dangChon
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                            }`}
                                        >
                                            {dangChon ? '✓ Đang xem trên Map' : 'Xem trên Map'}
                                        </button>

                                        {danhSachShowroomAdmin.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => xuLyXoaShowroom(idx)}
                                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                                title="Xóa showroom này"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Form Fields Tinh Gọn */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                            Tên Showroom / Chi Nhánh *
                                        </label>
                                        <input
                                            type="text"
                                            value={sr.ten || ''}
                                            onChange={(e) => xuLyThayDoiShowroom(idx, 'ten', e.target.value)}
                                            placeholder="VD: Showroom Quận 10 (Trụ Sở Chính)"
                                            className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                            Địa Chỉ Chi Tiết *
                                        </label>
                                        <input
                                            type="text"
                                            value={sr.dia_chi || ''}
                                            onChange={(e) => xuLyThayDoiShowroom(idx, 'dia_chi', e.target.value)}
                                            placeholder="VD: Số 29 Tân Phước, Phường 8, Quận 10, TP. Hồ Chí Minh"
                                            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                Hotline Liên Hệ
                                            </label>
                                            <input
                                                type="text"
                                                value={sr.hotline || ''}
                                                onChange={(e) => xuLyThayDoiShowroom(idx, 'hotline', e.target.value)}
                                                placeholder="1900.8946 hoặc 0948.37.79.79"
                                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                                                Giờ Mở Cửa
                                            </label>
                                            <input
                                                type="text"
                                                value={sr.gio_mo_cua || ''}
                                                onChange={(e) => xuLyThayDoiShowroom(idx, 'gio_mo_cua', e.target.value)}
                                                placeholder="08:30 - 21:30 (Mở cả tuần)"
                                                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Khu vực tọa độ GPS - Cực kỳ quan trọng & nổi bật */}
                                    <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/60 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-black text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                                Tọa Độ GPS Google Maps (Định Vị Chính Xác)
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                Chuẩn số thực
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                                                    Vĩ độ (Latitude) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={sr.vi_do ?? ''}
                                                    onChange={(e) => xuLyThayDoiShowroom(idx, 'vi_do', e.target.value)}
                                                    placeholder="VD: 10.760086"
                                                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                                                    Kinh độ (Longitude) *
                                                </label>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={sr.kinh_do ?? ''}
                                                    onChange={(e) => xuLyThayDoiShowroom(idx, 'kinh_do', e.target.value)}
                                                    placeholder="VD: 106.663185"
                                                    className="w-full px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                            💡 <i>Mẹo: Mở Google Maps, click chuột phải vào vị trí bất kỳ rồi bấm chọn dòng số đầu tiên để copy Vĩ độ, Kinh độ.</i>
                                        </p>
                                    </div>

                                    {/* Đặt làm mặc định */}
                                    <div className="pt-1 flex items-center justify-between text-xs">
                                        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 dark:text-slate-300 font-semibold">
                                            <input
                                                type="radio"
                                                name="sr_mac_dinh"
                                                checked={!!sr.la_mac_dinh}
                                                onChange={() => xuLyDatLamMacDinh(idx)}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span>Đặt làm Showroom chính (Mặc định khi mở trang)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={xuLyLuuShowroom}
                            disabled={dangLuuShowroom}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                        >
                            {dangLuuShowroom ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span>{dangLuuShowroom ? 'Đang lưu hệ thống...' : 'Lưu Tất Cả Showroom & Tọa Độ'}</span>
                        </button>
                    </div>
                </div>

                {/* Cột Phải: Live Preview Bản Đồ (5 Cột, Sticky) */}
                <div className="xl:col-span-5 sticky top-20 space-y-4">
                    <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                                <h3 className="font-black text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                    Xem Trước Google Maps Trực Quan
                                </h3>
                            </div>
                            {danhSachShowroomAdmin[showroomDangXemTruoc] && (
                                <a
                                    href={`https://www.google.com/maps?q=${danhSachShowroomAdmin[showroomDangXemTruoc].vi_do},${danhSachShowroomAdmin[showroomDangXemTruoc].kinh_do}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    <span>Mở map ngoài</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>

                        {/* Chi tiết showroom đang preview */}
                        {danhSachShowroomAdmin[showroomDangXemTruoc] ? (
                            <div className="space-y-2">
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                                        {danhSachShowroomAdmin[showroomDangXemTruoc].ten}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                        📍 {danhSachShowroomAdmin[showroomDangXemTruoc].dia_chi}
                                    </div>
                                    <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                                        <span>Vĩ độ: <b>{danhSachShowroomAdmin[showroomDangXemTruoc].vi_do}</b></span>
                                        <span>Kinh độ: <b>{danhSachShowroomAdmin[showroomDangXemTruoc].kinh_do}</b></span>
                                    </div>
                                </div>

                                {/* Khung iframe bản đồ */}
                                <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-900">
                                    <iframe
                                        title="Google Maps Showroom Preview"
                                        src={`https://maps.google.com/maps?q=${danhSachShowroomAdmin[showroomDangXemTruoc].vi_do || 10.760086},${danhSachShowroomAdmin[showroomDangXemTruoc].kinh_do || 106.663185}&hl=vi&z=16&output=embed`}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
                                Chưa chọn showroom để xem trước
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
