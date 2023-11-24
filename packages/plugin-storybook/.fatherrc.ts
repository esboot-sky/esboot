import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    transformer: 'esbuild',
    overrides: {
      'src/index': {
        platform: 'browser',
      },
    },
  },
  cjs: { input: 'src', output: 'dist' },
  prebundle: {},
  alias: {
    '@@/': './src/',
  },
});
