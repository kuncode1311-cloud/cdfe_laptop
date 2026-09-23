/**
 * Chú thích file: Dịch vụ phân tích ý định khách hàng và truy vấn sản phẩm phù hợp từ MongoDB / Cache.
 * Hỗ trợ toàn diện cả LAPTOP và LINH KIỆN / PHỤ KIỆN (Chuột, Bàn phím, Củ sạc, Tản nhiệt, Balo, SSD, RAM...).
 * Sắp xếp độ ưu tiên chuẩn xác: Hỏi chuột ra chuột thật trước lót chuột.
 */

const fs = require('fs');
const path = require('path');
const SanPham = require('../models/san-pham.model');

// Danh sách các thương hiệu phổ biến được chuẩn hóa
const DANH_SACH_HANG = ['asus', 'dell', 'hp', 'lenovo', 'acer', 'msi', 'apple', 'razer', 'logitech', 'anker', 'ugreen', 'samsung', 'kingston', 'tomtoc', 'moft'];

/**
 * Phân tích câu hỏi của khách hàng để trích xuất các tiêu chí lọc sản phẩm
 * @param {string} cauHoi 
 * @returns {Object} Tiêu chí trích xuất
 */
function phanTichYDinhCauHoi(cauHoi = '') {
    const text = cauHoi.toLowerCase().trim();
    const tieuChi = {
        hang: null,
        giaMin: null,
        giaMax: null,
        danhMuc: null,
        tuKhoa: [],
        laPhuKien: false,
        hoiChuot: false,
        hoiBanPhim: false,
        hoiSac: false,
        hoiTanNhiet: false,
        hoiBalo: false,
        hoiTaiNghe: false,
        hoiLinhKien: false
    };

    // 1. Nhận diện Hãng sản xuất
    for (const h of DANH_SACH_HANG) {
        if (text.includes(h) || (h === 'apple' && (text.includes('macbook') || text.includes('mac')))) {
            tieuChi.hang = h;
            break;
        }
    }

    // 2. Nhận diện chính xác loại Phụ kiện & Linh kiện
    if (/lót chuột|lot chuot|pad chuột|pad chuot|bàn di|ban di/i.test(text)) {
        tieuChi.danhMuc = 'chuot-lot-chuot';
        tieuChi.laPhuKien = true;
        tieuChi.hoiLotChuot = true;
    } else if (/chuột|chuot|mouse/i.test(text)) {
        tieuChi.danhMuc = 'chuot-lot-chuot';
        tieuChi.laPhuKien = true;
        tieuChi.hoiChuot = true;
    } else if (/bàn phím|ban phim|phím cơ|phim co|keyboard/i.test(text)) {
        tieuChi.danhMuc = 'ban-phim-co';
        tieuChi.laPhuKien = true;
        tieuChi.hoiBanPhim = true;
    } else if (/sạc|sac|củ sạc|cu sac|pin dự phòng|cáp|cap|hub|type-c|type c|anker|ugreen/i.test(text)) {
        tieuChi.danhMuc = 'sac-cap-hub';
        tieuChi.laPhuKien = true;
        tieuChi.hoiSac = true;
    } else if (/tản nhiệt|tan nhiet|keo tản nhiệt|keo tan nhiet|sò lạnh|so lanh|giá đỡ|gia do|đế tản nhiệt|stand/i.test(text)) {
        tieuChi.danhMuc = 'de-tan-gia-do';
        tieuChi.laPhuKien = true;
        tieuChi.hoiTanNhiet = true;
    } else if (/tai nghe|headphone|headset|loa/i.test(text)) {
        tieuChi.danhMuc = 'tai-nghe-loa';
        tieuChi.laPhuKien = true;
        tieuChi.hoiTaiNghe = true;
    } else if (/balo|túi chống sốc|tui chong soc|túi đựng|tomtoc|ranger/i.test(text)) {
        tieuChi.danhMuc = 'balo-tui-chong-soc';
        tieuChi.laPhuKien = true;
        tieuChi.hoiBalo = true;
    } else if (/ssd|ổ cứng|o cung|ram|nâng cấp|nang cap|nvme/i.test(text)) {
        tieuChi.danhMuc = 'linh-kien-nang-cap';
        tieuChi.laPhuKien = true;
        tieuChi.hoiLinhKien = true;
    } else if (/phụ kiện|phu kien|gear|đồ chơi|linh kiện/i.test(text)) {
        tieuChi.laPhuKien = true;
    }

    // 3. Nhận diện Danh mục Laptop nếu không hỏi phụ kiện
    if (!tieuChi.laPhuKien) {
        if (/gaming|chơi game|choi game|chiến game|chien game|game thủ|game thu|pubg|valorant|lol|fifa|gta|chiến|do hoa game/i.test(text)) {
            tieuChi.danhMuc = 'gaming';
        } else if (/đồ họa|do hoa|render|photoshop|premiere|autocad|blender|3d|dựng phim/i.test(text)) {
            tieuChi.danhMuc = 'do-hoa-sang-tao';
        } else if (/văn phòng|van phong|học tập|hoc tap|sinh viên|word|excel|kế toán/i.test(text)) {
            tieuChi.danhMuc = 'van-phong';
        } else if (/mỏng nhẹ|mong nhe|di chuyển|nhẹ|ultrabook/i.test(text)) {
            tieuChi.danhMuc = 'mong-nhe';
        } else if (/ai|npu|ai-pc|trí tuệ nhân tạo/i.test(text)) {
            tieuChi.danhMuc = 'ai-pc';
        }
    }

    // 4. Nhận diện Mức giá / Ngân sách
    const regexKhoangGia = /(?:từ|khoảng|tam|tầm)\s*(\d+)(?:\s*(?:đến|-|tới)\s*(\d+))?\s*(?:triệu|tr|củ|m|k|nghìn|ngàn)/i;
    const matchKhoangGia = text.match(regexKhoangGia);
    if (matchKhoangGia) {
        const dv = /k|nghìn|ngàn/i.test(matchKhoangGia[0]) ? 1000 : 1000000;
        const val1 = parseInt(matchKhoangGia[1], 10) * dv;
        const val2 = matchKhoangGia[2] ? parseInt(matchKhoangGia[2], 10) * dv : null;
        if (val2) {
            tieuChi.giaMin = Math.min(val1, val2);
            tieuChi.giaMax = Math.max(val1, val2);
        } else {
            tieuChi.giaMin = Math.max(0, val1 - (dv === 1000 ? 200000 : 3000000));
            tieuChi.giaMax = val1 + (dv === 1000 ? 200000 : 3000000);
        }
    } else {
        const regexDuoiGia = /(?:dưới|<|nho hon|nhỏ hơn)\s*(\d+)\s*(?:triệu|tr|củ|m|k|nghìn|ngàn)/i;
        const matchDuoi = text.match(regexDuoiGia);
        if (matchDuoi) {
            const dv = /k|nghìn|ngàn/i.test(matchDuoi[0]) ? 1000 : 1000000;
            tieuChi.giaMax = parseInt(matchDuoi[1], 10) * dv;
        }

        const regexTrenGia = /(?:trên|>|lon hon|lớn hơn)\s*(\d+)\s*(?:triệu|tr|củ|m|k|nghìn|ngàn)/i;
        const matchTren = text.match(regexTrenGia);
        if (matchTren) {
            const dv = /k|nghìn|ngàn/i.test(matchTren[0]) ? 1000 : 1000000;
            tieuChi.giaMin = parseInt(matchTren[1], 10) * dv;
        }
    }

    // 5. Tách các từ khóa phần cứng hoặc linh phụ kiện
    const regexPhanCung = /(rtx\s*\d{4}|core\s*i[3579]|ryzen\s*[3579]|ultra\s*[579]|16gb|32gb|64gb|oled|rog|tuf|legion|loq|vivobook|zenbook|thinkpad|inspiron|predator|nitro|victus|omen|macbook|sạc|chuột|bàn phím|tản nhiệt|balo|tai nghe|ssd|ram|keo|lót chuột)/gi;
    const matchPhanCung = text.match(regexPhanCung);
    if (matchPhanCung) {
        tieuChi.tuKhoa = matchPhanCung.map(k => k.trim());
    }

    // 6. Nhận diện xem khách có thực sự muốn tìm kiếm / mua sản phẩm hay chỉ là chào hỏi xã giao
    const laChaoHoiHoacXaGiao = /^(hi|hello|alo|chào|chao|ê|hey|tôi tên|mình tên|anh tên|em tên|bạn tên|shop ơi|ad ơi|admin ơi|chào shop|chào ad|chào em|chào bạn|hi shop|hi ad|hi pro|hi shop pro)[\s!.,?~]*$/i.test(text)
        || /^(shop ở đâu|địa chỉ|mấy giờ|có ship không|chính sách|bảo hành|trả góp|hotline|liên hệ|ở đâu)[\s!.,?~]*$/i.test(text);

    const coTuKhoaTimKiem = /(mua|tìm|tim|tư vấn|tu van|giá|gia|bao nhiêu|báo giá|gợi ý|goi y|xem|có con nào|máy tính|laptop|chuột|phím|sạc|tai nghe|balo|tản nhiệt|ssd|ram|gear|phụ kiện)/i.test(text);

    tieuChi.coNhuCauSanPham = Boolean(
        (tieuChi.hang || tieuChi.danhMuc || tieuChi.laPhuKien || tieuChi.giaMin !== null || tieuChi.giaMax !== null || tieuChi.tuKhoa.length > 0 || coTuKhoaTimKiem)
        && !laChaoHoiHoacXaGiao
    );

    return tieuChi;
}

