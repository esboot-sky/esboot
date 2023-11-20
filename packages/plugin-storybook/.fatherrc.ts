import { defineConfig } from 'father';

export default defineConfig({
  esm: {
    transformer: 'esbuild',
    overrides: {
      'src/index': {
        platform: 'browser',
      },
      'src/vitest': {
        platform: 'browser',
      },
      'src/testing-library-react': {
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
