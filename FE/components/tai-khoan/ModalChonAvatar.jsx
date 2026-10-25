'use client';
import { createPortal } from 'react-dom';
import { Sparkles, X, User, Trash2 } from 'lucide-react';

// Preset Avatar Công Nghệ Đẹp & Chuẩn Quốc Tế
const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
];

// Modal chọn avatar preset qua Portal của trang tài khoản: tách từ app/tai-khoan/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ModalChonAvatar({
    daGanKetDOM,
    moModalChonAvatar,
    setMoModalChonAvatar,
    xuLyXoaAvatar,
    avatarChon,
    xuLyChonNhanhAvatar
}) {
    if (!(daGanKetDOM && typeof document !== 'undefined' && moModalChonAvatar)) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMoModalChonAvatar(false)}
        >
            <div
                className="bg-white rounded-[28px] p-6 max-w-md w-full border-2 border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 text-slate-900"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-black text-base text-slate-900 flex items-center gap-2">
                            <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                            <span>Chọn Ảnh Đại Diện TNTP</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Bấm vào ảnh bạn thích để cập nhật ngay lập tức
                        </p>
                    </div>
                    <button
                        onClick={() => setMoModalChonAvatar(false)}
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                    <button
                        type="button"
                        onClick={xuLyXoaAvatar}
                        className={`relative aspect-square rounded-2xl overflow-hidden ring-2 transition-all hover:scale-105 cursor-pointer shadow-sm flex flex-col items-center justify-center bg-slate-100 ${
                            !avatarChon ? 'ring-blue-600 scale-105 shadow-md shadow-blue-500/40 bg-blue-50/60' : 'ring-transparent hover:ring-slate-300'
                        }`}
                        title="Dùng icon mặc định (Không đặt ảnh)"
                    >
                        <User className={`w-8 h-8 ${!avatarChon ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className={`text-[10.5px] font-bold mt-1 ${!avatarChon ? 'text-blue-700 font-black' : 'text-slate-500'}`}>
                            Icon Mặc Định
                        </span>
                    </button>
                    {AVATAR_PRESETS.map((img, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => xuLyChonNhanhAvatar(img)}
                            className={`relative aspect-square rounded-2xl overflow-hidden ring-2 transition-all hover:scale-105 cursor-pointer shadow-sm ${
                                avatarChon === img ? 'ring-blue-600 scale-105 shadow-md shadow-blue-500/40' : 'ring-transparent hover:ring-slate-300'
                            }`}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    {avatarChon ? (
                        <button
                            type="button"
                            onClick={xuLyXoaAvatar}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Đặt về icon mặc định</span>
                        </button>
                    ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Đang dùng icon mặc định</span>
                    )}
                    <button
                        type="button"
                        onClick={() => setMoModalChonAvatar(false)}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
