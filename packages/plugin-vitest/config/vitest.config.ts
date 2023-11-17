/// <reference types="vitest" />
import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { esbootConfig, registerTypescript } from '@dz-web/esboot';

import { alias } from '../dist';

registerTypescript();
esbootConfig.initUserConfig();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    forceRerunTriggers: [...configDefaults.forceRerunTriggers, '**/*.test.{ts,tsx}', '**/*.{ts,tsx}'],
    environment: 'jsdom',
    alias: {
      ...alias,
      ...esbootConfig.userOpts.alias,
    },
  },
});
