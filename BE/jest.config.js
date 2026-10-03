/**
 * Cấu hình Jest cho Back-End.
 *  - tests/unit:        kiểm thử đơn vị — từng hàm nhỏ, không cần database.
 *  - tests/integration: kiểm thử tích hợp — gọi API thật qua Supertest
 *                       với MongoDB chạy trong bộ nhớ (mongodb-memory-server).
 */
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    // Đặt biến môi trường giả TRƯỚC khi nạp bất kỳ module nào (JWT_SECRET, PayOS...)
    setupFiles: ['<rootDir>/tests/setup/bien-moi-truong.js'],
    // Lần đầu chạy, mongodb-memory-server cần tải MongoDB nên cho phép thời gian dài hơn
    testTimeout: 60000,
    // Chỉ đo độ phủ ở mã nghiệp vụ, bỏ qua script nạp dữ liệu và tài liệu
    collectCoverageFrom: ['controllers/**/*.js', 'middleware/**/*.js', 'utils/**/*.js', 'app.js'],
    coverageReporters: ['text-summary', 'lcov']
};
