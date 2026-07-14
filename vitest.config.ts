import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'node',
    environment: 'node',
    projects: ['packages/*', 'tools/*'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/templates/**', '**/fixtures/**'],
  },
});
