/**
 * Chú thích file: Dịch vụ gọi Google Gemini AI Studio với cơ chế xoay API Key tự động.
 * Tham chiếu giải pháp từ C:\laragon\www\LeMinhTri_501240045:
 * - Tự động thử các cặp Model + API Key theo độ ưu tiên.
 * - Bắt lỗi 429 (hết quota/rate limit) -> Cooldown 5 phút và chuyển sang key kế tiếp ngay.
 * - Bắt lỗi 403 (key không hợp lệ) -> Cooldown 6 giờ.
 * - Bắt lỗi mạng / 500 / 503 -> Cooldown 30 giây.
 * - Ghi nhớ cặp key đang chạy tốt (preferred) để tối ưu độ trễ.
 */

const crypto = require('crypto');
const cauHinhGemini = require('../config/gemini.config');

// Bộ nhớ theo dõi trạng thái sức khỏe của các cặp (Model : Key)
const bangTheoDoiSucKhoe = {
    thoiGianNghi: {}, // { [pairId]: { hetHanLuc: timestamp, lyDo: string } }
    capUuTien: null,  // pairId hoạt động thành công gần nhất
    thoiGianCapNhat: Date.now()
};

/**
 * Băm key để bảo vệ thông tin nhạy cảm khi hiển thị log hoặc lưu cache
 */
function bamMaKey(key) {
    if (!key) return 'unknown';
    return crypto.createHash('sha256').update(key).digest('hex').substring(0, 12);
}

/**
 * Xáo trộn ngẫu nhiên mảng (Fisher-Yates shuffle)
 */
function xaoTronMang(mang) {
    const ketQua = [...mang];
    for (let i = ketQua.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ketQua[i], ketQua[j]] = [ketQua[j], ketQua[i]];
    }
    return ketQua;
}

/**
 * Tạo danh sách các ứng viên (Model + Key) sắp xếp theo độ ưu tiên và tình trạng sẵn sàng
 */
function layDanhSachUngVien() {
    const keys = cauHinhGemini.apiKeys;
    const models = cauHinhGemini.danhSachModelUuTien;

    if (!keys || keys.length === 0) {
        throw new Error('Chưa cấu hình GEMINI_API_KEYS trong file .env');
    }

    const bayGio = Date.now();
    const danhSachKeysNgauNhien = xaoTronMang(keys);
    const ungVien = [];

    models.forEach((model, chiSoModel) => {
        danhSachKeysNgauNhien.forEach((key) => {
            const keyId = bamMaKey(key);
            const pairId = `${model}:${keyId}`;
            const thongTinNghi = bangTheoDoiSucKhoe.thoiGianNghi[pairId];

            // Nếu đang trong thời gian cooldown thì bỏ qua
            if (thongTinNghi && thongTinNghi.hetHanLuc > bayGio) {
                return;
            }

            // Tính điểm ưu tiên: Model càng cao điểm càng thấp (ưu tiên chạy trước)
            let diem = chiSoModel * 100;
            if (bangTheoDoiSucKhoe.capUuTien === pairId) {
                diem -= 40; // Cặp đang chạy ngon được ưu tiên số 1
            }
            diem += Math.floor(Math.random() * 20); // Một chút ngẫu nhiên để chia tải

            ungVien.push({
                model,
                key,
                pairId,
                keyId,
                diem
            });
        });
    });

    // Sắp xếp tăng dần theo điểm
    ungVien.sort((a, b) => a.diem - b.diem);
    return ungVien;
}

/**
 * Gửi nội dung lên Google Gemini AI Studio kèm cơ chế xoay key thông minh
 * @param {Object} thamSo
 * @param {string} thamSo.systemPrompt - Lời nhắc hệ thống định hướng vai trò
 * @param {string} thamSo.userPrompt - Câu hỏi của khách hàng
 * @param {Array}  [thamSo.lichSuChat] - Lịch sử hội thoại trước đó (nếu có)
 * @param {Object} [thamSo.generationConfig] - Cấu hình sinh nội dung tùy chỉnh
 * @returns {Promise<string>} Nội dung phản hồi dạng text từ AI
 */
