/**
 * Cấu hình ESLint (phân tích tĩnh mã nguồn) cho Back-End.
 *  - Bộ luật nền: `eslint:recommended` — bắt biến chưa khai báo, code không bao giờ chạy tới, v.v.
 *  - `eslint-config-prettier` tắt các luật về định dạng để không xung đột với Prettier
 *    (định dạng do Prettier lo, ESLint chỉ lo lỗi logic).
 */
const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = [
    { ignores: ['node_modules/**', 'coverage/**', 'backup_db/**', 'scripts/**'] },
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'commonjs', // Back-End dùng require / module.exports
            globals: { ...globals.node }
        },
        rules: {
            // Biến khai báo mà không dùng → cảnh báo; tham số bắt đầu bằng "_" và `next` của Express được bỏ qua
            'no-unused-vars': ['warn', { argsIgnorePattern: '^(_|next$)', caughtErrors: 'none' }],
            // Luôn dùng === thay vì == để tránh ép kiểu ngầm
            eqeqeq: ['warn', 'always', { null: 'ignore' }],
            'no-var': 'error',
            'prefer-const': 'warn'
        }
    },
    {
        // Bộ kiểm thử Jest có thêm các biến toàn cục describe / test / expect...
        files: ['tests/**/*.js'],
        languageOptions: { globals: { ...globals.jest } }
    },
    prettier
];
