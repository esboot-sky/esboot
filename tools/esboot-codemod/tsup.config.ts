import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    dts: false,
    format: ['esm'],
    entry: ['src/cli.ts'],
  },
});
