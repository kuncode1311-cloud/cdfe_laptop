'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, RotateCcw, ChevronDown, Loader2, Zap } from 'lucide-react';
import { TroLyAiService } from '@/services/tro-ly-ai.service';
import TheSanPhamGoiY from './TheSanPhamGoiY';

// Danh sách câu hỏi gợi ý nhanh ban đầu đa dạng (cả Laptop lẫn Phụ kiện)
const GOI_Y_NHANH_BAN_DAU = [
    '🔥 Laptop gaming tầm 20-30 triệu',
    '⚡ Củ sạc nhanh GaN & Phụ kiện',
    '🖱️ Chuột & Bàn phím cơ bán chạy',
    '💼 Laptop văn phòng mỏng nhẹ pin trâu',
    '🛡️ Chính sách bảo hành & Trả góp 0%'
];

/**
 * Component hiển thị chữ Markdown gọn gàng, độ tương phản cao, không bị tệp màu
 */
function VanBanMarkdown({ noiDung }) {
    if (!noiDung) return null;

    const cacDong = noiDung.split('\n');

    return (
        <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-800 font-medium">
            {cacDong.map((dong, idx) => {
                const dongTrim = dong.trim();
                if (!dongTrim) return <div key={idx} className="h-1" />;

                // Gạch đầu dòng
                if (dongTrim.startsWith('* ') || dongTrim.startsWith('- ')) {
                    const nd = dongTrim.substring(2);
                    return (
                        <div key={idx} className="flex items-start gap-1.5 pl-1">
                            <span className="text-blue-600 font-bold mt-0.5">•</span>
                            <span>{dinhDangInDam(nd)}</span>
                        </div>
                    );
                }

                return <p key={idx}>{dinhDangInDam(dongTrim)}</p>;
            })}
        </div>
    );
}

/**
 * Helper in đậm các cụm nằm trong **...**
 */
function dinhDangInDam(text) {
    if (!text.includes('**')) return text;

    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={i} className="font-extrabold text-blue-700">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
}

/**
 * Hộp Chatbot Trợ lý AI Toàn diện (HopChatAI) - Giao diện Sang Trọng, Responsive, Tone Sáng Đồng Bộ
 */
