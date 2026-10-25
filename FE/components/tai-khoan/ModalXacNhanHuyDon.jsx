'use client';
import { createPortal } from 'react-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Hộp xác nhận hủy đơn (thay cho hộp thoại mặc định của trình duyệt) của trang tài khoản: tách từ app/tai-khoan/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ModalXacNhanHuyDon({
    daGanKetDOM,
    donCanXacNhanHuy,
    setDonCanXacNhanHuy,
    donDangHuy,
    CAC_LY_DO_HUY,
    lyDoHuyChon,
    setLyDoHuyChon,
    lyDoHuyKhac,
    setLyDoHuyKhac,
    thucHienHuyDon
}) {
    if (!(daGanKetDOM && typeof document !== 'undefined' && donCanXacNhanHuy)) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => !donDangHuy && setDonCanXacNhanHuy(null)}
        >
            <div
                className="w-full max-w-sm max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200 p-5 sm:p-6 text-center animate-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-900">Hủy đơn hàng này?</h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                    Đơn <strong className="font-mono text-slate-900">#{donCanXacNhanHuy.ma_don_hang}</strong> sẽ bị hủy và không thể khôi phục.
                    Bạn có thể đặt lại bất cứ lúc nào.
                </p>

                <div className="mt-4 text-left">
                    <div className="text-xs font-black uppercase tracking-wide text-slate-700 mb-2">Lý do hủy đơn <span className="text-rose-600">*</span></div>
                    <div className="space-y-1.5">
                        {CAC_LY_DO_HUY.map((ly) => (
                            <label
                                key={ly}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 text-[13px] font-bold cursor-pointer transition-colors ${
                                    lyDoHuyChon === ly
                                        ? 'border-rose-500 bg-rose-50 text-rose-800'
                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="ly-do-huy-don"
                                    checked={lyDoHuyChon === ly}
                                    onChange={() => setLyDoHuyChon(ly)}
                                    disabled={!!donDangHuy}
                                    className="accent-rose-600"
                                />
                                <span>{ly}</span>
                            </label>
                        ))}
                    </div>
                    {lyDoHuyChon === 'Khác' && (
                        <textarea
                            value={lyDoHuyKhac}
                            onChange={(e) => setLyDoHuyKhac(e.target.value.slice(0, 200))}
                            rows={2}
                            placeholder="Cho chúng tôi biết thêm lý do (không bắt buộc)..."
                            className="mt-2 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-rose-400 focus:outline-none text-[13px] font-medium text-slate-800 resize-none"
                        />
                    )}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        disabled={!!donDangHuy}
                        onClick={() => setDonCanXacNhanHuy(null)}
                        className="py-2.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-black cursor-pointer transition-colors disabled:opacity-50"
                    >
                        Giữ đơn
                    </button>
                    <button
                        type="button"
                        disabled={!!donDangHuy || !lyDoHuyChon}
                        onClick={thucHienHuyDon}
                        className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-black cursor-pointer transition-colors shadow-md shadow-rose-600/25 disabled:opacity-60 flex items-center justify-center gap-1.5"
                    >
                        {donDangHuy && <RefreshCw className="w-4 h-4 animate-spin" />}
                        <span>{donDangHuy ? 'Đang hủy...' : 'Hủy đơn'}</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