/**
 * Đọc dữ liệu sản phẩm dự phòng từ file json dự phòng chuẩn
 */
function docSanPhamFallback() {
    const cacDuongDan = [
        path.join(__dirname, '..', 'backup_db', 'sanphams.json'),
        path.join(__dirname, '..', '..', 'FE', 'db.json')
    ];

    for (const p of cacDuongDan) {
        if (fs.existsSync(p)) {
            try {
                const duLieu = JSON.parse(fs.readFileSync(p, 'utf-8'));
                if (Array.isArray(duLieu)) return duLieu;
                if (Array.isArray(duLieu.san_pham)) return duLieu.san_pham;
            } catch {}
        }
    }
    return [];
}

/**
 * Kiểm tra xem một sản phẩm có phải phụ kiện / linh kiện hay không
 */
function laPhuKienLinhKien(sp) {
    const dm = (sp.danh_muc || []).map(d => String(d).toLowerCase());
    return dm.some(d => d.includes('phu-kien') || d.includes('chuot') || d.includes('sac') || d.includes('balo') || d.includes('tai-nghe') || d.includes('de-tan') || d.includes('linh-kien') || d.includes('ban-phim'));
}

/**
 * Sắp xếp sản phẩm thông minh bám sát câu hỏi của người dùng
 */
