/// <reference types="vitest" />
import { defineConfig, configDefaults } from 'vitest/config';
import { join, isAbsolute } from 'path';
import react from '@vitejs/plugin-react';
import { esbootConfig, registerTypescript, addDefine } from '@dz-web/esboot';

import { alias } from '../dist';

registerTypescript();
esbootConfig.initUserConfig();

const customTSConfigAlias = {};

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
    forceRerunTriggers: [
      ...configDefaults.forceRerunTriggers,
      '**/*.test.{ts,tsx}',
      '**/*.{ts,tsx}',
    ],
    environment: 'jsdom',
    alias: {
      ...alias,
      ...customTSConfigAlias,
    },
  },
});
