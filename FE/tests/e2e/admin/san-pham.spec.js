const { test, expect } = require('@playwright/test');
const { dangNhapAdmin } = require('../support/_fixtures');

// Smoke test cho Modal Thêm/Sửa sản phẩm (app/admin/san-pham/components/ModalSanPham.jsx) — modal lớn nhất, 4 tab.
// Vừa test CRUD vừa bấm qua toàn bộ tab + 7 loại ngành hàng + overlay xem trước để
// phát hiện sớm nếu có prop nào bị thiếu khi tách component (sẽ hiện ReferenceError trên console).
test('admin thêm, duyệt đủ 4 tab + 7 loại hàng, sửa rồi xoá được một sản phẩm', async ({ page }) => {
    test.setTimeout(60000);
    const loiConsole = [];
    page.on('pageerror', (err) => loiConsole.push(err.message));
    page.on('console', (msg) => {
        if (msg.type() === 'error') loiConsole.push(msg.text());
    });

    const tenSp = `E2E San Pham ${Date.now()}`;
    const tenSua = `${tenSp} Sua`;

    await dangNhapAdmin(page);
    await page.getByTitle('Kho Hàng & Danh Sách Sản Phẩm').click();

    await page.getByRole('button', { name: 'Thêm Sản Phẩm Mới' }).click();
    await expect(page.getByPlaceholder('Nhập tên sản phẩm đầy đủ và chi tiết...')).toBeVisible();

    // TAB 1: điền đủ các trường bắt buộc của sản phẩm mới
    await page.getByPlaceholder('Nhập tên sản phẩm đầy đủ và chi tiết...').fill(tenSp);
    await page.getByPlaceholder('VD: G834JYR-R9054W').fill(`E2E-${Date.now()}`);
    await page.locator('select').filter({ has: page.locator('option', { hasText: '-- Chọn hãng --' }) }).selectOption('asus');
    await page.getByRole('button', { name: 'Gaming', exact: true }).click();
    await page.getByRole('button', { name: 'Dán link' }).click();
    await page.getByPlaceholder('https://... hoặc /images/sp/...').fill('/images/khong-co-anh.svg');
    await page.getByPlaceholder('VD: 120000000').fill('12000000');
    await page.getByPlaceholder('VD: 109990000').fill('10000000');

    // TAB 2: duyệt qua cấu hình kỹ thuật của cả 7 loại ngành hàng
    await page.getByRole('button', { name: '2. Cấu Hình Chi Tiết' }).click();
    await expect(page.getByText('Đổi mẫu:')).toBeVisible({ timeout: 10000 });
    const chonLoai = page.locator('span:has-text("Đổi mẫu:") + select');
    for (const loai of ['ban_phim', 'chuot', 'balo', 'tai_nghe', 'sac_hub', 'linh_kien', 'laptop']) {
        await chonLoai.selectOption(loai);
    }

    // TAB 3: biến thể màu (chỉ cần mở tab, không bắt buộc thêm biến thể)
    await page.getByRole('button', { name: '3. Biến Thể Màu' }).click();

    // TAB 4: ảnh & bộ sưu tập
    await page.getByRole('button', { name: '4. Ảnh & Bộ Sưu Tập' }).click();

    // Xem trước card & trang chi tiết
    await page.getByTitle('Xem trước sản phẩm hiển thị ngoài web').click();
    await expect(page.getByText('Xem Trang Chi Tiết Sản Phẩm')).toBeVisible();
    await page.getByRole('button', { name: '1. Thẻ Card' }).click();
    await expect(page.getByText('Xem Thẻ Card Sản Phẩm')).toBeVisible();
    await page.getByRole('button', { name: '2. Trang Chi Tiết' }).click();
    await page.getByRole('button', { name: 'Quay Lại Chỉnh Sửa' }).click();

    // Quay lại Tab 1 rồi lưu sản phẩm
    await page.getByRole('button', { name: '1. Thông Tin & Giá' }).click();
    await page.getByRole('button', { name: 'Lưu Sản Phẩm' }).click();
    await expect(page.getByPlaceholder('Nhập tên sản phẩm đầy đủ và chi tiết...')).toBeHidden({ timeout: 10000 });

    const hang = (ten) => page.locator('tr').filter({ hasText: ten });
    await expect(hang(tenSp)).toBeVisible();

    // Sửa
    await hang(tenSp).getByTitle('Sửa sản phẩm').click();
    await expect(page.getByPlaceholder('Nhập tên sản phẩm đầy đủ và chi tiết...')).toBeVisible();
    await page.getByPlaceholder('Nhập tên sản phẩm đầy đủ và chi tiết...').fill(tenSua);
    await page.getByRole('button', { name: 'Lưu Sản Phẩm' }).click();
    await expect(page.getByPlaceholder('Nhập tên sản phẩm đầy đủ và chi tiết...')).toBeHidden({ timeout: 10000 });
    await expect(hang(tenSua)).toBeVisible();

    // Xoá để dọn dữ liệu test
    await hang(tenSua).getByTitle('Xóa vĩnh viễn sản phẩm').click();
    await page.getByRole('button', { name: 'Xóa Vĩnh Viễn', exact: true }).click();
    await expect(hang(tenSua)).toBeHidden({ timeout: 10000 });

    // Không có lỗi JS (vd ReferenceError do thiếu prop khi tách component) trong suốt luồng trên
    const loiNghiemTrong = loiConsole.filter((l) => !/favicon|hydration|preloaded using link preload/i.test(l));
    expect(loiNghiemTrong, `Có lỗi console: ${loiNghiemTrong.join('\n')}`).toEqual([]);
});
