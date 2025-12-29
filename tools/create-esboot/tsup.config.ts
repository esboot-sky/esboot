import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    dts: false,
    legacyOutput: true,
    format: ['esm', 'cjs'],
    entry: ['src/cli.ts'],
  },
});
