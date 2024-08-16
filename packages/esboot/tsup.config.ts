import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    entry: ['src/index.ts', 'src/cli/index.ts'],
  },
});
