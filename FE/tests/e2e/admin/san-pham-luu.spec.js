const { test, expect } = require('@playwright/test');

test('lưu sản phẩm thành công dù lượt tải lại danh sách bị lỗi', async ({ page }) => {
    const sanPham = {
        id: 'sp-test', ma_san_pham: 'SKU-TEST', ten_san_pham: 'Sản phẩm thử',
        loai_san_pham: 'laptop', hang_san_xuat: 'asus', danh_muc: ['gaming'],
        gia_goc: 12000000, gia_khuyen_mai: 10000000,
        hinh_anh_chinh: '/images/khong-co-anh.svg', so_luong_ton_kho: 2,
        con_hang: true, thong_so: {}
    };
    let daLuu = false;

    await page.addInitScript(() => {
        localStorage.setItem('tnt_laptop_token', 'test-token');
        localStorage.setItem('tnt_laptop_user', JSON.stringify({ id: 'admin-test', vaiTro: 'admin' }));
    });
    await page.route('**/api/**', async (route) => {
        const path = new URL(route.request().url()).pathname;
        if (path.endsWith('/auth/toi')) {
            return route.fulfill({ json: { nguoiDung: { id: 'admin-test', vaiTro: 'admin' } } });
        }
        if (path.endsWith('/san-pham/sp-test') && route.request().method() === 'PUT') {
            daLuu = true;
            return route.fulfill({ json: { ...sanPham, ...route.request().postDataJSON() } });
        }
        if (path.endsWith('/san-pham')) {
            if (daLuu) return route.fulfill({ status: 503, json: { thong_diep: 'Tải danh sách thất bại' } });
            return route.fulfill({ json: [sanPham] });
        }
        if (path.endsWith('/danh-muc')) {
            return route.fulfill({ json: [
                { id: 'asus', ma_danh_muc: 'asus', ten_danh_muc: 'ASUS', loai: 'thuong_hieu', kich_hoat: true },
                { id: 'gaming', ma_danh_muc: 'gaming', ten_danh_muc: 'Gaming', loai: 'nhu_cau', kich_hoat: true }
            ] });
        }
        return route.fulfill({ json: [] });
    });

    await page.goto('/admin/san-pham');
    await page.getByRole('row').filter({ hasText: 'Sản phẩm thử' }).getByTitle('Sửa sản phẩm').click();
    await expect(page.getByPlaceholder('Nhập tên sản phẩm đầy đủ và chi tiết...')).toBeVisible();
    const taiLaiLoi = page.waitForResponse((res) =>
        new URL(res.url()).pathname.endsWith('/san-pham') && res.status() === 503
    );
    await page.getByRole('button', { name: 'Lưu Sản Phẩm' }).click();
    await taiLaiLoi;
    await expect(page.getByPlaceholder('Nhập tên sản phẩm đầy đủ và chi tiết...')).toBeHidden();
    await expect(page.getByText('Không Thể Lưu Sản Phẩm')).toHaveCount(0);
    await expect(page.getByRole('row').filter({ hasText: 'Sản phẩm thử' })).toBeVisible();
    expect(daLuu).toBe(true);
});
