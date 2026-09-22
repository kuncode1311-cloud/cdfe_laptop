/**
 * Module cấu hình API Client kết nối Backend Express.js & MongoDB Atlas
 * 100% Dữ liệu thực tế từ Database, không dùng dữ liệu cứng giả lập
 */
export function layApiBaseUrl() {
    if (typeof window !== 'undefined') {
        // Trên trình duyệt: Khi chạy ở Railway, Vercel hay bất kỳ domain nào (kể cả localhost),
        // luôn ưu tiên gọi Route Handler nội bộ Next.js cùng origin (/api)
        // để đảm bảo HTTPS, không bị CORS, không bị Mixed Content và không phụ thuộc Express port 5000.
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            return `${window.location.origin}/api`;
        }
        if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost:5000')) {
            return process.env.NEXT_PUBLIC_API_URL;
        }
        return `${window.location.origin}/api`;
    }
    // Phía Server (Node.js runtime)
    if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('localhost:5000')) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    const port = process.env.PORT || 3000;
    return `http://127.0.0.1:${port}/api`;
}

export const API_BASE_URL = typeof window !== 'undefined'
    ? `${window.location.origin}/api`
    : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000/api');

export const TOKEN_STORAGE_KEY = 'tnt_laptop_token';

/**
 * Hàm gửi request API an toàn, có JWT header, timeout chuẩn
 */
export async function apiFetch(endpoint, options = {}) {
    const { timeoutMs = 20000, ...fetchOptions } = options;

    const base = layApiBaseUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = endpoint.startsWith('http') ? endpoint : `${base}${cleanEndpoint}`;

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

        // Nếu gọi localhost:5000 bị lỗi (ví dụ chưa bật Express), tự động fallback gọi API Next.js trên port hiện tại
        if (url.includes('localhost:5000') && typeof window !== 'undefined') {
            try {
                const fallbackUrl = `${window.location.origin}/api${cleanEndpoint}`;
                const resFallback = await fetch(fallbackUrl, {
                    ...fetchOptions,
                    headers
                });
                if (resFallback.ok) {
                    return await resFallback.json();
                }
            } catch {}
        }

        if (error.name === 'AbortError') {
            console.warn(`⚠️ [API Timeout] Yêu cầu tới (${url}) vượt quá thời gian ${timeoutMs}ms.`);
        } else {
            console.error(`❌ [API Error] Lỗi kết nối API (${url}):`, error.message);
        }
        throw error;
    }
}