function sapXepTheoYeuCau(danhSach, tieuChi, rawText) {
    return [...danhSach].sort((a, b) => {
        const tenA = (a.ten_san_pham || '').toLowerCase();
        const tenB = (b.ten_san_pham || '').toLowerCase();

        // 1. Phân định Laptop vs Phụ kiện
        if (!tieuChi.laPhuKien) {
            const aIsPK = laPhuKienLinhKien(a);
            const bIsPK = laPhuKienLinhKien(b);
            if (!aIsPK && bIsPK) return -1;
            if (aIsPK && !bIsPK) return 1;
        } else {
            const aIsPK = laPhuKienLinhKien(a);
            const bIsPK = laPhuKienLinhKien(b);
            if (aIsPK && !bIsPK) return -1;
            if (!aIsPK && bIsPK) return 1;
        }

        // 2. Nếu khách hỏi lót chuột: Ưu tiên lót chuột lên trước chuột
        if (tieuChi.hoiLotChuot) {
            const aIsPad = tenA.includes('lót chuột') || tenA.includes('pad') || tenA.includes('bàn di');
            const bIsPad = tenB.includes('lót chuột') || tenB.includes('pad') || tenB.includes('bàn di');
            if (aIsPad && !bIsPad) return -1;
            if (!aIsPad && bIsPad) return 1;
        }

        // 3. Nếu khách hỏi chuột (và không nhắc đến lót chuột): ƯU TIÊN CHUỘT THẬT LÊN TRƯỚC LÓT CHUỘT
        if (tieuChi.hoiChuot && !rawText.includes('lót') && !rawText.includes('pad') && !rawText.includes('di')) {
            const aIsMouse = tenA.includes('chuột') && !tenA.includes('lót chuột') && !tenA.includes('bàn di');
            const bIsMouse = tenB.includes('chuột') && !tenB.includes('lót chuột') && !tenB.includes('bàn di');
            if (aIsMouse && !bIsMouse) return -1;
            if (!aIsMouse && bIsMouse) return 1;
        }

        // 4. Nếu hỏi sạc: Ưu tiên củ sạc trước cáp / hub
        if (tieuChi.hoiSac) {
            const aIsCharger = tenA.includes('sạc') && !tenA.includes('hub');
            const bIsCharger = tenB.includes('sạc') && !tenB.includes('hub');
            if (aIsCharger && !bIsCharger) return -1;
            if (!aIsCharger && bIsCharger) return 1;
        }

        // Mặc định sắp xếp theo độ bán chạy
        return (b.so_luong_da_ban || 0) - (a.so_luong_da_ban || 0);
    });
}

