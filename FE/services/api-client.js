// =========================================================================
// [BƯỚC 3 CỦA LUỒNG - TẦNG GIAO TIẾP MẠNG HTTP CLIENT (api-client.js)]
// - Điểm trung chuyển HTTP giữa Front-End và Back-End
// - Tự động ghép Base URL (http://localhost:5000/api)
// - Tự động đính kèm Token JWT nếu đã đăng nhập và gọi lệnh `fetch()` gốc
// =========================================================================

// 3.1. Địa chỉ gốc của máy chủ Back-End Express API
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
    .replace(/\/+$/, '');

export function layApiBaseUrl() {
    return API_BASE_URL;
}

export const TOKEN_STORAGE_KEY = 'tnt_laptop_token';

// Callback toàn cục được gọi khi phát hiện phiên đăng nhập hết hạn (HTTP 401) giữa lúc đang dùng app.
// AuthContext đăng ký hàm đăng xuất vào đây để tự động đồng bộ UI khi token hết hạn, không cần mỗi nơi tự xử lý.
let xuLyHetHan = null;
export const dangKyXuLyHetHanPhien = (fn) => { xuLyHetHan = fn; };

// Các endpoint thuộc luồng đăng nhập/đăng ký không nên tự kích hoạt đăng xuất khi gặp 401,
// vì 401 ở đây là "sai thông tin đăng nhập" chứ không phải "phiên đã hết hạn", tránh vòng lặp vô hạn.
const laEndpointXacThucCongKhai = (cleanEndpoint) => /^\/auth\//.test(cleanEndpoint);

/**
 * Hàm gửi request API an toàn, có JWT header, timeout chuẩn
 */
export async function apiFetch(endpoint, options = {}) {
    const { timeoutMs = 20000, ...fetchOptions } = options;

    // 3.2. Ghép Base URL với endpoint con (VD: http://localhost:5000/api + /san-pham/:id)
    const base = layApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith('http') ? endpoint : `${base}${cleanEndpoint}`;

    // Cơ chế chống treo mạng: nếu quá 20 giây không phản hồi thì tự ngắt
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers
    };

    // 3.3. Tự động kiểm tra và gắn Token xác thực vào Header nếu người dùng đã đăng nhập
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    try {
        // 3.4. GỌI LỆNH FETCH GỐC CỦA TRÌNH DUYỆT BẮN QUA MẠNG SANG BACK-END
        const res = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
            headers
        });
        clearTimeout(timeoutId);

        // 3.5. Kiểm tra mã trạng thái HTTP (200 OK hay 400, 404, 500)
        if (!res.ok) {
            // Phiên đăng nhập hết hạn giữa buổi: tự động báo cho AuthContext đăng xuất đồng bộ UI
            if (res.status === 401 && !laEndpointXacThucCongKhai(cleanEndpoint)) {
                xuLyHetHan?.();
            }
            const errBody = await res.json().catch(() => ({}));
            const err = new Error(errBody.thong_diep || `Lỗi máy chủ: HTTP ${res.status}`);
            err.status = res.status;
            err.data = errBody;
            throw err;
        }

        // 3.6. Chuyển đổi phản hồi của Back-End từ JSON thành dữ liệu JavaScript và trả về
        return await res.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.warn(`⚠️ [API Timeout] Yêu cầu tới (${url}) vượt quá thời gian ${timeoutMs}ms.`);
        } else {
            console.error(`❌ [API Error] Lỗi kết nối API (${url}):`, error.message);
        }
        throw error;
    }
}

