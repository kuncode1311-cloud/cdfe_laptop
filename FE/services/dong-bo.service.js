'use client';

import { useSyncExternalStore } from 'react';
import { apiFetch } from './api-client';

/**
 * Tự làm mới dữ liệu khi Admin thêm / sửa / xóa — khách KHÔNG cần bấm F5.
 *
 * Cách hoạt động:
 *  1. Mỗi vài giây trình duyệt hỏi API rất nhẹ GET /api/dong-bo (chữ ký của từng bảng, không chứa dữ liệu).
 *  2. Chỉ khi chữ ký của một bảng ĐỔI thì các trang đang dùng bảng đó mới nạp lại → không nạp thừa, không nháy giao diện.
 *  3. Admin vừa thao tác xong còn báo thẳng cho các tab khác cùng trình duyệt qua BroadcastChannel
 *     nên tab của khách làm mới gần như tức thì; trình duyệt / máy khác nhận trong vài giây nhờ bước 1.
 *
 * Cách dùng trong component:   const phienBan = useDuLieuMoi('san_pham');
 * rồi đưa `phienBan` vào mảng phụ thuộc của useEffect nạp dữ liệu.
 */

const CHU_KY_HOI_MS = 5000;
const TEN_KENH = 'laptopnew-dong-bo';

const soPhienBan = {}; // bảng → số lần dữ liệu đã đổi (chỉ tăng)
const chuKyDaBiet = {}; // bảng → chữ ký lần hỏi trước
const nguoiNgheReact = new Set(); // hàm báo cho React biết có thay đổi
const nguoiNgheBang = {}; // bảng → các hàm cần gọi khi bảng đó đổi (cho service không phải React)

let soNguoiDung = 0; // số component đang dùng hook
let coDangKyCoDinh = false; // có service đăng ký lắng nghe cố định
let boHenGio = null;
let kenhNhan = null;
let kenhGui = null;
let dangHoi = false;

const laTrinhDuyet = () => typeof window !== 'undefined';

const baoThayDoi = (bang) => {
    soPhienBan[bang] = (soPhienBan[bang] || 0) + 1;
    (nguoiNgheBang[bang] || []).forEach((ham) => {
        try {
            ham();
        } catch (loi) {
            console.warn('[DongBo] Lỗi khi làm mới', bang, loi.message);
        }
    });
    nguoiNgheReact.forEach((ham) => ham());
};

/** Hỏi chữ ký mới nhất; bảng nào đổi so với lần trước thì báo thay đổi. */
export async function hoiPhienBan() {
    if (!laTrinhDuyet() || dangHoi) return;
    dangHoi = true;
    try {
        const ketQua = await apiFetch('/dong-bo', { cache: 'no-store', timeoutMs: 8000 });
        const moi = ketQua?.phien_ban || {};
        Object.keys(moi).forEach((bang) => {
            // Lần hỏi đầu chỉ ghi nhận mốc chuẩn, không coi là thay đổi
            if (chuKyDaBiet[bang] !== undefined && chuKyDaBiet[bang] !== moi[bang]) baoThayDoi(bang);
            chuKyDaBiet[bang] = moi[bang];
        });
    } catch {
        // Mất mạng / server bận: bỏ qua, lần hỏi sau tự thử lại
    } finally {
        dangHoi = false;
    }
}

const khiTrangHienLai = () => {
    if (document.visibilityState === 'visible') hoiPhienBan();
};

const batDau = () => {
    if (!laTrinhDuyet() || boHenGio) return;
    hoiPhienBan(); // lấy mốc chuẩn ngay
    // Chỉ hỏi khi tab đang được xem, đỡ tốn tài nguyên khi tab ở nền
    boHenGio = setInterval(khiTrangHienLai, CHU_KY_HOI_MS);
    document.addEventListener('visibilitychange', khiTrangHienLai);
    window.addEventListener('focus', khiTrangHienLai);
    try {
        kenhNhan = new BroadcastChannel(TEN_KENH);
        kenhNhan.onmessage = () => setTimeout(hoiPhienBan, 300);
    } catch {
        kenhNhan = null; // trình duyệt cũ: vẫn có bước hỏi định kỳ
    }
};

const dung = () => {
    if (!boHenGio || soNguoiDung > 0 || coDangKyCoDinh) return;
    clearInterval(boHenGio);
    boHenGio = null;
    document.removeEventListener('visibilitychange', khiTrangHienLai);
    window.removeEventListener('focus', khiTrangHienLai);
    kenhNhan?.close();
    kenhNhan = null;
};

/** Admin gọi sau khi thêm / sửa / xóa thành công để các tab khác làm mới ngay. */
export function thongBaoThayDoi(...cacBang) {
    if (!laTrinhDuyet()) return;
    try {
        kenhGui = kenhGui || new BroadcastChannel(TEN_KENH);
        kenhGui.postMessage({ bang: cacBang });
    } catch {
        /* trình duyệt cũ: các tab khác vẫn nhận qua bước hỏi định kỳ */
    }
    setTimeout(hoiPhienBan, 300); // nếu chính tab này cũng đang hiển thị trang khách
}

/** Cho service (không phải component React) đăng ký hàm chạy mỗi khi một bảng đổi. */
export function dangKyKhiDoi(bang, ham) {
    if (!laTrinhDuyet()) return;
    (nguoiNgheBang[bang] = nguoiNgheBang[bang] || []).push(ham);
    coDangKyCoDinh = true;
    batDau();
}

const dangKyReact = (kichHoat) => {
    nguoiNgheReact.add(kichHoat);
    soNguoiDung += 1;
    batDau();
    return () => {
        nguoiNgheReact.delete(kichHoat);
        soNguoiDung -= 1;
        dung();
    };
};

/**
 * Hook: trả về một con số tăng lên mỗi khi một trong các bảng được chỉ định thay đổi.
 * Đưa số này vào mảng phụ thuộc của useEffect để tự nạp lại dữ liệu.
 */
export function useDuLieuMoi(...cacBang) {
    return useSyncExternalStore(
        dangKyReact,
        () => cacBang.reduce((tong, bang) => tong + (soPhienBan[bang] || 0), 0),
        () => 0
    );
}
