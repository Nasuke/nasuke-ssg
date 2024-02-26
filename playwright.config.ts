import type { PlaywrightTestConfig } from '@playwright/test';

// 创建测试项目 - 启动测试项目 - 无头浏览器访问

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  timeout: 50000,
  webServer: {
    url: 'http://localhost:5173',
    command: 'pnpm prepare:e2e' // 启动测试项目
  },
  use: {
    headless: true
  }
};

export default config;
