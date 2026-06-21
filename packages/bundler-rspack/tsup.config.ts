import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: [
      'src/index.ts',
    ],
    target: 'esnext',
    esbuildOptions(options) {
      options.target = 'esnext';
    },
  },
});
