import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: [
      'src/index.mts',
      'src/plugins/react-style-name/transformStyleNameCreateElement.ts',
    ],
    format: ['esm', 'cjs'],
  },
});
