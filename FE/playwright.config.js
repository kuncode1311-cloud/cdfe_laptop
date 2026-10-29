// @ts-check
const { defineConfig, devices } = require('@playwright/test');

try {
    process.loadEnvFile('.env.e2e.local');
} catch {
    // File chưa tồn tại (vd máy CI) -- test cần login sẽ tự báo lỗi thiếu biến môi trường.
}

module.exports = defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    retries: 0,
    workers: 1,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 60_000,
    },
});
