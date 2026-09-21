/**
 * Chuyển tiếng Việt có dấu thành slug dùng cho URL.
 */
const taoSlug = (giaTri = '') => String(giaTri)
    .trim()
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

module.exports = taoSlug;
