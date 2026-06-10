import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: [
      'src/index.ts',
      'src/alias.ts',
      'src/options.ts',
    ],
    splitting: false,
  },
});