/**
 * Tìm kiếm danh sách sản phẩm phù hợp nhất trong MongoDB hoặc Fallback
 * @param {string} cauHoiKhachHang 
 * @param {number} soLuongToiDa 
 * @returns {Promise<Array>} Danh sách sản phẩm đầy đủ
 */
async function timKiemSanPhamPhuHop(cauHoiKhachHang = '', soLuongToiDa = 5) {
    const rawText = cauHoiKhachHang.toLowerCase().trim();
    const tieuChi = phanTichYDinhCauHoi(cauHoiKhachHang);

    // Nếu khách chỉ chào hỏi xã giao hoặc chưa có nhu cầu tìm sản phẩm, KHÔNG tìm kiếm DB
    if (!tieuChi.coNhuCauSanPham) {
        return [];
    }

    let danhSachKetQua = [];

    // Chỉ truy vấn MongoDB nếu kết nối đã sẵn sàng (readyState === 1)
    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            const filter = { con_hang: true };

            if (tieuChi.hang) {
                filter.hang_san_xuat = tieuChi.hang;
            }

            if (tieuChi.danhMuc) {
                if (tieuChi.laPhuKien) {
                    const orConditions = [{ danh_muc: tieuChi.danhMuc }];
                    if (tieuChi.hoiBanPhim) orConditions.push({ ten_san_pham: { $regex: 'phím|keyboard', $options: 'i' } });
                    if (tieuChi.hoiChuot) orConditions.push({ ten_san_pham: { $regex: 'chuột', $options: 'i' } });
                    if (tieuChi.hoiLotChuot) orConditions.push({ ten_san_pham: { $regex: 'lót chuột|pad', $options: 'i' } });
                    if (tieuChi.hoiSac) orConditions.push({ ten_san_pham: { $regex: 'sạc|hub', $options: 'i' } });
                    if (tieuChi.hoiTaiNghe) orConditions.push({ ten_san_pham: { $regex: 'tai nghe|loa', $options: 'i' } });
                    if (tieuChi.hoiBalo) orConditions.push({ ten_san_pham: { $regex: 'balo|túi', $options: 'i' } });
                    if (tieuChi.hoiTanNhiet) orConditions.push({ ten_san_pham: { $regex: 'tản nhiệt|giá đỡ', $options: 'i' } });
                    filter.$or = orConditions;
                } else {
                    filter.danh_muc = tieuChi.danhMuc;
                }
            }

            if (tieuChi.giaMin !== null || tieuChi.giaMax !== null) {
                filter.gia_khuyen_mai = {};
                if (tieuChi.giaMin !== null) filter.gia_khuyen_mai.$gte = tieuChi.giaMin;
                if (tieuChi.giaMax !== null) filter.gia_khuyen_mai.$lte = tieuChi.giaMax;
            }

            if (tieuChi.tuKhoa.length > 0 && !filter.$or) {
                filter.$or = tieuChi.tuKhoa.map(kw => ({
                    ten_san_pham: { $regex: kw, $options: 'i' }
                }));
            }

            let query = SanPham.find(filter);
            const rawList = await query.limit(10).lean().exec();
            danhSachKetQua = sapXepTheoYeuCau(rawList, tieuChi, rawText).slice(0, soLuongToiDa);
        } catch (e) {
            console.warn('⚠️ [Tìm kiếm sản phẩm AI] Truy vấn MongoDB gặp sự cố, chuyển fallback json:', e.message);
        }
    }

    // Nếu không tìm thấy hoặc MongoDB chưa sẵn sàng, lọc từ file backup chuẩn
    if (!danhSachKetQua || danhSachKetQua.length === 0) {
        const danhSachFull = docSanPhamFallback();
        let dsLoc = danhSachFull.filter(sp => sp.con_hang !== false);

        if (tieuChi.hang) {
            dsLoc = dsLoc.filter(sp => (sp.hang_san_xuat || '').toLowerCase() === tieuChi.hang);
        }

        if (tieuChi.danhMuc) {
            const locTheoDanhMuc = dsLoc.filter(sp => (sp.danh_muc || []).map(d => d.toLowerCase()).includes(tieuChi.danhMuc));
            if (locTheoDanhMuc.length > 0) {
                dsLoc = locTheoDanhMuc;
            } else if (tieuChi.laPhuKien) {
                const locTheoTuKhoa = dsLoc.filter(sp => {
                    const ten = (sp.ten_san_pham || '').toLowerCase();
                    if (tieuChi.hoiBanPhim) return ten.includes('phím') || ten.includes('keyboard');
                    if (tieuChi.hoiChuot) return ten.includes('chuột');
                    if (tieuChi.hoiLotChuot) return ten.includes('lót chuột') || ten.includes('pad');
                    if (tieuChi.hoiSac) return ten.includes('sạc') || ten.includes('hub');
                    if (tieuChi.hoiTaiNghe) return ten.includes('tai nghe') || ten.includes('loa');
                    if (tieuChi.hoiBalo) return ten.includes('balo') || ten.includes('túi');
                    if (tieuChi.hoiTanNhiet) return ten.includes('tản nhiệt') || ten.includes('giá đỡ');
                    return false;
                });
                if (locTheoTuKhoa.length > 0) dsLoc = locTheoTuKhoa;
            }
        }

        if (tieuChi.giaMin !== null) {
            dsLoc = dsLoc.filter(sp => (sp.gia_khuyen_mai || 0) >= tieuChi.giaMin);
        }

        if (tieuChi.giaMax !== null) {
            dsLoc = dsLoc.filter(sp => (sp.gia_khuyen_mai || 0) <= tieuChi.giaMax);
        }

        if (tieuChi.tuKhoa.length > 0) {
            dsLoc = dsLoc.filter(sp => {
                const ten = (sp.ten_san_pham || '').toLowerCase();
                return tieuChi.tuKhoa.some(kw => ten.includes(kw.toLowerCase()));
            });
        }

        // Sắp xếp bám sát câu hỏi
        dsLoc = sapXepTheoYeuCau(dsLoc, tieuChi, rawText);
        danhSachKetQua = dsLoc.slice(0, soLuongToiDa);

        // Nếu câu hỏi về phụ kiện mà chưa có kết quả, lấy ngay các phụ kiện hot từ danhSachFull
        if (danhSachKetQua.length === 0 && tieuChi.laPhuKien) {
            const phuKienList = danhSachFull.filter(sp => laPhuKienLinhKien(sp) && sp.con_hang !== false);
            danhSachKetQua = sapXepTheoYeuCau(phuKienList, tieuChi, rawText).slice(0, 4);
        }

        // Nếu vẫn không ra gì, lấy top 4 sản phẩm bán chạy phù hợp với loại hình
        if (danhSachKetQua.length === 0 && danhSachFull.length > 0) {
            const dsChuan = tieuChi.laPhuKien 
                ? danhSachFull.filter(sp => laPhuKienLinhKien(sp)) 
                : danhSachFull.filter(sp => !laPhuKienLinhKien(sp));
            danhSachKetQua = (dsChuan.length > 0 ? dsChuan : danhSachFull).slice(0, 4);
        }
    }

    return danhSachKetQua;
}

