import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: [
      'src/index.ts',
      'src/loaders/lang-json-picker/index.ts',
      'src/loaders/stylename/index.ts',
    ],
  },
});