async function goiGeminiXoayKey({ systemPrompt, userPrompt, lichSuChat = [], generationConfig = {} }) {
    let ungVien = layDanhSachUngVien();

    // Nếu tất cả đều đang cooldown, mở khóa tạm thời các cặp để cứu hộ
    if (ungVien.length === 0) {
        console.warn('⚠️ [Gemini AI] Tất cả API key đang trong thời gian nghỉ. Đang giải phóng bộ nhớ để thử lại khẩn cấp...');
        bangTheoDoiSucKhoe.thoiGianNghi = {};
        ungVien = layDanhSachUngVien();
    }

    if (ungVien.length === 0) {
        throw new Error('Không có API key Gemini nào khả dụng.');
    }

    // Chuẩn bị contents chuẩn định dạng Gemini API
    const contents = [];

    // Nạp lịch sử chat nếu có
    if (Array.isArray(lichSuChat) && lichSuChat.length > 0) {
        lichSuChat.forEach(msg => {
            const role = msg.role === 'model' || msg.role === 'assistant' ? 'model' : 'user';
            const text = msg.content || msg.text || '';
            if (text.trim()) {
                contents.push({
                    role,
                    parts: [{ text }]
                });
            }
        });
    }

    // Ghép câu hỏi mới của người dùng
    contents.push({
        role: 'user',
        parts: [{ text: userPrompt }]
    });

    // Cấu hình sinh nội dung kết hợp mặc định
    const finalConfig = {
        ...cauHinhGemini.cauHinhMacDinh,
        ...generationConfig
    };

    // Body payload gửi lên Gemini
    const payload = {
        contents,
        generationConfig: finalConfig
    };

    // Bổ sung system instruction nếu có
    if (systemPrompt && systemPrompt.trim()) {
        payload.systemInstruction = {
            parts: [{ text: systemPrompt }]
        };
    }

    let loiCuoiCung = null;

    // Vòng lặp xoay key qua từng ứng viên
    for (let i = 0; i < ungVien.length; i++) {
        const u = ungVien[i];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${u.model}:generateContent?key=${u.key}`;

        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 18000); // 18s timeout

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: abortController.signal
            });
            clearTimeout(timeoutId);

            const bayGio = Date.now();

            if (res.status === 200) {
                const data = await res.json();
                const phanHoiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

                if (phanHoiText && phanHoiText.trim().length > 0) {
                    // Thành công: Xóa trạng thái nghỉ, đánh dấu cặp ưu tiên
                    delete bangTheoDoiSucKhoe.thoiGianNghi[u.pairId];
                    bangTheoDoiSucKhoe.capUuTien = u.pairId;
                    bangTheoDoiSucKhoe.thoiGianCapNhat = bayGio;

                    return phanHoiText;
                }

                // Status 200 nhưng payload rỗng -> Cooldown ngắn 45s và thử cặp khác
                bangTheoDoiSucKhoe.thoiGianNghi[u.pairId] = {
                    hetHanLuc: bayGio + 45000,
                    lyDo: 'Phản hồi rỗng hoặc nội dung bị lọc'
                };
                console.warn(`⚠️ [Gemini AI] Cặp ${u.model} (Key #${u.keyId}) trả về rỗng. Đang chuyển sang ứng viên tiếp theo...`);
            } else {
                const errorData = await res.json().catch(() => ({}));
                const thongBaoLoi = errorData?.error?.message || `HTTP ${res.status}`;
                const bayGio = Date.now();

                if (res.status === 429) {
                    // Hết Token / Quota Rate Limit: Nghỉ 5 phút (300 giây)
                    bangTheoDoiSucKhoe.thoiGianNghi[u.pairId] = {
                        hetHanLuc: bayGio + 300000,
                        lyDo: '429 Quota Exceeded'
                    };
                    console.warn(`⚠️ [Gemini AI - Xoay Key] Key #${u.keyId} (${u.model}) chạm hạn ngạch (429 Quota). Tạm dừng 5 phút, tự động chuyển key tiếp theo...`);
                } else if (res.status === 403) {
                    // Key hết hạn hoặc sai quyền: Nghỉ 6 tiếng
                    bangTheoDoiSucKhoe.thoiGianNghi[u.pairId] = {
                        hetHanLuc: bayGio + 21600000,
                        lyDo: '403 Forbidden / Invalid Key'
                    };
                    console.error(`❌ [Gemini AI - Xoay Key] Key #${u.keyId} bị từ chối (403 Forbidden: ${thongBaoLoi}). Nghỉ 6h, chuyển sang key khác...`);
                } else {
                    // Lỗi 500, 503, Gateway: Nghỉ ngắn 30s
                    bangTheoDoiSucKhoe.thoiGianNghi[u.pairId] = {
                        hetHanLuc: bayGio + 30000,
                        lyDo: `HTTP ${res.status}: ${thongBaoLoi}`
                    };
                    console.warn(`⚠️ [Gemini AI - Xoay Key] Cặp ${u.model} (Key #${u.keyId}) lỗi ${res.status}. Đang chuyển sang ứng viên tiếp theo...`);
                }

                loiCuoiCung = new Error(`Lỗi Gemini [${res.status}]: ${thongBaoLoi}`);
            }
        } catch (error) {
            clearTimeout(timeoutId);
            const bayGio = Date.now();
            bangTheoDoiSucKhoe.thoiGianNghi[u.pairId] = {
                hetHanLuc: bayGio + 30000,
                lyDo: error.name === 'AbortError' ? 'Timeout 18s' : error.message
            };
            console.warn(`⚠️ [Gemini AI - Xoay Key] Kết nối tới ${u.model} (Key #${u.keyId}) gián đoạn (${error.message}). Thử ứng viên kế tiếp...`);
            loiCuoiCung = error;
        }
    }

    // Nếu đã thử tất cả các key/model mà đều thất bại
    throw (loiCuoiCung || new Error('Không thể kết nối đến bất kỳ mô hình Gemini AI nào khả dụng.'));
}

/**
 * Kiểm tra trạng thái hoạt động của danh sách key (dùng cho endpoint giám sát / trang-thai)
 */
function layTrangThaiKeyHienTai() {
    const bayGio = Date.now();
    const tongSoKeys = cauHinhGemini.apiKeys.length;
    const danhSachChiTiet = cauHinhGemini.apiKeys.map(k => {
        const keyId = bamMaKey(k);
        const dangNghi = Object.entries(bangTheoDoiSucKhoe.thoiGianNghi)
            .filter(([pId, info]) => pId.includes(keyId) && info.hetHanLuc > bayGio)
            .map(([pId, info]) => ({
                pairId: pId,
                giayConLai: Math.ceil((info.hetHanLuc - bayGio) / 1000),
                lyDo: info.lyDo
            }));

        return {
            keyId: `****${keyId}`,
            trangThai: dangNghi.length === 0 ? 'san_sang' : 'tam_nghi',
            chiTietNghi: dangNghi
        };
    });

    return {
        tongSoKeys,
        capUuTien: bangTheoDoiSucKhoe.capUuTien,
        danhSachModel: cauHinhGemini.danhSachModelUuTien,
        chiTietKeys: danhSachChiTiet
    };
}

module.exports = {
    goiGeminiXoayKey,
    layTrangThaiKeyHienTai
};
