import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    alias: {
      vitest1: resolve(__dirname, './node_modules/vitest'),
    },
  },
});
