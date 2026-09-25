/**
 * Chú thích file: Dịch vụ Trợ lý AI Bán hàng Chuyên nghiệp (Laptop New Assistant).
 * Câu trả lời cực kỳ ngắn gọn, súc tích (1-3 câu), tự động nhúng Product Cards có nút Mua ngay.
 */

const { goiGeminiXoayKey } = require('./gemini-xoay-key.service');
const { goiNineRouter, layCauHinhNineRouter } = require('./nine-router.service');
const { timKiemSanPhamPhuHop, dinhDangNguCanhSanPham, phanTichYDinhCauHoi } = require('./tim-kiem-san-pham-ai.service');

/**
 * Trích xuất an toàn JSON từ kết quả trả về của Gemini, tự động sửa lỗi escape phổ biến
 */
function bocTachJsonTuAi(vanBan) {
    if (!vanBan || typeof vanBan !== 'string') return null;

    let textClean = vanBan.trim()
        .replace(/^```(?:json)?/gim, '')
        .replace(/```$/gim, '')
        .trim();

    // 1. Thử parse trực tiếp
    try {
        return JSON.parse(textClean);
    } catch {}

    // 2. Tìm và parse khối JSON {...}
    const matchKhoiJson = textClean.match(/\{[\s\S]*\}/);
    if (matchKhoiJson) {
        try {
            return JSON.parse(matchKhoiJson[0]);
        } catch {}

        try {
            const textFixed = matchKhoiJson[0].replace(/\\([^"\\\/bfnrtu])/g, '$1');
            return JSON.parse(textFixed);
        } catch {}
    }

    // 3. Fallback bóc tách bằng Regex nếu JSON bị lỗi cú pháp nhỏ
    try {
        let cauTraLoi = '';
        let idSanPham = [];
        let goiY = [];

        const matchCauTraLoi = textClean.match(/"cau_tra_loi"\s*:\s*"([\s\S]*?)"\s*,\s*"(?:id_san_pham_phu_hop|goi_y_tiep_theo)/);
        if (matchCauTraLoi) {
            cauTraLoi = matchCauTraLoi[1];
        } else {
            const matchCauTraLoiDon = textClean.match(/"cau_tra_loi"\s*:\s*"([\s\S]*?)"\s*[\},]/);
            if (matchCauTraLoiDon) {
                cauTraLoi = matchCauTraLoiDon[1];
            }
        }

        if (cauTraLoi) {
            cauTraLoi = cauTraLoi
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
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
    return 'Dạ em chào Bạn ạ! Em là Trợ lý AI TNTP Laptop, luôn túc trực 24/7 để đồng hành cùng Bạn. Hôm nay Bạn muốn tìm chiếc laptop ưng ý hay săn phụ kiện xịn sò gì cứ nhắn em nhé! 🚀✨';
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
    const batDauTraCuu = Date.now();
    const danhSachSanPhamThucTe = await timKiemSanPhamPhuHop(tinNhan, 5);
    const thoiGianTraCuu = Date.now() - batDauTraCuu;
    const nguCanhSanPham = dinhDangNguCanhSanPham(danhSachSanPhamThucTe);

    // 2. Xây dựng System Prompt tối ưu: LỊCH THIỆP - VUI TÍNH - KHÔNG CỘC LỐC - TRỌN VẸN CÂU
    const systemPrompt = `Bạn là Trợ lý AI Bán hàng cao cấp, siêu dễ thương, vui tính, hài hước duyên dáng và am hiểu sâu sắc về công nghệ của Hệ thống TNTP LAPTOP (Laptop New).

DANH SÁCH MÃ SẢN PHẨM & PHỤ KIỆN THỰC TẾ TRONG KHO SHOWROOM:
${nguCanhSanPham}

PHONG CÁCH GIAO TIẾP VÀ TÍNH CÁCH (CỰC KỲ QUAN TRỌNG):
- Thân thiện, niềm nở, lịch thiệp, chu đáo ("Dạ em...", "...ạ", "...nha Bạn/anh/chị").
- Khi khách giới thiệu tên (ví dụ: "tôi tên trí", "mình là Trí", "anh là Trí"):
  + BẮT BUỘC chào mừng niềm nở và gọi đúng tên của khách: "Dạ em chào anh Trí ạ! Rất hân hạnh được hỗ trợ anh hôm nay. Hôm nay anh Trí đang muốn tìm một mẫu laptop phục vụ công việc, đồ họa, chiến game hay cần em tư vấn món phụ kiện xịn sò nào cho góc làm việc của mình không ạ? ✨💻"
- BÁM SÁT 100% VÀO CÂU HỎI CỦA KHÁCH: Khách hỏi món gì thì trả lời trúng phóc món đó kèm 1 nhận xét dí dỏm/hài hước về món đó hoặc khen gu chọn đồ của khách.
  + Khách hỏi "chuột": "Dạ chuột chiến game vẩy tâm bao bén hay chuột công thái học êm ru đây Bạn ơi! Em lên ngay mấy 'em chuột' đỉnh chóp cho Bạn quẹo lựa nè, bấm cực kỳ êm tay và nhạy bén 🖱️✨"
  + Khách hỏi "sạc" / "củ sạc": "Dạ củ sạc GaN siêu nhỏ gọn mà công suất khủng, sạc vèo cái là đầy bình cả laptop lẫn điện thoại luôn Bạn nha, tha hồ vi vu cả ngày không lo cạn nguồn ⚡🔋"
  + Khách hỏi "laptop gaming": "Dạ cỗ máy chiến game max setting mát rượi, gánh team bao mượt không lo tụt fps đây ạ! Mời Bạn 'nghía' qua mấy con quái vật đồ họa này nè 🎮🔥"
  + Khách hỏi "laptop mỏng nhẹ" / "văn phòng": "Dạ máy mỏng nhẹ pin trâu, mang đi cafe hay giảng đường là chuẩn gu luôn Bạn ơi! Vừa đẹp vừa mượt để Bạn chạy deadline phà phà 💻✨"
  + Khách hỏi "bàn phím": "Dạ phím gõ nảy tanh tách bao sướng tai hay gõ êm văn phòng đều có sẵn đây Bạn ơi! Gõ phím này thì cảm hứng ngút ngàn luôn nè ⌨️🎵"
  + Khách hỏi "tai nghe": "Dạ tai nghe âm thanh vòm sống động, nghe tiếng bước chân địch rõ mồn một hay chill nhạc cực phê đây Bạn ơi 🎧🎶"
  + Khách hỏi "balo": "Dạ balo chống sốc chống nước chuẩn quân đội, bảo vệ 'bé cưng' laptop an toàn trên mọi nẻo đường đây Bạn ơi 🎒🛡️"
  + Khách chỉ "chào shop" / "hi": "Dạ em chào Bạn ạ! Em là Trợ lý AI của TNTP Laptop, luôn túc trực 24/7 để đồng hành cùng Bạn. Hôm nay Bạn muốn tìm 'chiến mã' laptop hay săn phụ kiện xịn sò gì cứ để em lo nha 🚀✨"

QUY TẮC BẮT BUỘC:
1. ĐỘ DÀI & ĐẦY ĐỦ Ý: Câu trả lời ("cau_tra_loi") gồm 2 ĐẾN 3 CÂU HOÀN CHỈNH, tự nhiên, duyên dáng và ấm áp.
2. TUYỆT ĐỐI KHÔNG CỘC LỐC, KHÔNG CỤT NGỦN: Luôn có lời chào/dạ thưa lịch thiệp, diễn đạt trọn vẹn và kết thúc bằng câu hỏi mở hoặc lời mời xem đồ.
3. TUYỆT ĐỐI KHÔNG NGẮT CÂU LỬNG LƠ GIỮA CHỪNG: Viết câu trọn vẹn chủ ngữ - vị ngữ, không để dở dang chữ hay số.
4. TUYỆT ĐỐI CẤM LIỆT KÊ TEXT: Không bao giờ gõ danh sách sản phẩm hay gạch đầu dòng trong "cau_tra_loi" (Không gõ: "* Món 1...", "* Món 2...").
5. ĐÍNH KÈM THẺ SẢN PHẨM ("id_san_pham_phu_hop"):
   - Khi khách CHỈ CHÀO HỎI, XÃ GIAO, GIỚI THIỆU TÊN, HOẶC HỎI THÔNG TIN CHUNG (như "hi", "hi pro", "tôi tên trí", "shop ở đâu", "chào em"):
     -> BẮT BUỘC ĐỂ MẢNG "id_san_pham_phu_hop": [] (MẢNG RỖNG). Tuyệt đối KHÔNG tự ý gợi ý sản phẩm khi khách chưa hỏi mua.
   - CHỈ KHI khách hỏi mua, tìm kiếm, tư vấn cấu hình, máy móc, phụ kiện cụ thể:
     -> Mới chọn 2-3 ID từ danh sách kho hàng bên trên đưa vào mảng "id_san_pham_phu_hop" để hệ thống vẽ thẻ sản phẩm.
6. GỢI Ý TIẾP THEO ("goi_y_tiep_theo"): Đưa ra 3 câu hỏi gợi ý ngắn gọn, thú vị và bám sát chính xác chủ đề hoặc nhu cầu khách có thể hỏi tiếp.
7. CHUẨN JSON: Tuyệt đối không dùng dấu ngoặc kép (") bên trong văn bản "cau_tra_loi", nếu cần trích dẫn hãy dùng dấu nháy đơn (') như 'chiến mã', 'em chuột'.

ĐỊNH DẠNG ĐẦU RA BẮT BUỘC (DUY NHẤT 1 KHỐI JSON HỢP LỆ):
{
  "cau_tra_loi": "Câu trả lời lịch thiệp, duyên dáng, trọn vẹn ý (2-3 câu hoàn chỉnh, không cộc lốc, không ngắt lửng lơ)",
  "id_san_pham_phu_hop": [],
  "goi_y_tiep_theo": ["Gợi ý 1", "Gợi ý 2", "Gợi ý 3"]
}`;

    let cauTraLoiCuoiCung = '';
    let danhSachIdGoiY = [];
    let goiYTiepTheo = taoGoiYTiepTheoMacDinh(tieuChi);

    try {
        const yeuCauAi = {
            systemPrompt,
            userPrompt: `CÂU HỎI CỦA KHÁCH HÀNG: "${tinNhan}"`,
            lichSuChat,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
                responseMimeType: 'application/json'
            }
        };
        let phanHoiText;
        let nhaCungCap = 'Gemini';
        let batDauGoiAi = Date.now();
        if (layCauHinhNineRouter().apiKey) {
            try {
                phanHoiText = await goiNineRouter(yeuCauAi);
                if (!bocTachJsonTuAi(phanHoiText)?.cau_tra_loi) {
                    throw new Error('9Router trả về sai định dạng phản hồi chatbot');
                }
                nhaCungCap = '9Router';
            } catch (loiRouter) {
                console.warn(`[Trợ lý AI] 9Router lỗi sau ${Date.now() - batDauGoiAi}ms (${loiRouter.message}); thử Gemini.`);
                batDauGoiAi = Date.now();
                phanHoiText = await goiGeminiXoayKey(yeuCauAi);
            }
        } else {
            phanHoiText = await goiGeminiXoayKey(yeuCauAi);
        }
        console.info(`[Trợ lý AI] tra_cuu=${thoiGianTraCuu}ms ai=${Date.now() - batDauGoiAi}ms provider=${nhaCungCap}`);

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
        console.error('❌ [Trợ lý AI Service] Lỗi gọi AI:', loiAi.message);
        cauTraLoiCuoiCung = taoCauPhanHoiFallback(tieuChi);
        danhSachIdGoiY = tieuChi.coNhuCauSanPham ? danhSachSanPhamThucTe.slice(0, 3).map(sp => sp.id || sp.slug) : [];
    }

    // Kết nối lại dữ liệu sản phẩm đầy đủ để Frontend hiển thị Thẻ Sản Phẩm (Product Card)
    let sanPhamGoiYChiTiet = [];

    if (danhSachIdGoiY.length > 0 && danhSachSanPhamThucTe.length > 0) {
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

    // Chỉ tự động bổ sung thẻ sản phẩm khi khách THỰC SỰ có nhu cầu tìm/mua sản phẩm mà AI chưa chọn kịp ID
    if (sanPhamGoiYChiTiet.length === 0 && tieuChi.coNhuCauSanPham && danhSachSanPhamThucTe.length > 0) {
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
