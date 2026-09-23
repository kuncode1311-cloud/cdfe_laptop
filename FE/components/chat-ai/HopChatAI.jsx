'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, RotateCcw, ChevronDown, Loader2, Zap } from 'lucide-react';
import { TroLyAiService } from '@/services/tro-ly-ai.service';
import TheSanPhamGoiY from './TheSanPhamGoiY';

// Danh sách câu hỏi gợi ý nhanh ban đầu đa dạng (cả Laptop lẫn Phụ kiện) với Icon & Badge màu đậm nét
const GOI_Y_NHANH_BAN_DAU = [
    { icon: '🔥', text: 'Laptop gaming tầm 20-30 triệu', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
    { icon: '⚡', text: 'Củ sạc nhanh GaN & Phụ kiện', bg: 'bg-orange-100 text-orange-800 border-orange-300' },
    { icon: '🖱️', text: 'Chuột & Bàn phím cơ bán chạy', bg: 'bg-blue-100 text-blue-800 border-blue-300' },
    { icon: '💼', text: 'Laptop văn phòng mỏng nhẹ pin trâu', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { icon: '🛡️', text: 'Chính sách bảo hành & Trả góp 0%', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' }
];

/**
 * Phân tích và chuẩn hóa câu gợi ý để luôn hiển thị icon đẹp và màu sắc nổi bật
 */
function parseGoiY(gy) {
    if (typeof gy === 'object' && gy !== null && gy.text) {
        return gy;
    }
    const text = String(gy || '').trim();
    const matchEmoji = text.match(/^([\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]|\p{Extended_Pictographic})/u);
    if (matchEmoji) {
        return {
            icon: matchEmoji[0],
            text: text.replace(matchEmoji[0], '').trim(),
            bg: 'bg-blue-100 text-blue-800 border-blue-300'
        };
    }
    return {
        icon: '💬',
        text: text,
        bg: 'bg-slate-100 text-slate-800 border-slate-300'
    };
}

/**
 * Component hiển thị chữ Markdown gọn gàng, độ tương phản cao, không bị tệp màu
 */
function VanBanMarkdown({ noiDung }) {
    if (!noiDung) return null;

    const cacDong = noiDung.split('\n');

    return (
        <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed text-slate-950 font-medium">
            {cacDong.map((dong, idx) => {
                const dongTrim = dong.trim();
                if (!dongTrim) return <div key={idx} className="h-1" />;

                // Gạch đầu dòng
                if (dongTrim.startsWith('* ') || dongTrim.startsWith('- ')) {
                    const nd = dongTrim.substring(2);
                    return (
                        <div key={idx} className="flex items-start gap-1.5 pl-1">
                            <span className="text-blue-700 font-black mt-0.5">•</span>
                            <span className="text-slate-950">{dinhDangInDam(nd)}</span>
                        </div>
                    );
                }

                return <p key={idx} className="text-slate-950">{dinhDangInDam(dongTrim)}</p>;
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
 * Hộp Chatbot Trợ lý AI Toàn diện (HopChatAI) - Giao diện Sang Trọng, Độ tương phản cao, Gọn gàng
 */
export default function HopChatAI() {
    const [dangMo, setDangMo] = useState(false);
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
            {/* 1. NÚT TRÒN MỞ CHATBOT (GỌN GÀNG, KHÔNG CÓ BONG BÓNG LỜI CHÀO THỪA) */}
            {!dangMo && (
                <button
                    type="button"
                    onClick={() => setDangMo(true)}
                    className="relative group w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-700/35 hover:shadow-blue-700/55 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                    title="Mở Trợ lý AI TNTP Laptop"
                    aria-label="Mở Trợ lý AI"
                >
                    <span className="absolute inset-0 rounded-full bg-blue-400 opacity-25 group-hover:animate-ping" />
                    <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:rotate-6 drop-shadow-sm" />
                    <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
                </button>
            )}

            {/* 2. CỬA SỔ HỘP THOẠI CHAT RESPONSIVE CHUẨN MỰC */}
            {dangMo && (
                <div className="flex flex-col w-[calc(100vw-24px)] sm:w-[380px] md:w-[390px] h-[500px] sm:h-[530px] max-h-[80vh] bg-white border border-slate-300 shadow-2xl shadow-slate-900/20 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-200 animate-in fade-in zoom-in-95">
                    {/* Header Hộp Chat - Xanh Đậm Hoàng Gia Sắc Nét */}
                    <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-4 py-3 flex items-center justify-between text-white shadow-md">
                        <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
                                <Bot className="w-4 h-4 text-white" />
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-blue-700 rounded-full" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="font-extrabold text-sm text-white tracking-tight">
                                        Trợ lý AI TNTP Laptop
                                    </h3>
                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/25 text-emerald-100 border border-emerald-400/40 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                        Trực tuyến
                                    </span>
                                </div>
                                <p className="text-[10px] text-blue-100 font-medium">
                                    Chuyên gia tư vấn sản phẩm & kho hàng 24/7
                                </p>
                            </div>
                        </div>

                        {/* Nút hành động trên Header */}
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={xuLyLamMoiChat}
                                className="p-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-xl transition-all cursor-pointer"
                                title="Làm mới đoạn chat"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setDangMo(false)}
                                className="p-1.5 text-white/90 hover:text-white hover:bg-white/20 rounded-xl transition-all cursor-pointer"
                                title="Thu nhỏ khung chat"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Vùng Lịch Sử Tin Nhắn - Nền tương phản cao để chữ & thẻ nổi bật */}
                    <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-3 bg-slate-100/95 scrollbar-thin scrollbar-thumb-slate-300">
                        {danhSachTinNhan.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                                {/* Bong bóng tin nhắn */}
                                <div
                                    className={`max-w-[88%] rounded-2xl p-3 shadow-xs ${
                                        msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/15'
                                            : 'bg-white border border-slate-300/90 text-slate-950 rounded-tl-none shadow-xs'
                                    }`}
                                >
                                    {msg.role === 'user' ? (
                                        <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap text-white font-semibold">
                                            {msg.noiDung}
                                        </p>
                                    ) : (
                                        <VanBanMarkdown noiDung={msg.noiDung} />
                                    )}
                                </div>

                                {/* Danh sách thẻ sản phẩm gợi ý siêu gọn (Product Cards) */}
                                {msg.role === 'model' && Array.isArray(msg.san_pham_goi_y) && msg.san_pham_goi_y.length > 0 && (
                                    <div className="w-full mt-2 space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-blue-800 px-1">
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

                                {/* Các câu hỏi gợi ý tiếp theo - ĐẬM MÀU, CÓ ICON RÕ RÀNG, DỄ ĐỌC */}
                                {msg.role === 'model' && Array.isArray(msg.goi_y_tiep_theo) && msg.goi_y_tiep_theo.length > 0 && (
                                    <div className="w-full mt-2 flex flex-col gap-1.5">
                                        {msg.goi_y_tiep_theo.map((gy, gIdx) => {
                                            const parsed = parseGoiY(gy);
                                            return (
                                                <button
                                                    key={gIdx}
                                                    type="button"
                                                    onClick={() => xuLyGuiTinNhan(parsed.text)}
                                                    className="group flex items-center gap-2 bg-white hover:bg-blue-50/80 border border-slate-300 hover:border-blue-500 px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer text-left"
                                                >
                                                    <span className={`w-5 h-5 rounded-md ${parsed.bg || 'bg-blue-100 text-blue-800 border-blue-300'} flex items-center justify-center text-xs flex-shrink-0 border font-normal`}>
                                                        {parsed.icon}
                                                    </span>
                                                    <span className="text-[12px] font-bold text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-1 flex-1">
                                                        {parsed.text}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Chỉ báo AI đang suy nghĩ */}
                        {dangTai && (
                            <div className="flex items-center gap-2 text-slate-800 text-xs bg-white border border-slate-300 w-fit px-3 py-2 rounded-2xl rounded-tl-none shadow-xs">
                                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                                <span className="font-bold text-slate-800">Đang chọn sản phẩm phù hợp...</span>
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
                            className="flex items-center gap-2 bg-slate-100/90 border border-slate-300 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 rounded-xl px-3 py-1.5 transition-all"
                        >
                            <input
                                ref={oNhapRef}
                                type="text"
                                value={tinNhanNhap}
                                onChange={(e) => setTinNhanNhap(e.target.value)}
                                onKeyDown={xuLyNhanPhim}
                                placeholder="Hỏi mua laptop, sạc, chuột, linh kiện..."
                                disabled={dangTai}
                                className="flex-1 bg-transparent text-xs sm:text-[13px] text-slate-950 placeholder:text-slate-500 font-medium focus:outline-none py-0.5 disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!tinNhanNhap.trim() || dangTai}
                                className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 cursor-pointer flex-shrink-0 shadow-md shadow-blue-500/20"
                                title="Gửi câu hỏi"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>
                        <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1.5 px-1 font-semibold">
                            <span className="flex items-center gap-1 text-blue-700">⚡ TNTP LAPTOP • Tư vấn 24/7</span>
                            <span className="text-slate-600">Cam kết chính hãng 100%</span>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}
