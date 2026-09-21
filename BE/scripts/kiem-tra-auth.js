async function runAllTests() {
    console.log('🧪 BẮT ĐẦU CHẠY 12 BÀI KIỂM THỬ XÁC THỰC VÀ PHÂN QUYỀN:');
    const baseUrl = 'http://localhost:5000/api';
    let testPass = 0;
    let testFail = 0;

    function assert(condition, message) {
        if (condition) {
            console.log('  ✅ PASS:', message);
            testPass++;
        } else {
            console.error('  ❌ FAIL:', message);
            testFail++;
        }
    }

    try {
        // 1. Đăng ký user mới
        const testEmail = 'testuser_' + Date.now() + '@gmail.com';
        const regRes = await fetch(baseUrl + '/auth/dang-ky', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hoTen: 'Test User',
                email: testEmail,
                soDienThoai: '0988888888',
                matKhau: 'password123'
            })
        });
        const regData = await regRes.json();
        assert(regRes.status === 201 && regData.token && regData.nguoiDung.vaiTro === 'khach_hang', '1. Đăng ký tài khoản mới thành công (vaiTro = khach_hang)');
        const userToken = regData.token;

        // 2. Kiểm tra mật khẩu trong response không bị lộ
        assert(regData.nguoiDung.matKhau === undefined, '2. Không trả mật khẩu hay hash về Frontend');

        // 3. Đăng nhập đúng password
        const loginRes = await fetch(baseUrl + '/auth/dang-nhap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testEmail, matKhau: 'password123' })
        });
        const loginData = await loginRes.json();
        assert(loginRes.status === 200 && loginData.token, '3. Đăng nhập đúng mật khẩu thành công (200 OK + JWT Token)');

        // 4. Đăng nhập sai password
        const loginFailRes = await fetch(baseUrl + '/auth/dang-nhap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testEmail, matKhau: 'wrongpassword' })
        });
        assert(loginFailRes.status === 401, '4. Đăng nhập sai mật khẩu bị từ chối (401 Unauthorized)');

        // 5. GET /api/auth/toi không token
        const noTokenRes = await fetch(baseUrl + '/auth/toi');
        assert(noTokenRes.status === 401, '5. GET /api/auth/toi không token bị từ chối (401 Unauthorized)');

        // 6. GET /api/auth/toi có token
        const withTokenRes = await fetch(baseUrl + '/auth/toi', {
            headers: { 'Authorization': 'Bearer ' + userToken }
        });
        const withTokenData = await withTokenRes.json();
        assert(withTokenRes.status === 200 && withTokenData.nguoiDung.email === testEmail, '6. GET /api/auth/toi có token trả về thông tin cá nhân (200 OK)');

        // 7. User thường gọi DELETE /api/san-pham/test-id -> 403 Forbidden
        const userDeleteRes = await fetch(baseUrl + '/san-pham/test-id-123', {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + userToken }
        });
        assert(userDeleteRes.status === 403, '7. User thường xóa sản phẩm bị chặn (403 Forbidden - Chỉ Admin)');

        // 8. Không token gọi DELETE /api/san-pham/test-id -> 401 Unauthorized
        const guestDeleteRes = await fetch(baseUrl + '/san-pham/test-id-123', {
            method: 'DELETE'
        });
        assert(guestDeleteRes.status === 401, '8. Khách không token xóa sản phẩm bị chặn (401 Unauthorized)');

        // 9. Đăng nhập tài khoản Admin và thực hiện thao tác quản trị
        const adminLoginRes = await fetch(baseUrl + '/auth/dang-nhap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@laptopnew.vn', matKhau: 'admin123' })
        });
        const adminLoginData = await adminLoginRes.json();
        assert(adminLoginRes.status === 200 && adminLoginData.nguoiDung.vaiTro === 'admin', '9a. Đăng nhập Admin thành công');
        const adminToken = adminLoginData.token;

        // Admin tạo sản phẩm thử nghiệm
        const addProdRes = await fetch(baseUrl + '/san-pham', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + adminToken },
            body: JSON.stringify({
                id: 'test-laptop-rbac-' + Date.now(),
                ma_san_pham: 'SKU-TEST-RBAC',
                ten_san_pham: 'Test Laptop RBAC Security 2026',
                hang_san_xuat: 'asus',
                gia_khuyen_mai: 25000000,
                hinh_anh_chinh: '/images/test.jpg'
            })
        });
        const addProdData = await addProdRes.json();
        assert(addProdRes.status === 201, '9b. Admin thêm sản phẩm thành công (201 Created)');

        // Admin xóa sản phẩm thử nghiệm
        const delProdRes = await fetch(baseUrl + '/san-pham/' + addProdData.id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + adminToken }
        });
        assert(delProdRes.status === 200, '9c. Admin xóa sản phẩm thành công (200 OK)');

        // 10. JWT sai / giả mạo
        const fakeTokenRes = await fetch(baseUrl + '/auth/toi', {
            headers: { 'Authorization': 'Bearer fake.jwt.token.123456' }
        });
        assert(fakeTokenRes.status === 401, '10. Token giả mạo bị từ chối (401 Unauthorized)');

        // 11. Các route xem sản phẩm công khai vẫn hoạt động bình thường
        const publicRes = await fetch(baseUrl + '/san-pham');
        assert(publicRes.status === 200, '11. API GET /api/san-pham xem công khai không cần token (200 OK)');

        // 12. Chặn leo quyền
        const hackRegRes = await fetch(baseUrl + '/auth/dang-ky', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hoTen: 'Hacker',
                email: 'hacker_' + Date.now() + '@gmail.com',
                matKhau: 'hacker123',
                vaiTro: 'admin'
            })
        });
        const hackRegData = await hackRegRes.json();
        assert(hackRegData.nguoiDung.vaiTro === 'khach_hang', '12. Chặn leo quyền: Tự gửi vaiTro=admin khi đăng ký vẫn bị ép về khach_hang');

        console.log('\n=============================================');
        console.log(`🎉 TỔNG KẾT: ${testPass} / 12 KIỂM THỬ THÀNH CÔNG (FAIL: ${testFail})`);
        console.log('=============================================');
    } catch (err) {
        console.error('Lỗi khi chạy bài kiểm thử:', err);
    }
}

runAllTests();
