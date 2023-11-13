/// <reference types="vitest" />
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { esbootConfig, registerTypescript } from '@dz-web/esboot';

import { alias } from '../dist';

registerTypescript();
esbootConfig.initUserConfig();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    alias: {
      ...alias,
      ...esbootConfig.userOpts.alias,
    },
  },
});
