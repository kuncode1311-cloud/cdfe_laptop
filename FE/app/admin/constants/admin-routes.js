// Khai báo tập trung toàn bộ route admin và mã tab cũ.
export const ADMIN_ROUTES = [
    {
        "tab": "tong_quan",
        "path": "/admin/tong-quan"
    },
    {
        "tab": "don_hang",
        "path": "/admin/don-hang"
    },
    {
        "tab": "san_pham",
        "path": "/admin/san-pham"
    },
    {
        "tab": "danh_muc",
        "path": "/admin/danh-muc"
    },
    {
        "tab": "khach_hang",
        "path": "/admin/khach-hang"
    },
    {
        "tab": "voucher",
        "path": "/admin/voucher"
    },
    {
        "tab": "tin_tuc",
        "path": "/admin/tin-tuc"
    },
    {
        "tab": "khuyen_mai",
        "path": "/admin/khuyen-mai"
    },
    {
        "tab": "showroom",
        "path": "/admin/showroom"
    },
    {
        "tab": "lien_he",
        "path": "/admin/lien-he"
    },
    {
        "tab": "danh_gia",
        "path": "/admin/danh-gia"
    },
    {
        "tab": "bao_hanh",
        "path": "/admin/bao-hanh"
    }
];

export function layDuongDanAdmin(tab) {
    return ADMIN_ROUTES.find(route => route.tab === tab)?.path || '/admin/tong-quan';
}

export function layTabTheoDuongDan(pathname) {
    return ADMIN_ROUTES.find(route => route.path === pathname)?.tab || 'tong_quan';
}
