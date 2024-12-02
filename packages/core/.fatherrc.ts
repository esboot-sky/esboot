import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
    output: 'dist/cjs',
  },
  esm: {
    output: 'dist/esm',
  },
});
