/**
 * Module cấu hình API Client kết nối Backend Express.js & MongoDB
 * Hỗ trợ tự động gắn Token JWT và fallback sang dữ liệu cục bộ nếu server offline
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const TOKEN_STORAGE_KEY = 'tnt_laptop_token';

// File này là "người gửi request" dùng chung cho toàn bộ frontend.
// Các service chỉ cần gọi apiFetch('/duong-dan-api'), không phải tự viết fetch,
// nối URL, thêm token và xử lý lỗi nhiều lần.

/**
 * Hàm gửi request API an toàn, có JWT header, timeout và fallback
 */
export async function apiFetch(endpoint, options = {}, fallbackData) {
    const { timeoutMs = 5000, ...fetchOptions } = options;
    const method = (fetchOptions.method || 'GET').toUpperCase();
    const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
    const effectiveFallback = isMutation ? undefined : fallbackData;

    // Nếu endpoint là '/san-pham' thì ghép thành 'http://localhost:5000/api/san-pham'.
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Tự động lấy token đăng nhập từ trình duyệt và gửi kèm cho backend.
    const headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    try {
        // Đây là lúc request thật sự được gửi đến Express backend.
        const res = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
            headers
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            console.warn(`[API] Gọi ${endpoint} thất bại (HTTP ${res.status}), dùng dữ liệu dự phòng`);
            if (effectiveFallback !== undefined)
                return effectiveFallback;
            const errBody = await res.json().catch(() => ({}));
            const err = new Error(errBody.thong_diep || `HTTP Error: ${res.status}`);
            err.status = res.status;
            err.data = errBody;
            throw err;
        }

        // Chuyển dữ liệu JSON backend trả về thành object/array JavaScript.
        return await res.json();
    }
    catch (error) {
        clearTimeout(timeoutId);
        // Nếu backend tắt/mất mạng mà service có dữ liệu dự phòng,
        // frontend vẫn có thể hiển thị dữ liệu mẫu.
        if (effectiveFallback !== undefined) {
            return effectiveFallback;
        }
        throw error;
    }
}
