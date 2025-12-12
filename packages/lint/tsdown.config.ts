import { defineConfig } from '../../tsdown.base';

export default defineConfig({
  base: {
    entry: ['src/eslint.ts', 'src/index.ts'],
  },
});
