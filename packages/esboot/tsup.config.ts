import { defineConfig } from '../../tsup.base';

export default defineConfig({
  dev: {
    entry: ['src/index.ts', 'src/cli/index.ts'],
  },
});
