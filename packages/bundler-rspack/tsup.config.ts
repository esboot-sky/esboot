import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: [
      'src/index.ts',
      'src/loaders/style-name-loader.ts',
    ],
    target: 'esnext',
    esbuildOptions(options) {
      options.target = 'esnext';
    },
  },
});
