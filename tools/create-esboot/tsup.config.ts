import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    dts: false,
    entry: ['src/cli.ts'],
  },
});
