/**
 * Tiện ích xử lý ảnh khi admin nhập ảnh sản phẩm: nén ảnh tải từ máy và kiểm tra link ảnh.
 */

// Ảnh dưới ngưỡng này (ký tự base64) thì giữ nguyên, không cần nén lại
const NGUONG_GIU_NGUYEN = 120 * 1024;

/**
 * Đọc file ảnh thành chuỗi base64 đã thu nhỏ + nén WebP.
 * - Cạnh dài nhất tối đa `canhToiDa` px; ảnh gốc 3-5MB thường còn vài chục KB.
 * - SVG và GIF giữ nguyên (nén sẽ mất vector / hiệu ứng động).
 * - Chỉ dùng bản nén khi nó thật sự nhỏ hơn bản gốc.
 */
export const docAnhDaNen = (file, { canhToiDa = 1200, chatLuong = 0.82 } = {}) =>
    new Promise((resolve, reject) => {
        const doc = new FileReader();
        doc.onerror = () => reject(new Error('Không đọc được file ảnh'));
        doc.onload = () => {
            const goc = doc.result;
            if (/svg|gif/.test(file.type) || goc.length < NGUONG_GIU_NGUYEN) return resolve(goc);

            const anh = new Image();
            anh.onerror = () => reject(new Error('File ảnh bị lỗi hoặc không đúng định dạng'));
            anh.onload = () => {
                const tiLe = Math.min(1, canhToiDa / Math.max(anh.width, anh.height));
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(anh.width * tiLe);
                canvas.height = Math.round(anh.height * tiLe);
                canvas.getContext('2d').drawImage(anh, 0, 0, canvas.width, canvas.height);
                const nen = canvas.toDataURL('image/webp', chatLuong);
                resolve(nen.length < goc.length ? nen : goc);
            };
            anh.src = goc;
        };
        doc.readAsDataURL(file);
    });

/**
 * Kiểm tra link ảnh admin dán vào. Trả về chuỗi báo lỗi, hoặc '' nếu hợp lệ / để trống.
 * Chấp nhận: https://..., đường dẫn nội bộ /images/..., ảnh base64 do chức năng tải từ máy tạo ra.
 */
export const loiLinkAnh = (link) => {
    const v = String(link || '').trim();
    if (!v) return '';
    if (v.startsWith('data:image/') || v.startsWith('/')) return '';
    if (v.startsWith('http://')) return 'Link bắt đầu bằng http:// sẽ bị trình duyệt chặn trên trang https. Hãy dùng link https://';
    if (!v.startsWith('https://')) return 'Link ảnh phải bắt đầu bằng https:// hoặc / (ví dụ /images/sp/ten-anh.jpg)';
    try {
        new URL(v);
    } catch {
        return 'Link ảnh chưa đúng định dạng';
    }
    return '';
};
