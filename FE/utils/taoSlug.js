export const taoSlug = (giaTri = '') => String(giaTri)
    .trim()
    .toLowerCase()
    .replace(/đ/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const slugSanPham = (sanPham = {}) => sanPham.slug || sanPham.id || sanPham._id;
export const slugTinTuc = (tin = {}) => tin.slug || taoSlug(tin.tieu_de) || tin.id || tin._id;
