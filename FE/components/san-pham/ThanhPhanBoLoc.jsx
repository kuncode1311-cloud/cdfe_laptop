'use client';
import React, { useState } from 'react';
import {
    Check, ChevronDown, X, Cpu, MemoryStick, HardDrive, Layers, Monitor, Zap, Palette
} from 'lucide-react';

/**
 * Các thành phần giao diện bộ lọc dùng chung cho thanh lọc nhanh (ThanhBoLocTinhGon)
 * và drawer "Tất cả bộ lọc" (BoLocSanPham), để hai nơi luôn nhìn và hoạt động giống nhau.
 */

// Khoá bieuTuong trong utils/bo-loc.js -> icon
export const BIEU_TUONG_LOC = {
    cpu: Cpu,
    ram: MemoryStick,
    oCung: HardDrive,
    gpu: Layers,
    manHinh: Monitor,
    tanSoQuet: Zap,
    tamNen: Palette
};

/**
 * Màu theo nhóm. Viết đủ class (không ghép chuỗi) để Tailwind nhận diện được.
 * - chon / hover / dem / tag / bieuTuong: dùng cho nút, thẻ lọc
 * - khoi / dau / oIcon: dùng cho khối lọc trong drawer (viền khối, nền tiêu đề, ô icon)
 */
export const MAU_LOC = {
    blue: {
        chon: 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-cyan-300',
        hover: 'hover:border-blue-400',
        bieuTuong: 'text-blue-600',
        dem: 'bg-blue-600 text-white',
        tag: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-cyan-300 dark:border-blue-800',
        khoi: 'border-blue-200 dark:border-blue-900/70',
        dau: 'bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/50 dark:to-slate-900',
        oIcon: 'bg-blue-600 text-white shadow-blue-600/30'
    },
    indigo: {
        chon: 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300',
        hover: 'hover:border-indigo-400',
        bieuTuong: 'text-indigo-500',
        dem: 'bg-indigo-600 text-white',
        tag: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800',
        khoi: 'border-indigo-200 dark:border-indigo-900/70',
        dau: 'bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-950/50 dark:to-slate-900',
        oIcon: 'bg-indigo-600 text-white shadow-indigo-600/30'
    },
    cyan: {
        chon: 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300',
        hover: 'hover:border-cyan-400',
        bieuTuong: 'text-cyan-600',
        dem: 'bg-cyan-600 text-white',
        tag: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800',
        khoi: 'border-cyan-200 dark:border-cyan-900/70',
        dau: 'bg-gradient-to-r from-cyan-50 to-white dark:from-cyan-950/50 dark:to-slate-900',
        oIcon: 'bg-cyan-600 text-white shadow-cyan-600/30'
    },
    emerald: {
        chon: 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300',
        hover: 'hover:border-emerald-400',
        bieuTuong: 'text-emerald-500',
        dem: 'bg-emerald-600 text-white',
        tag: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        khoi: 'border-emerald-200 dark:border-emerald-900/70',
        dau: 'bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/50 dark:to-slate-900',
        oIcon: 'bg-emerald-600 text-white shadow-emerald-600/30'
    },
    violet: {
        chon: 'border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/80 dark:text-violet-300',
        hover: 'hover:border-violet-400',
        bieuTuong: 'text-violet-500',
        dem: 'bg-violet-600 text-white',
        tag: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800',
        khoi: 'border-violet-200 dark:border-violet-900/70',
        dau: 'bg-gradient-to-r from-violet-50 to-white dark:from-violet-950/50 dark:to-slate-900',
        oIcon: 'bg-violet-600 text-white shadow-violet-600/30'
    },
    rose: {
        chon: 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300',
        hover: 'hover:border-rose-400',
        bieuTuong: 'text-rose-500',
        dem: 'bg-rose-600 text-white',
        tag: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
        khoi: 'border-rose-200 dark:border-rose-900/70',
        dau: 'bg-gradient-to-r from-rose-50 to-white dark:from-rose-950/50 dark:to-slate-900',
        oIcon: 'bg-rose-600 text-white shadow-rose-600/30'
    },
    amber: {
        chon: 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300',
        hover: 'hover:border-amber-400',
        bieuTuong: 'text-amber-500',
        dem: 'bg-amber-500 text-white',
        tag: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        khoi: 'border-amber-200 dark:border-amber-900/70',
        dau: 'bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/50 dark:to-slate-900',
        oIcon: 'bg-amber-500 text-white shadow-amber-500/30'
    },
    sky: {
        chon: 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300',
        hover: 'hover:border-sky-400',
        bieuTuong: 'text-sky-500',
        dem: 'bg-sky-600 text-white',
        tag: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
        khoi: 'border-sky-200 dark:border-sky-900/70',
        dau: 'bg-gradient-to-r from-sky-50 to-white dark:from-sky-950/50 dark:to-slate-900',
        oIcon: 'bg-sky-600 text-white shadow-sky-600/30'
    },
    purple: {
        chon: 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300',
        hover: 'hover:border-purple-400',
        bieuTuong: 'text-purple-500',
        dem: 'bg-purple-600 text-white',
        tag: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
        khoi: 'border-purple-200 dark:border-purple-900/70',
        dau: 'bg-gradient-to-r from-purple-50 to-white dark:from-purple-950/50 dark:to-slate-900',
        oIcon: 'bg-purple-600 text-white shadow-purple-600/30'
    },
    teal: {
        chon: 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300',
        hover: 'hover:border-teal-400',
        bieuTuong: 'text-teal-500',
        dem: 'bg-teal-600 text-white',
        tag: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
        khoi: 'border-teal-200 dark:border-teal-900/70',
        dau: 'bg-gradient-to-r from-teal-50 to-white dark:from-teal-950/50 dark:to-slate-900',
        oIcon: 'bg-teal-600 text-white shadow-teal-600/30'
    }
};

