import { defineConfig } from 'father';

export default defineConfig({
  // esm: { input: 'src/client' },
  extends: '../../.fatherrc.base.ts',
  alias: {
    '@@webpack/': './src/compiler/webpack/'
  },
});
