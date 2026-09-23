/**
 * Chú thích file: Dịch vụ Trợ lý AI Bán hàng Chuyên nghiệp (Laptop New Assistant).
 * Câu trả lời cực kỳ ngắn gọn, súc tích (1-3 câu), tự động nhúng Product Cards có nút Mua ngay.
 */

const { goiGeminiXoayKey } = require('./gemini-xoay-key.service');
const { timKiemSanPhamPhuHop, dinhDangNguCanhSanPham, phanTichYDinhCauHoi } = require('./tim-kiem-san-pham-ai.service');

/**
 * Trích xuất an toàn JSON từ kết quả trả về của Gemini, tự động sửa lỗi escape phổ biến
 */
function bocTachJsonTuAi(vanBan) {
    if (!vanBan || typeof vanBan !== 'string') return null;

    let textClean = vanBan.trim()
        .replace(/```(?:json)?/gi, '')
        .replace(/```/g, '')
        .trim();

    // 1. Thử parse trực tiếp
    try {
        return JSON.parse(textClean);
    } catch {}

    // 2. Sửa lỗi escape sai (\C, \c, \d, \s...)
    try {
        const textFixed = textClean.replace(/\\([^"\\\/bfnrtu])/g, '$1');
        return JSON.parse(textFixed);
    } catch {}

    // 3. Fallback bóc tách bằng Regex
    try {
        let cauTraLoi = '';
        let idSanPham = [];
        let goiY = [];

        let matchCauTraLoi = textClean.match(/"cau_tra_loi"\s*:\s*"([\s\S]*?)"\s*,\s*"(?:id_san_pham_phu_hop|goi_y_tiep_theo)/);
        if (!matchCauTraLoi) {
            matchCauTraLoi = textClean.match(/"cau_tra_loi"\s*:\s*"((?:[^"\\]|\\.)*)/);
        }
        if (matchCauTraLoi) {
            cauTraLoi = matchCauTraLoi[1]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\/g, '');
        }

        const matchIds = textClean.match(/"id_san_pham_phu_hop"\s*:\s*\[(.*?)\]/s);
        if (matchIds) {
            idSanPham = (matchIds[1].match(/"([^"]+)"/g) || []).map(s => s.replace(/"/g, ''));
        }

        const matchGoiY = textClean.match(/"goi_y_tiep_theo"\s*:\s*\[(.*?)\]/s);
        if (matchGoiY) {
            goiY = (matchGoiY[1].match(/"([^"]+)"/g) || []).map(s => s.replace(/"/g, ''));
        }

        if (cauTraLoi) {
            return {
                cau_tra_loi: cauTraLoi,
                id_san_pham_phu_hop: idSanPham,
                goi_y_tiep_theo: goiY
            };
        }
    } catch {}

    return null;
}

/**
 * Tạo câu trả lời dự phòng dí dỏm, bám sát từng loại sản phẩm nếu AI gặp sự cố
 */
