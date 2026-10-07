/**
 * Chú thích file: Dịch vụ phân tích ý định khách hàng và truy vấn sản phẩm phù hợp từ MongoDB / Cache.
 * Hỗ trợ toàn diện cả LAPTOP và LINH KIỆN / PHỤ KIỆN (Chuột, Bàn phím, Củ sạc, Tản nhiệt, Balo, SSD, RAM...).
 * Sắp xếp độ ưu tiên chuẩn xác: Nhận diện chính xác tên hãng (kể cả gõ cách như 'leno vo', 'a sus', 'mac book'),
 * nhận diện 'con nào rẻ nhất' / 'giá rẻ' / 'sinh viên' và trả về thẻ sản phẩm phù hợp.
 */

const SanPham = require('../models/san-pham.model');

/**
 * Loại bỏ dấu tiếng Việt để so khớp không dấu
 */
function loaiBoDauTiengViet(str = '') {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

// Bảng ánh xạ Hãng sản xuất đa dạng bao gồm cả lỗi gõ cách (leno vo, a sus, mac book) và các dòng máy đặc trưng
const HANG_MAP = [
    { hang: 'lenovo', patterns: ['lenovo', 'leno vo', 'legion', 'thinkpad', 'loq', 'ideapad', 'yoga'] },
    { hang: 'asus', patterns: ['asus', 'a sus', 'rog', 'tuf', 'zenbook', 'vivobook'] },
    { hang: 'dell', patterns: ['dell', 'alienware', 'xps', 'inspiron', 'vostro', 'latitude'] },
    { hang: 'hp', patterns: ['hp', 'victus', 'omen', 'pavilion', 'envy', 'spectre'] },
    { hang: 'acer', patterns: ['acer', 'nitro', 'predator', 'aspire', 'swift'] },
    { hang: 'msi', patterns: ['msi', 'katana', 'cyborg', 'stealth', 'raider', 'titan'] },
    { hang: 'apple', patterns: ['apple', 'macbook', 'mac book', 'mac', 'macbook air', 'macbook pro'] },
    { hang: 'razer', patterns: ['razer', 'blade'] },
    { hang: 'logitech', patterns: ['logitech', 'logi'] },
    { hang: 'anker', patterns: ['anker'] },
    { hang: 'ugreen', patterns: ['ugreen'] },
    { hang: 'samsung', patterns: ['samsung'] },
    { hang: 'kingston', patterns: ['kingston'] },
    { hang: 'tomtoc', patterns: ['tomtoc'] }
];

/**
 * Phân tích câu hỏi của khách hàng để trích xuất các tiêu chí lọc sản phẩm
 * @param {string} cauHoi
 * @returns {Object} Tiêu chí trích xuất
 */
function phanTichYDinhCauHoi(cauHoi = '') {
    const text = cauHoi.toLowerCase().trim();
    const textKhongDau = loaiBoDauTiengViet(text);
    const textKhongKhoangTrang = textKhongDau.replace(/\s+/g, '');

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
        hoiLinhKien: false,
        sapXepGiaRe: false,
        uuTienLaptop: false,
        coNhuCauSanPham: false
    };

    // 1. Nhận diện Hãng sản xuất (kể cả có dấu cách như leno vo, a sus, mac book)
    for (const item of HANG_MAP) {
        if (
            item.patterns.some(
                (p) => text.includes(p) || textKhongDau.includes(p) || textKhongKhoangTrang.includes(p.replace(/\s+/g, ''))
            )
        ) {
            tieuChi.hang = item.hang;
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
    } else if (
        /tản nhiệt|tan nhiet|keo tản nhiệt|keo tan nhiet|sò lạnh|so lanh|giá đỡ|gia do|đế tản nhiệt|stand/i.test(text)
    ) {
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
        if (/laptop|máy tính|may tinh|máy|may|con nào|con nao|chiến mã/i.test(text) || /laptop|may tinh/i.test(textKhongDau)) {
            tieuChi.uuTienLaptop = true;
        }

        if (
            /gaming|chơi game|choi game|chiến game|chien game|game thủ|game thu|pubg|valorant|lol|fifa|gta|chiến|do hoa game/i.test(
                text
            )
        ) {
            tieuChi.danhMuc = 'gaming';
            tieuChi.uuTienLaptop = true;
        } else if (/đồ họa|do hoa|render|photoshop|premiere|autocad|blender|3d|dựng phim/i.test(text)) {
            tieuChi.danhMuc = 'do-hoa-sang-tao';
            tieuChi.uuTienLaptop = true;
        } else if (/văn phòng|van phong|học tập|hoc tap|sinh viên|sinh vien|word|excel|kế toán/i.test(text) || /van phong|hoc tap|sinh vien/i.test(textKhongDau)) {
            tieuChi.danhMuc = 'van-phong-mong-nhe';
            tieuChi.uuTienLaptop = true;
        } else if (/mỏng nhẹ|mong nhe|di chuyển|nhẹ|nhe|ultrabook|pin trâu|pin trau|doanh nhân|doanh nhan/i.test(text) || /mong nhe|pin trau/i.test(textKhongDau)) {
            tieuChi.danhMuc = 'van-phong-mong-nhe';
            tieuChi.uuTienLaptop = true;
        } else if (/ai|npu|ai-pc|trí tuệ nhân tạo/i.test(text)) {
            tieuChi.danhMuc = 'ai-pc';
            tieuChi.uuTienLaptop = true;
        }
    }

    // 4. Nhận diện tiêu chí "Rẻ nhất" / "Hạt dẻ" / "Sinh viên" / "Kinh tế"
    const regexGiaRe =
        /(rẻ|re|rẻ nhất|re nhat|rẻ nhát|thấp nhất|thap nhat|giá rẻ|gia re|bình dân|binh dan|hạt dẻ|hat de|sinh viên|sinh vien|học sinh|hoc sinh|ngon bổ rẻ|ngon bo re|kinh tế|kinh te|tiết kiệm|tiet kiem|vừa túi tiền)/i;
    if (regexGiaRe.test(text) || regexGiaRe.test(textKhongDau)) {
        tieuChi.sapXepGiaRe = true;
        // Nếu câu hỏi nói về "con nào", "máy nào", "laptop" hoặc không chỉ đích danh phụ kiện -> ưu tiên laptop
        if (/con nào|con nao|máy nào|may nao|laptop|máy tính|may tinh|mẫu nào|mau nao/i.test(text) || !tieuChi.laPhuKien) {
            tieuChi.uuTienLaptop = true;
        }
    }

    // 5. Nhận diện Mức giá / Ngân sách cụ thể
    const regexKhoangGia =
        /(?:từ|khoảng|tam|tầm)\s*(\d+)(?:\s*(?:đến|-|tới)\s*(\d+))?\s*(?:triệu|tr|củ|m|k|nghìn|ngàn)/i;
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

    // 6. Tách các từ khóa phần cứng hoặc linh phụ kiện
    const regexPhanCung =
        /(rtx\s*\d{4}|core\s*i[3579]|ryzen\s*[3579]|ultra\s*[579]|16gb|32gb|64gb|oled|rog|tuf|legion|loq|vivobook|zenbook|thinkpad|inspiron|predator|nitro|victus|omen|macbook|sạc|chuột|bàn phím|tản nhiệt|balo|tai nghe|ssd|ram|keo|lót chuột)/gi;
    const matchPhanCung = text.match(regexPhanCung);
    if (matchPhanCung) {
        tieuChi.tuKhoa = matchPhanCung.map((k) => k.trim());
    }

    // 7. Nhận diện xem khách có nhu cầu xem sản phẩm không
    // Chào hỏi xã giao thuần túy (rất ngắn và chỉ có lời chào)
    const laChaoHoiThuanTuy =
        /^(hi|hello|alo|chào|chao|ê|hey|tôi tên|mình tên|anh tên|em tên|bạn tên|shop ơi|ad ơi|admin ơi|chào shop|chào ad|chào em|chào bạn|hi shop|hi ad|hi pro|hi shop pro)[\s!.,?~]*$/i.test(
            text
        ) && !tieuChi.hang && !tieuChi.sapXepGiaRe;

    const coTuKhoaHoiSanPham =
        /(con nào|máy nào|cái nào|mẫu nào|sản phẩm nào|sp nào|sarnpaharm|sarn paharm|con gì|máy gì|cái gì|mẫu gì|có con nào|có máy nào|có mẫu nào|dòng nào|loại nào|nào rẻ|rẻ nhất|mua|tìm|tim|tư vấn|tu van|giá|gia|báo giá|bao gia|gợi ý|goi y|xem|laptop|máy tính|may tinh|chuột|chuot|phím|phim|sạc|sac|tai nghe|balo|tản nhiệt|tan nhiet|ssd|ram|gear|phụ kiện|phu kien)/i.test(
            text
        ) ||
        /(con nao|may nao|cai nao|mau nao|san pham|sp|re nhat|gia re)/i.test(textKhongDau);

    tieuChi.coNhuCauSanPham = Boolean(
        (tieuChi.hang ||
            tieuChi.danhMuc ||
            tieuChi.laPhuKien ||
            tieuChi.sapXepGiaRe ||
            tieuChi.giaMin !== null ||
            tieuChi.giaMax !== null ||
            tieuChi.tuKhoa.length > 0 ||
            coTuKhoaHoiSanPham) &&
        !laChaoHoiThuanTuy
    );

    return tieuChi;
}

/**
 * Kiểm tra xem một sản phẩm có phải phụ kiện / linh kiện hay không
 */
function laPhuKienLinhKien(sp) {
    const dm = (sp.danh_muc || []).map((d) => String(d).toLowerCase());
    return dm.some(
        (d) =>
            d.includes('phu-kien') ||
            d.includes('chuot') ||
            d.includes('sac') ||
            d.includes('balo') ||
            d.includes('tai-nghe') ||
            d.includes('de-tan') ||
            d.includes('linh-kien') ||
            d.includes('ban-phim')
    );
}

/**
 * Sắp xếp sản phẩm thông minh bám sát câu hỏi của người dùng
 */
function sapXepTheoYeuCau(danhSach, tieuChi, rawText) {
    return [...danhSach].sort((a, b) => {
        const tenA = (a.ten_san_pham || '').toLowerCase();
        const tenB = (b.ten_san_pham || '').toLowerCase();

        // 1. Nếu khách hỏi Rẻ nhất: ƯU TIÊN GIÁ THẤP LÊN ĐẦU
        if (tieuChi.sapXepGiaRe) {
            const giaA = a.gia_khuyen_mai || a.gia_goc || 999999999;
            const giaB = b.gia_khuyen_mai || b.gia_goc || 999999999;
            return giaA - giaB;
        }

        // 2. Phân định Laptop vs Phụ kiện
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

        // 3. Nếu khách hỏi lót chuột: Ưu tiên lót chuột lên trước chuột
        if (tieuChi.hoiLotChuot) {
            const aIsPad = tenA.includes('lót chuột') || tenA.includes('pad') || tenA.includes('bàn di');
            const bIsPad = tenB.includes('lót chuột') || tenB.includes('pad') || tenB.includes('bàn di');
            if (aIsPad && !bIsPad) return -1;
            if (!aIsPad && bIsPad) return 1;
        }

        // 4. Nếu khách hỏi chuột (và không nhắc đến lót chuột): Ưu tiên chuột thật lên trước lót chuột
        if (tieuChi.hoiChuot && !rawText.includes('lót') && !rawText.includes('pad') && !rawText.includes('di')) {
            const aIsMouse = tenA.includes('chuột') && !tenA.includes('lót chuột') && !tenA.includes('bàn di');
            const bIsMouse = tenB.includes('chuột') && !tenB.includes('lót chuột') && !tenB.includes('bàn di');
            if (aIsMouse && !bIsMouse) return -1;
            if (!aIsMouse && bIsMouse) return 1;
        }

        // 5. Nếu hỏi sạc: Ưu tiên củ sạc trước cáp / hub
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
 * Tìm kiếm danh sách sản phẩm phù hợp nhất trong MongoDB
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

    const mongoose = require('mongoose');
    if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
            const filter = { con_hang: true };

            // Lọc theo Hãng (hỗ trợ cả tìm theo hang_san_xuat lẫn ten_san_pham)
            if (tieuChi.hang) {
                filter.$or = [
                    { hang_san_xuat: { $regex: new RegExp(`^${tieuChi.hang}$`, 'i') } },
                    { ten_san_pham: { $regex: new RegExp(tieuChi.hang, 'i') } }
                ];
            }

            // Lọc theo Danh mục
            if (tieuChi.danhMuc) {
                if (tieuChi.laPhuKien) {
                    const orConditions = [{ danh_muc: tieuChi.danhMuc }];
                    if (tieuChi.hoiBanPhim)
                        orConditions.push({ ten_san_pham: { $regex: 'phím|keyboard', $options: 'i' } });
                    if (tieuChi.hoiChuot) orConditions.push({ ten_san_pham: { $regex: 'chuột', $options: 'i' } });
                    if (tieuChi.hoiLotChuot)
                        orConditions.push({ ten_san_pham: { $regex: 'lót chuột|pad', $options: 'i' } });
                    if (tieuChi.hoiSac) orConditions.push({ ten_san_pham: { $regex: 'sạc|hub', $options: 'i' } });
                    if (tieuChi.hoiTaiNghe)
                        orConditions.push({ ten_san_pham: { $regex: 'tai nghe|loa', $options: 'i' } });
                    if (tieuChi.hoiBalo) orConditions.push({ ten_san_pham: { $regex: 'balo|túi', $options: 'i' } });
                    if (tieuChi.hoiTanNhiet)
                        orConditions.push({ ten_san_pham: { $regex: 'tản nhiệt|giá đỡ', $options: 'i' } });

                    if (filter.$or) {
                        filter.$and = [{ $or: filter.$or }, { $or: orConditions }];
                        delete filter.$or;
                    } else {
                        filter.$or = orConditions;
                    }
                } else {
                    if (tieuChi.danhMuc === 'van-phong-mong-nhe') {
                        filter.danh_muc = { $in: ['van-phong-mong-nhe', 'sinh-vien', 'doanh-nhan'] };
                    } else {
                        filter.danh_muc = tieuChi.danhMuc;
                    }
                }
            } else if (tieuChi.uuTienLaptop && !tieuChi.laPhuKien) {
                filter.danh_muc = {
                    $in: ['gaming', 'van-phong-mong-nhe', 'ai-pc', 'do-hoa-sang-tao', 'sinh-vien', 'doanh-nhan']
                };
            }

            // Lọc mức giá
            if (tieuChi.giaMin !== null || tieuChi.giaMax !== null) {
                filter.gia_khuyen_mai = {};
                if (tieuChi.giaMin !== null) filter.gia_khuyen_mai.$gte = tieuChi.giaMin;
                if (tieuChi.giaMax !== null) filter.gia_khuyen_mai.$lte = tieuChi.giaMax;
            }

            // Lọc từ khóa phần cứng
            if (tieuChi.tuKhoa.length > 0 && !filter.$or && !filter.$and) {
                filter.$or = tieuChi.tuKhoa.map((kw) => ({
                    ten_san_pham: { $regex: kw, $options: 'i' }
                }));
            }

            let query = SanPham.find(filter);

            // Nếu người dùng hỏi "rẻ nhất", ưu tiên sort theo giá tăng dần
            if (tieuChi.sapXepGiaRe) {
                query = query.sort({ gia_khuyen_mai: 1 });
            } else {
                query = query.sort({ so_luong_da_ban: -1, createdAt: -1 });
            }

            const rawList = await query.limit(15).lean().exec();

            // Nếu người dùng hỏi "con nào rẻ nhất" và ưu tiên laptop:
            let ketQuaLoc = rawList;
            if (tieuChi.uuTienLaptop && !tieuChi.laPhuKien) {
                const danhSachLaptop = rawList.filter((sp) => !laPhuKienLinhKien(sp));
                if (danhSachLaptop.length > 0) {
                    ketQuaLoc = danhSachLaptop;
                }
            }

            danhSachKetQua = sapXepTheoYeuCau(ketQuaLoc, tieuChi, rawText).slice(0, soLuongToiDa);
        } catch (e) {
            console.error('❌ [Tìm kiếm sản phẩm AI] Truy vấn MongoDB gặp sự cố:', e.message);
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
        return 'Khách hàng hiện đang chào hỏi xã giao hoặc hỏi thông tin chung, CHƯA có nhu cầu xem sản phẩm cụ thể. Bạn tuyệt đối KHÔNG đề xuất sản phẩm nào (BẮT BUỘC để mảng "id_san_pham_phu_hop": [] rỗng).';
    }

    let text = '=== DANH SÁCH MÃ SẢN PHẨM & PHỤ KIỆN PHÙ HỢP CÓ SẴN TRONG KHO SHOWROOM ===\n';
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
