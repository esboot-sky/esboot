/// <reference types="vitest" />
import { defineConfig, configDefaults } from 'vitest/config';
import { join, isAbsolute } from 'path';
import react from '@vitejs/plugin-react';
import { esbootConfig, registerTypescript, addDefine } from '@dz-web/esboot';

import { alias } from '../dist';

registerTypescript();
esbootConfig.initUserConfig();

const customTSConfigAlias: Record<string, string> = {};

const { alias: esbootAlias } = esbootConfig.userOpts;
for (let k in esbootAlias) {
  const rawValue = esbootAlias[k];
  const isAbsoluteValue = isAbsolute(rawValue);
  // FIX: Use Options
  const key = isAbsoluteValue ? k : `${k}`;
  const value = isAbsoluteValue
    ? rawValue
    : join(process.cwd(), `./${rawValue}`);

  customTSConfigAlias[key] = value;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: addDefine(),
  test: {
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    forceRerunTriggers: [
      ...configDefaults.forceRerunTriggers,
      '**/*.test.{ts,tsx}',
      '**/*.{ts,tsx}',
    ],
    setupFiles: [join(__dirname, './setup.ts')],
    environment: 'jsdom',
    // globals: true,
    alias: {
      ...alias,
      ...customTSConfigAlias,
    },
  },
});