function taoCauPhanHoiFallback(tieuChi = {}) {
    if (tieuChi.hoiLotChuot) {
        return 'Dạ lót chuột xịn sò lướt siêu êm, chống trượt cực đỉnh đây Bạn ơi! Em lên ngay mấy tấm pad đỉnh chóp cho Bạn lựa nè 🖱️✨';
    }
    if (tieuChi.hoiChuot) {
        return 'Dạ chuột chiến game vẩy tâm bao bén hay chuột công thái học êm ru đây Bạn ơi! Em lên ngay mấy em chuột đỉnh chóp cho Bạn quẹo lựa nè 🖱️✨';
    }
    if (tieuChi.hoiSac) {
        return 'Dạ củ sạc GaN siêu nhỏ gọn mà công suất khủng, sạc vèo cái là đầy bình cả laptop lẫn điện thoại luôn Bạn nha ⚡🔋';
    }
    if (tieuChi.hoiBanPhim) {
        return 'Dạ phím cơ gõ tanh tách cực sướng tai hay gõ êm văn phòng đều có sẵn đây Bạn ơi! Gõ phím là thấy năng lượng dạt dào rồi nè ⌨️🎵';
    }
    if (tieuChi.hoiTaiNghe) {
        return 'Dạ tai nghe âm thanh vòm sống động, nghe tiếng bước chân địch rõ mồn một hay chill nhạc cực phê đây Bạn ơi 🎧🎶';
    }
    if (tieuChi.hoiBalo) {
        return 'Dạ balo chống sốc chống nước xịn sò, bảo vệ máy cưng an toàn tuyệt đối trên mọi nẻo đường đây Bạn ơi 🎒🛡️';
    }
    if (tieuChi.hoiTanNhiet) {
        return 'Dạ giải nhiệt cấp tốc cho cỗ máy chiến game mát rượi như ở Bắc Cực đây Bạn ơi, tha hồ cày cuốc không lo drop fps ❄️💨';
    }
    if (tieuChi.danhMuc === 'gaming') {
        return 'Dạ cỗ máy chiến game max setting mát rượi, gánh team bao mượt không lo tụt fps đây ạ! Mời Bạn nghía qua mấy con quái vật đồ họa này nè 🎮🔥';
    }
    if (tieuChi.danhMuc === 'van-phong' || tieuChi.danhMuc === 'mong-nhe') {
        return 'Dạ máy mỏng nhẹ pin trâu, mang đi cafe hay giảng đường là chuẩn gu luôn Bạn ơi! Chạy deadline cứ gọi là phà phà 💻✨';
    }
    return 'Dạ em chào Bạn nè! Em đang túc trực 24/7 đây, hôm nay Bạn muốn tìm chiến mã laptop hay săn phụ kiện xịn sò gì cứ để em lo nha 🚀✨';
}

/**
 * Tạo danh sách gợi ý câu hỏi tiếp theo bám sát chủ đề khách vừa hỏi
 */
function taoGoiYTiepTheoMacDinh(tieuChi = {}) {
    if (tieuChi.hoiChuot) {
        return [
            'Chuột này kết nối không dây có bị trễ không?',
            'Có được tặng kèm lót chuột không shop?',
            'Chuột này bảo hành chính hãng bao lâu?'
        ];
    }
    if (tieuChi.hoiLotChuot) {
        return [
            'Lót chuột này có chống nước và bám bàn tốt không?',
            'Có mẫu lót chuột có đèn LED viền RGB không shop?',
            'Kích thước lót chuột để vừa cả phím lẫn chuột không?'
        ];
    }
    if (tieuChi.hoiSac) {
        return [
            'Củ sạc này sạc cùng lúc được mấy thiết bị?',
            'Có hỗ trợ sạc nhanh cho MacBook và iPhone không?',
            'Shop có giao hàng hỏa tốc trong ngày không?'
        ];
    }
    if (tieuChi.hoiBanPhim) {
        return [
            'Bàn phím này gõ êm hay gõ đanh sướng tai?',
            'Có kết nối được cả Bluetooth lẫn Type-C không?',
            'Bàn phím có đèn LED RGB đổi màu được không?'
        ];
    }
    if (tieuChi.hoiTaiNghe) {
        return [
            'Tai nghe này pin dùng được bao nhiêu tiếng?',
            'Có mic đàm thoại chống ồn rõ không shop?',
            'Đeo lâu có bị đau tai hay cấn không shop?'
        ];
    }
    if (tieuChi.hoiBalo) {
        return [
            'Balo này đựng vừa laptop bao nhiêu inch vậy shop?',
            'Vải balo có kháng nước đi mưa tốt không?',
            'Có ngăn chống sốc riêng cho laptop không?'
        ];
    }
    if (tieuChi.hoiTanNhiet) {
        return [
            'Đế tản nhiệt này quạt quay có ồn không shop?',
            'Có chỉnh được tốc độ gió và độ cao không?',
            'Dùng cho laptop 15.6 đến 17 inch vừa không?'
        ];
    }
    if (tieuChi.danhMuc === 'gaming') {
        return [
            'Máy này chiến mượt Black Myth Wukong và CS2 không?',
            'Shop có hỗ trợ trả góp 0% qua thẻ không?',
            'Mua máy có được tặng kèm balo và chuột gaming không?'
        ];
    }
    return [
        'Shop có hỗ trợ trả góp 0% lãi suất không?',
        'Chính sách bảo hành và đổi trả thế nào?',
        'Showroom có máy sẵn để em qua trải nghiệm không?'
    ];
}

