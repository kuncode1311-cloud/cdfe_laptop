/**
 * Module cấu hình API Client kết nối Backend Express.js & MongoDB Atlas
 * 100% Dữ liệu thực tế từ Database, không dùng dữ liệu cứng giả lập
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api')
    .replace(/\/+$/, '');

export function layApiBaseUrl() {
    return API_BASE_URL;
}

export const TOKEN_STORAGE_KEY = 'tnt_laptop_token';

/**
 * Hàm gửi request API an toàn, có JWT header, timeout chuẩn
 */
export async function apiFetch(endpoint, options = {}) {
    const { timeoutMs = 20000, ...fetchOptions } = options;

    const base = layApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith('http') ? endpoint : `${base}${cleanEndpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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
        const res = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
            headers
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            const err = new Error(errBody.thong_diep || `Lỗi máy chủ: HTTP ${res.status}`);
            err.status = res.status;
            err.data = errBody;
            throw err;
        }

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

