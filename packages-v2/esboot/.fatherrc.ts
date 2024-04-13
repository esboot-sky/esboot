import { defineConfig } from 'father';

export default defineConfig({
  // esm: { input: 'src/client' },
  extends: '../../.fatherrc.base.ts',
  cjs: { input: 'src', output: 'dist' },
  prebundle: {},
  alias: {
    '@@/': './src/',
    '@@webpack/': './src/compiler/webpack/'
  },
});