/**
 * Xử lý cuộc hội thoại chat giữa khách hàng và Trợ lý AI
 * @param {Object} param
 * @param {string} param.tinNhan - Câu hỏi của khách hàng
 * @param {Array}  [param.lichSuChat] - Lịch sử đoạn chat trước đó
 * @returns {Promise<Object>} Câu trả lời, danh sách sản phẩm đính kèm và câu hỏi gợi ý
 */
async function xuLyTroLyChat({ tinNhan, lichSuChat = [] }) {
    if (!tinNhan || !tinNhan.trim()) {
        throw new Error('Tin nhắn không được để trống.');
    }

    // 1. Phân tích ý định & tìm kiếm sản phẩm thực tế trong Database phù hợp với nhu cầu khách
    const tieuChi = phanTichYDinhCauHoi(tinNhan);
    const danhSachSanPhamThucTe = await timKiemSanPhamPhuHop(tinNhan, 5);
    const nguCanhSanPham = dinhDangNguCanhSanPham(danhSachSanPhamThucTe);

    // 2. Xây dựng System Prompt tối ưu: THÂN THIỆN - HÀI HƯỚC DUYÊN DÁNG - BÁM SÁT CÂU HỎI
    const systemPrompt = `Bạn là Trợ lý AI Bán hàng siêu dễ thương, vui tính, hài hước duyên dáng ("hài hài", mặn mòi, dí dỏm) và am hiểu công nghệ của Hệ thống TNTP LAPTOP (Laptop New).

DANH SÁCH MÃ SẢN PHẨM & PHỤ KIỆN THỰC TẾ TRONG KHO SHOWROOM:
${nguCanhSanPham}

PHONG CÁCH GIAO TIẾP VÀ TÍNH CÁCH (CỰC KỲ QUAN TRỌNG):
- Thân thiện, tươi vui, dí dỏm, pha chút hài hước duyên dáng ("hài hài"), mặn mà, nói chuyện như một người bạn sành công nghệ tư vấn cho khách.
- Xưng hô dễ thương: "Dạ em...", "Bạn ơi...", "Bác ơi...", "Người đẹp ơi..." tuỳ ngữ cảnh, dùng emoji sinh động và hợp vibe (🖱️🎮🔥⚡💻✨🎧).
- BÁM SÁT 100% VÀO CÂU HỎI CỦA KHÁCH: Khách hỏi món gì thì trả lời trúng phóc món đó kèm 1 nhận xét dí dỏm/hài hước về món đó hoặc khen gu chọn đồ của khách. TUYỆT ĐỐI KHÔNG dùng văn mẫu chào hỏi công nghiệp chung chung lặp đi lặp lại!
- VÍ DỤ VIBE TRẢ LỜI CỰC CHUẨN:
  + Khách hỏi "chuột": "Dạ chuột chiến game vẩy tâm bao bén hay chuột công thái học êm ru đây Bạn ơi! Em lên ngay mấy 'em chuột' đỉnh chóp cho Bạn quẹo lựa nè, bấm là sướng tay 🖱️✨"
  + Khách hỏi "sạc" / "củ sạc": "Dạ củ sạc GaN siêu nhỏ gọn mà công suất khủng, sạc vèo cái là đầy bình cả laptop lẫn điện thoại luôn Bạn nha, tha hồ vi vu không lo cạn nguồn ⚡🔋"
  + Khách hỏi "laptop gaming": "Dạ cỗ máy chiến game max setting mát rượi, gánh team bao mượt không lo tụt fps đây ạ! Mời Bạn 'nghía' qua mấy con quái vật đồ họa này nè 🎮🔥"
  + Khách hỏi "laptop mỏng nhẹ" / "văn phòng": "Dạ máy mỏng nhẹ pin trâu, mang đi cafe hay giảng đường là chuẩn gu luôn Bạn ơi! Vừa đẹp vừa mượt để Bạn chạy deadline phà phà 💻✨"
  + Khách hỏi "bàn phím": "Dạ phím gõ nảy tanh tách bao sướng tai hay gõ êm văn phòng đều có sẵn đây Bạn ơi! Gõ phím này thì cảm hứng ngút ngàn luôn nè ⌨️🎵"
  + Khách hỏi "tai nghe": "Dạ tai nghe âm thanh vòm sống động, nghe tiếng bước chân địch rõ mồn một hay chill nhạc cực phê đây Bạn ơi 🎧🎶"
  + Khách hỏi "balo": "Dạ balo chống sốc chống nước chuẩn quân đội, bảo vệ 'bé cưng' laptop an toàn trên mọi nẻo đường đây Bạn ơi 🎒🛡️"
  + Khách hỏi "tản nhiệt": "Dạ giải nhiệt cấp tốc cho cỗ máy chiến game mát rượi như ở Bắc Cực đây Bạn ơi, tha hồ cày cuốc không lo drop fps ❄️💨"
  + Khách chỉ "chào shop" / "hi": "Dạ em chào Bạn nè! Em đang túc trực 24/7 đây, hôm nay Bạn muốn tìm 'chiến mã' laptop hay săn phụ kiện xịn sò gì cứ để em lo nha 🚀✨"

QUY TẮC BẮT BUỘC:
1. ĐỘ DÀI: Câu trả lời ("cau_tra_loi") PHẢI CỰC KỲ GỌN GÀNG (1 ĐẾN 2 CÂU, TỐI ĐA 40 TỪ). Không dài dòng lê thê!
2. TUYỆT ĐỐI CẤM LIỆT KÊ TEXT: Không bao giờ gõ danh sách sản phẩm hay gạch đầu dòng trong "cau_tra_loi" (Không gõ: "* Món 1...", "* Món 2...").
3. TỰ ĐỘNG GẮN CARD SẢN PHẨM: Mọi sản phẩm hoặc phụ kiện bạn muốn giới thiệu cho khách BẮT BUỘC PHẢI ĐƯA ID VÀO MẢNG "id_san_pham_phu_hop" (chọn từ 2 đến 4 ID từ danh sách bên trên). Hệ thống sẽ tự động vẽ thành các Thẻ Sản Phẩm (Cards) có ảnh, thông số và nút mua cho khách!
4. GỢI Ý TIẾP THEO ("goi_y_tiep_theo"): Đưa ra 3 câu hỏi gợi ý ngắn gọn, thú vị và bám sát chính xác chủ đề món đồ khách vừa hỏi.
5. CHUẨN JSON: Tuyệt đối không dùng dấu ngoặc kép (") bên trong văn bản "cau_tra_loi" để tránh lỗi JSON, nếu cần trích dẫn hãy dùng dấu nháy đơn (') như 'chiến mã', 'em chuột'.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC (DUY NHẤT 1 KHỐI JSON HỢP LỆ):
{
  "cau_tra_loi": "Câu trả lời dí dỏm, hài hước nhẹ bám sát câu hỏi (1-2 câu, dưới 40 từ)",
  "id_san_pham_phu_hop": ["id_sp_1", "id_sp_2"],
  "goi_y_tiep_theo": ["Gợi ý 1 liên quan món vừa hỏi", "Gợi ý 2 liên quan món vừa hỏi", "Gợi ý 3 liên quan món vừa hỏi"]
}`;

    let cauTraLoiCuoiCung = '';
    let danhSachIdGoiY = [];
    let goiYTiepTheo = taoGoiYTiepTheoMacDinh(tieuChi);

    try {
        const phanHoiText = await goiGeminiXoayKey({
            systemPrompt,
            userPrompt: `CÂU HỎI CỦA KHÁCH HÀNG: "${tinNhan}"`,
            lichSuChat,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
                responseMimeType: 'application/json'
            }
        });

        const duLieuJson = bocTachJsonTuAi(phanHoiText);

        if (duLieuJson && duLieuJson.cau_tra_loi) {
            cauTraLoiCuoiCung = duLieuJson.cau_tra_loi.trim();
            if (Array.isArray(duLieuJson.id_san_pham_phu_hop)) {
                danhSachIdGoiY = duLieuJson.id_san_pham_phu_hop;
            }
            if (Array.isArray(duLieuJson.goi_y_tiep_theo) && duLieuJson.goi_y_tiep_theo.length > 0) {
                goiYTiepTheo = duLieuJson.goi_y_tiep_theo;
            }
        } else {
            cauTraLoiCuoiCung = taoCauPhanHoiFallback(tieuChi);
        }
    } catch (loiAi) {
        console.error('❌ [Trợ lý AI Service] Lỗi gọi Gemini:', loiAi.message);
        cauTraLoiCuoiCung = taoCauPhanHoiFallback(tieuChi);
        danhSachIdGoiY = danhSachSanPhamThucTe.slice(0, 3).map(sp => sp.id || sp.slug);
    }

    // Kết nối lại dữ liệu sản phẩm đầy đủ để Frontend hiển thị Thẻ Sản Phẩm (Product Card)
    let sanPhamGoiYChiTiet = [];

    if (danhSachIdGoiY.length > 0) {
        sanPhamGoiYChiTiet = danhSachSanPhamThucTe.filter(sp => {
            const spId = String(sp.id || '').toLowerCase();
            const spSlug = String(sp.slug || '').toLowerCase();
            const spOid = String(sp._id || '').toLowerCase();
            return danhSachIdGoiY.some(id => {
                const target = String(id).toLowerCase();
                return spId === target || spSlug === target || spOid === target;
            });
        });
    }

    // Nếu không lọc được ID nào, luôn lấy 2-3 sản phẩm phù hợp nhất để KHÁCH LUÔN THẤY CARD SẢN PHẨM CÓ NÚT MUA NGAY
    if (sanPhamGoiYChiTiet.length === 0 && danhSachSanPhamThucTe.length > 0) {
        sanPhamGoiYChiTiet = danhSachSanPhamThucTe.slice(0, 3);
    }

    // Chuẩn hóa dữ liệu trả về cho Frontend
    const sanPhamCards = sanPhamGoiYChiTiet.map(sp => ({
        id: sp.id || sp.slug,
        slug: sp.slug || sp.id,
        ten_san_pham: sp.ten_san_pham,
        hang_san_xuat: sp.hang_san_xuat,
        gia_goc: sp.gia_goc || 0,
        gia_khuyen_mai: sp.gia_khuyen_mai || 0,
        phan_tram_giam_gia: sp.phan_tram_giam_gia || 0,
        hinh_anh_chinh: sp.hinh_anh_chinh || '/images/sp/macbook_pro_16_m3max.jpg',
        thong_so: {
            cpu: sp.thong_so?.cpu || '',
            ram: sp.thong_so?.ram || '',
            card_do_hoa: sp.thong_so?.card_do_hoa || '',
            o_cung: sp.thong_so?.o_cung || ''
        },
        qua_tang: sp.qua_tang || [],
        con_hang: sp.con_hang !== false,
        ho_tro_tra_gop_0_phan_tram: sp.ho_tro_tra_gop_0_phan_tram !== false
    }));

    return {
        cau_tra_loi: cauTraLoiCuoiCung,
        san_pham_goi_y: sanPhamCards,
        goi_y_tiep_theo: goiYTiepTheo
    };
}

module.exports = {
    xuLyTroLyChat
};
