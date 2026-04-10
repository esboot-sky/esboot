import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:4100',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command:
      'cd examples/sp-base && cross-env ESBOOT_BUNDLER=vite bun run sync-esbootrc.ts && perl -0pi -e "s/port: 4000/port: 4100/" .esbootrc.ts && pnpm exec esboot dev',
    url: 'http://127.0.0.1:4100/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
