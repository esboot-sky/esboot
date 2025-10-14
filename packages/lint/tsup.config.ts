import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: ['src/eslint.ts', 'src/index.ts'],
  },
});
