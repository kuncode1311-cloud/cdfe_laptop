// Helper dùng chung cho các smoke test: đăng nhập admin / khách hàng.
// Tài khoản lấy từ FE/.env.e2e.local (không commit).

async function dangNhap(page, email, matKhau) {
    await page.goto('/dang-nhap');
    await page.getByPlaceholder('email@example.com').fill(email);
    await page.getByPlaceholder('••••••••').fill(matKhau);
    await page.getByRole('button', { name: 'Đăng Nhập Vào Hệ Thống' }).click();
}

async function dangNhapAdmin(page) {
    const email = process.env.E2E_ADMIN_EMAIL;
    const matKhau = process.env.E2E_ADMIN_MATKHAU;
    if (!email || !matKhau) {
        throw new Error('Thiếu E2E_ADMIN_EMAIL / E2E_ADMIN_MATKHAU trong FE/.env.e2e.local');
    }
    await dangNhap(page, email, matKhau);
    await page.waitForURL('**/admin');
}

async function dangNhapKhachHang(page) {
    const email = process.env.E2E_KHACH_EMAIL;
    const matKhau = process.env.E2E_KHACH_MATKHAU;
    if (!email || !matKhau) {
        throw new Error('Thiếu E2E_KHACH_EMAIL / E2E_KHACH_MATKHAU trong FE/.env.e2e.local');
    }
    await dangNhap(page, email, matKhau);
    await page.waitForURL((url) => url.pathname === '/');
}

module.exports = { dangNhapAdmin, dangNhapKhachHang };