export default function HopChatAI() {
    const [dangMo, setDangMo] = useState(false);
    const [hienThiBongBongChao, setHienThiBongBongChao] = useState(true);
    const [tinNhanNhap, setTinNhanNhap] = useState('');
    const [dangTai, setDangTai] = useState(false);
    const [danhSachTinNhan, setDanhSachTinNhan] = useState([
        {
            id: 'chao-mung',
            role: 'model',
            noiDung: 'Dạ em chào Bạn! 👋 Em là **Trợ lý Tư vấn của TNTP Laptop**.\nEm luôn sẵn sàng hỗ trợ Bạn chọn mua laptop chính hãng và các phụ kiện công nghệ phù hợp nhất với giá ưu đãi hôm nay ạ. Bạn đang quan tâm dòng máy hay món phụ kiện nào thế ạ?',
            san_pham_goi_y: [],
            goi_y_tiep_theo: GOI_Y_NHANH_BAN_DAU
        }
    ]);

    const cuonCuoiRef = useRef(null);
    const oNhapRef = useRef(null);

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        if (dangMo) {
            cuonCuoiRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [danhSachTinNhan, dangTai, dangMo]);

    // Tự động focus vào ô nhập liệu khi mở chat
    useEffect(() => {
        if (dangMo) {
            setTimeout(() => {
                oNhapRef.current?.focus();
            }, 200);
        }
    }, [dangMo]);

    // Xử lý gửi tin nhắn
    const xuLyGuiTinNhan = async (noiDungTuyChon) => {
        const textGui = (noiDungTuyChon || tinNhanNhap || '').trim();
        if (!textGui || dangTai) return;

        setTinNhanNhap('');
        setHienThiBongBongChao(false);

        const tinNhanNguoiDung = {
            id: `user-${Date.now()}`,
            role: 'user',
            noiDung: textGui
        };

        const danhSachMoi = [...danhSachTinNhan, tinNhanNguoiDung];
        setDanhSachTinNhan(danhSachMoi);
        setDangTai(true);

        try {
            const lichSu = danhSachMoi.slice(1).map(m => ({
                role: m.role === 'model' ? 'model' : 'user',
                content: m.noiDung
            }));

            const ketQua = await TroLyAiService.guiTinNhan(textGui, lichSu);

            if (ketQua && ketQua.thanh_cong) {
                const tinNhanAI = {
                    id: `model-${Date.now()}`,
                    role: 'model',
                    noiDung: ketQua.cau_tra_loi || 'Dạ TNTP Laptop xin gửi Bạn các gợi ý phù hợp nhất:',
                    san_pham_goi_y: ketQua.san_pham_goi_y || [],
                    goi_y_tiep_theo: ketQua.goi_y_tiep_theo || []
                };
                setDanhSachTinNhan(prev => [...prev, tinNhanAI]);
            } else {
                setDanhSachTinNhan(prev => [
                    ...prev,
                    {
                        id: `model-${Date.now()}`,
                        role: 'model',
                        noiDung: ketQua?.thong_diep || 'Dạ kết nối với hệ thống đang bận, Bạn vui lòng thử lại sau giây lát nhé ạ.',
                        san_pham_goi_y: []
                    }
                ]);
            }
        } catch {
            setDanhSachTinNhan(prev => [
                ...prev,
                {
                    id: `model-${Date.now()}`,
                    role: 'model',
                    noiDung: 'Dạ đường truyền mạng tạm thời gián đoạn, Bạn có thể gửi lại câu hỏi hoặc gọi trực tiếp Hotline **0948.37.79.79** để được hỗ trợ tức thì nhé ạ! 🙏',
                    san_pham_goi_y: []
                }
            ]);
        } finally {
            setDangTai(false);
        }
    };

    const xuLyNhanPhim = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            xuLyGuiTinNhan();
        }
    };

    const xuLyLamMoiChat = () => {
        setDanhSachTinNhan([
            {
                id: 'chao-mung-moi',
                role: 'model',
                noiDung: 'Đoạn hội thoại đã được làm mới! ✨ Em có thể hỗ trợ Bạn tìm chiếc laptop hay phụ kiện nào hôm nay ạ?',
                san_pham_goi_y: [],
                goi_y_tiep_theo: GOI_Y_NHANH_BAN_DAU
            }
        ]);
        oNhapRef.current?.focus();
    };

    return (
        <aside className="fixed right-3 sm:right-6 bottom-4 sm:bottom-6 z-50 font-sans">
            {/* 1. BONG BÓNG LỜI CHÀO NỔI (Khi chưa mở hộp chat) */}
            {!dangMo && hienThiBongBongChao && (
                <div 
                    onClick={() => { setDangMo(true); setHienThiBongBongChao(false); }}
                    className="absolute right-0 bottom-16 w-56 sm:w-64 bg-white/95 border border-blue-200 text-slate-800 p-3 rounded-2xl shadow-xl shadow-blue-900/10 backdrop-blur-xl animate-bounce cursor-pointer flex items-center gap-2.5 transition-all hover:scale-105"
                >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-xs">
                        <p className="font-bold text-blue-700">Trợ lý AI TNTP Laptop</p>
                        <p className="text-slate-500 text-[11px] line-clamp-1">Tư vấn chọn máy chuẩn xác 24/7</p>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setHienThiBongBongChao(false); }}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                        title="Đóng lời chào"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* 2. NÚT TRÒN MỞ / ĐÓNG CHATBOT */}
            {!dangMo && (
                <button
                    type="button"
                    onClick={() => { setDangMo(true); setHienThiBongBongChao(false); }}
                    className="relative group w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                    title="Mở Trợ lý AI TNTP Laptop"
                >
                    <span className="absolute inset-0 rounded-full bg-blue-400 opacity-30 group-hover:animate-ping" />
                    <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:rotate-6" />
                    <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs" />
                </button>
            )}

            {/* 3. CỬA SỔ HỘP THOẠI CHAT RESPONSIVE CHUẨN MỰC */}
            {dangMo && (
                <div className="flex flex-col w-[calc(100vw-24px)] sm:w-[375px] md:w-[385px] h-[490px] sm:h-[520px] max-h-[78vh] bg-white border border-slate-300 shadow-2xl shadow-slate-900/15 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95">
                    {/* Header Hộp Chat */}
                    <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-3.5 py-2.5 flex items-center justify-between text-white shadow-sm">
                        <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                                <Bot className="w-4 h-4 text-white" />
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-700 rounded-full" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-extrabold text-sm text-white tracking-tight">
                                        Trợ lý AI TNTP Laptop
                                    </h3>
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Trực tuyến
                                    </span>
                                </div>
                                <p className="text-[10px] text-blue-100 font-medium">
                                    Chuyên gia tư vấn sản phẩm & kho hàng
                                </p>
                            </div>
                        </div>

                        {/* Nút hành động trên Header */}
                        <div className="flex items-center gap-0.5">
                            <button
                                type="button"
                                onClick={xuLyLamMoiChat}
                                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer"
                                title="Làm mới đoạn chat"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setDangMo(false)}
                                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition-all cursor-pointer"
                                title="Thu nhỏ khung chat"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Vùng Lịch Sử Tin Nhắn - Nền xám nhạt để thẻ trắng nổi bật rõ nét */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-3 bg-slate-100/90 scrollbar-thin scrollbar-thumb-slate-300">
                        {danhSachTinNhan.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                {/* Bong bóng tin nhắn */}
                                <div
                                    className={`max-w-[88%] rounded-2xl p-3 shadow-xs ${
                                        msg.role === 'user'
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-500/15'
                                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-none'
                                    }`}
                                >
                                    {msg.role === 'user' ? (
                                        <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap text-white font-medium">
                                            {msg.noiDung}
                                        </p>
                                    ) : (
                                        <VanBanMarkdown noiDung={msg.noiDung} />
                                    )}
                                </div>

                                {/* Danh sách thẻ sản phẩm gợi ý siêu gọn (Product Cards) */}
                                {msg.role === 'model' && Array.isArray(msg.san_pham_goi_y) && msg.san_pham_goi_y.length > 0 && (
                                    <div className="w-full mt-2 space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 px-1">
                                            <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                                            <span>Sản phẩm & phụ kiện đề xuất:</span>
                                        </div>
                                        {msg.san_pham_goi_y.map((sp) => (
                                            <TheSanPhamGoiY
                                                key={sp.id || sp.slug}
                                                sanPham={sp}
                                                onDongHopChat={() => setDangMo(false)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Các câu hỏi gợi ý tiếp theo */}
                                {msg.role === 'model' && Array.isArray(msg.goi_y_tiep_theo) && msg.goi_y_tiep_theo.length > 0 && (
                                    <div className="w-full mt-2 flex flex-wrap gap-1.5">
                                        {msg.goi_y_tiep_theo.map((gy, gIdx) => (
                                            <button
                                                key={gIdx}
                                                type="button"
                                                onClick={() => xuLyGuiTinNhan(gy)}
                                                className="text-[11px] font-semibold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/90 hover:border-blue-400 px-2.5 py-1 rounded-full shadow-xs transition-all active:scale-95 cursor-pointer text-left line-clamp-1"
                                            >
                                                {gy}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Chỉ báo AI đang suy nghĩ */}
                        {dangTai && (
                            <div className="flex items-center gap-2 text-slate-600 text-xs bg-white border border-slate-200 w-fit px-3 py-1.5 rounded-2xl rounded-tl-none shadow-xs">
                                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                                <span className="font-medium">Đang chọn sản phẩm phù hợp...</span>
                            </div>
                        )}

                        <div ref={cuonCuoiRef} />
                    </div>

                    {/* Vùng Nhập Liệu Ở Đáy */}
                    <div className="bg-white border-t border-slate-200 p-2.5 sm:p-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                xuLyGuiTinNhan();
                            }}
                            className="flex items-center gap-2 bg-slate-50 border border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 rounded-xl px-2.5 py-1 transition-all"
                        >
                            <input
                                ref={oNhapRef}
                                type="text"
                                value={tinNhanNhap}
                                onChange={(e) => setTinNhanNhap(e.target.value)}
                                onKeyDown={xuLyNhanPhim}
                                placeholder="Hỏi mua laptop, sạc, chuột, linh kiện..."
                                disabled={dangTai}
                                className="flex-1 bg-transparent text-xs sm:text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none py-1 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!tinNhanNhap.trim() || dangTai}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer flex-shrink-0 shadow-xs"
                                title="Gửi câu hỏi"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 px-1 font-medium">
                            <span>⚡ TNTP LAPTOP • Tư vấn 24/7</span>
                            <span>Cam kết chính hãng 100%</span>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