const LOP_NUT_THUONG = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200';

/**
 * Nút lọc có panel xổ xuống. Panel là `children`.
 * - tomTat: chữ hiện trên nút khi đã chọn (null nếu chưa chọn gì)
 * - soDaChon: hiện chấm số nhỏ bên cạnh khi chọn nhiều
 */
export function NhomLocDropdown({
    dangMo, onBam, Icon, mau = 'blue', tieuDe, tomTat = null, soDaChon = 0, tieuDePanel, onBoChon, rong = 'w-64', children
}) {
    const m = MAU_LOC[mau];
    return (
        <div className="relative">
            <button
                type="button"
                onClick={onBam}
                aria-expanded={dangMo}
                className={`h-9 px-3 rounded-xl text-xs font-bold border-2 flex items-center gap-1.5 transition-all duration-200 cursor-pointer select-none ${
                    tomTat ? `${m.chon} font-black` : `${LOP_NUT_THUONG} ${m.hover}`
                }`}
            >
                {Icon && <Icon className={`w-3.5 h-3.5 ${m.bieuTuong}`} />}
                <span className="max-w-[170px] truncate">{tomTat || tieuDe}</span>
                {soDaChon > 1 && (
                    <span className={`min-w-4 h-4 px-1 rounded-full text-[10px] font-black flex items-center justify-center ${m.dem}`}>
                        {soDaChon}
                    </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${dangMo ? 'rotate-180' : ''}`} />
            </button>

            {dangMo && (
                <div className={`absolute left-0 top-11 z-30 ${rong} max-w-[calc(100vw-2rem)] p-2.5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl space-y-2 animate-in fade-in zoom-in-95 duration-150`}>
                    {(tieuDePanel || onBoChon) && (
                        <div className="flex items-center justify-between px-1 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-xs font-black text-slate-800 dark:text-white">{tieuDePanel}</span>
                            {onBoChon && soDaChon > 0 && (
                                <button type="button" onClick={onBoChon} className="text-[11px] text-red-500 font-bold hover:underline cursor-pointer">
                                    Bỏ chọn
                                </button>
                            )}
                        </div>
                    )}
                    {children}
                </div>
            )}
        </div>
    );
}

/**
 * Danh sách tuỳ chọn, mỗi mục: [ô tích] tên ... số sản phẩm.
 * - kieu 'dong': mỗi mục một dòng (trong dropdown); 'luoi': dạng ô lưới nhiều cột (trong drawer)
 * - chonMotMuc: true thì hiện ô tròn (chọn 1), mặc định ô vuông (chọn nhiều)
 * - renderTruoc: vẽ thêm phần đầu mỗi mục (ví dụ ô chữ cái của thương hiệu)
 * tuyChon: [{ ma, nhan, soLuong }]
 */
export function DanhSachTuyChon({
    tuyChon, daChon = [], onToggle, mau = 'blue', kieu = 'dong', soCot = 2, cao = '', chonMotMuc = false, renderTruoc = null
}) {
    const m = MAU_LOC[mau];
    const lopCot = kieu === 'luoi' ? (soCot === 3 ? 'grid grid-cols-2 sm:grid-cols-3 gap-2' : 'grid grid-cols-2 gap-2') : 'space-y-1';

    return (
        <div className={`${lopCot} ${cao} overflow-y-auto pr-0.5 scrollbar-thin`}>
            {tuyChon.map((x) => {
                const dangChon = daChon.includes(x.ma);
                return (
                    <button
                        key={x.ma}
                        type="button"
                        onClick={() => onToggle(x.ma)}
                        title={x.nhan}
                        aria-pressed={dangChon}
                        className={`w-full rounded-xl border-2 text-left text-xs font-bold transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                            kieu === 'luoi' ? 'p-2' : 'py-1.5 px-2'
                        } ${
                            dangChon
                                ? `${m.chon} font-black shadow-sm`
                                : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 ${m.hover} hover:bg-slate-50 dark:hover:bg-slate-800`
                        }`}
                    >
                        {renderTruoc ? renderTruoc(x, dangChon) : (
                            <span className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 transition-colors ${chonMotMuc ? 'rounded-full' : 'rounded'} ${
                                dangChon ? `${m.dem} border-transparent` : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                            }`}>
                                {dangChon && (chonMotMuc ? <span className="w-1.5 h-1.5 rounded-full bg-white" /> : <Check className="w-3 h-3 stroke-[3.5]" />)}
                            </span>
                        )}
                        <span className={`${x.anNhan ? 'sr-only' : 'truncate flex-1'} text-[12px]`}>{x.nhan}</span>
                        {x.soLuong !== undefined && (
                            <span className={`text-[10px] font-black shrink-0 px-1.5 rounded-md ${
                                dangChon ? `${m.dem}` : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>{x.soLuong}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

/**
 * Khối lọc có thể gập/mở trong drawer: ô icon màu, tiêu đề, tóm tắt mục đã chọn, số đã chọn.
 * Khi gập vẫn thấy ngay nhóm này đang chọn gì nhờ `ghiChu`.
 */
export function KhoiLoc({ tieuDe, Icon, mau = 'blue', soDaChon = 0, ghiChu = '', onBoChon, moMacDinh = false, children }) {
    const [mo, setMo] = useState(moMacDinh || soDaChon > 0);
    const m = MAU_LOC[mau];
    return (
        <section className={`rounded-2xl border-2 ${m.khoi} bg-white dark:bg-slate-900 overflow-hidden shadow-sm`}>
            <button
                type="button"
                onClick={() => setMo((v) => !v)}
                aria-expanded={mo}
                title={ghiChu || tieuDe}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer ${m.dau}`}
            >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${m.oIcon}`}>
                    <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1 min-w-0">
                    <span className="block text-xs font-black uppercase tracking-wide text-slate-800 dark:text-white truncate">{tieuDe}</span>
                    {ghiChu && <span className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate">{ghiChu}</span>}
                </span>
                {soDaChon > 0 && (
                    <span className={`min-w-5 h-5 px-1.5 rounded-full text-[11px] font-black flex items-center justify-center ${m.dem}`}>{soDaChon}</span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${mo ? 'rotate-180' : ''}`} />
            </button>

            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${mo ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="p-2.5 space-y-2.5 border-t border-slate-100 dark:border-slate-800">
                        {children}
                        {onBoChon && soDaChon > 0 && (
                            <button type="button" onClick={onBoChon} className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer">
                                Bỏ chọn nhóm này
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Công tắc gạt (bật/tắt) dùng trong drawer
export function CongTacGat({ nhan, moTa, soLuong, dangBat, onDoi, Icon }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={dangBat}
            onClick={onDoi}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                dangBat
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-emerald-300'
            }`}
        >
            {Icon && <Icon className={`w-4 h-4 shrink-0 ${dangBat ? 'text-emerald-600' : 'text-slate-400'}`} />}
            <span className="flex-1 min-w-0">
                <span className="block text-xs font-black text-slate-800 dark:text-slate-100">{nhan}</span>
                {moTa && <span className="block text-[11px] text-slate-500 dark:text-slate-400">{moTa}</span>}
            </span>
            {soLuong !== undefined && <span className="text-[10px] font-black text-slate-400 shrink-0">{soLuong}</span>}
            <span className={`relative w-10 h-6 rounded-full shrink-0 transition-colors duration-200 ${dangBat ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${dangBat ? 'translate-x-4' : ''}`} />
            </span>
        </button>
    );
}

// Nút bật/tắt (trả góp 0%, đang giảm giá, còn hàng...) trên thanh lọc nhanh
export function NutCongTac({ nhan, dangBat, soLuong, onBam, Icon }) {
    return (
        <button
            type="button"
            onClick={onBam}
            aria-pressed={dangBat}
            className={`h-9 px-3 rounded-xl font-black text-xs border-2 transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none ${
                dangBat
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
            }`}
        >
            {Icon && <Icon className={`w-3.5 h-3.5 ${dangBat ? 'text-white' : 'text-emerald-500'}`} />}
            <span>{nhan}</span>
            {dangBat ? <Check className="w-3 h-3 stroke-[3.5]" /> : soLuong !== undefined && (
                <span className="text-[10px] text-slate-400 font-bold">{soLuong}</span>
            )}
        </button>
    );
}

// Thẻ nhỏ hiển thị một tiêu chí đang áp dụng, bấm X để bỏ
export function TheTagLoc({ nhan, mau = 'blue', onGo }) {
    return (
        <span className={`inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-lg font-black text-[11px] border ${MAU_LOC[mau].tag}`}>
            {nhan}
            <button type="button" onClick={onGo} aria-label={`Bỏ lọc ${nhan}`} className="rounded hover:text-red-500 cursor-pointer">
                <X className="w-3 h-3" />
            </button>
        </span>
    );
}
