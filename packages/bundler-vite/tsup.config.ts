import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: [
      'src/index.ts',
      'src/plugins/react-style-name/transformStyleNameCreateElement.ts',
    ],
  },
});