/**
 * Định dạng danh sách sản phẩm thành văn bản cô đọng đưa vào System Prompt
 * @param {Array} danhSachSanPham 
 * @returns {string}
 */
function dinhDangNguCanhSanPham(danhSachSanPham = []) {
    if (!danhSachSanPham || danhSachSanPham.length === 0) {
        return "Khách hàng hiện đang chào hỏi xã giao hoặc hỏi thông tin chung, CHƯA có nhu cầu xem sản phẩm cụ thể. Bạn tuyệt đối KHÔNG đề xuất sản phẩm nào (BẮT BUỘC để mảng \"id_san_pham_phu_hop\": [] rỗng).";
    }

    let text = "=== DANH SÁCH MÃ SẢN PHẨM & PHỤ KIỆN CÓ SẴN TRONG KHO SHOWROOM ===\n";
    danhSachSanPham.forEach((sp, idx) => {
        const id = sp.id || sp.slug || sp._id;
        const ten = sp.ten_san_pham || 'Sản phẩm';
        const hang = (sp.hang_san_xuat || '').toUpperCase();
        const giaKM = (sp.gia_khuyen_mai || 0).toLocaleString('vi-VN') + 'đ';
        const cpu = sp.thong_so?.cpu || '';
        const ram = sp.thong_so?.ram || '';

        text += `${idx + 1}. [ID: ${id}] ${ten}\n`;
        text += `   - Giá: ${giaKM} | Hãng: ${hang}`;
        if (cpu || ram) text += ` | Thông số: ${[cpu, ram].filter(Boolean).join(' - ')}`;
        text += `\n\n`;
    });

    return text;
}

module.exports = {
    phanTichYDinhCauHoi,
    timKiemSanPhamPhuHop,
    dinhDangNguCanhSanPham
};
