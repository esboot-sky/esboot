import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: {
      index: 'src/index.ts',
      'loaders/style-name-loader': 'src/loaders/style-name-loader.ts',
    },
    target: 'esnext',
    esbuildOptions(options) {
      options.target = 'esnext';
    },
  },
});
