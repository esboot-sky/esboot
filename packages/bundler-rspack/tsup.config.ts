import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: [
      'src/index.ts',
      'src/loaders/lang-json-picker/index.ts',
      'src/loaders/import-locales-loader/index.ts',
      // 'src/loaders/stylename/index.ts',
    ],
    target: 'esnext',
    esbuildOptions(options) {
      options.target = 'esnext';
    },
  },
});
