import { defineConfig } from '../../tsdown.base';

export default defineConfig({
  base: {
    dts: false,
    entry: ['src/cli.ts'],
    format: ['cjs'],
  },
});
