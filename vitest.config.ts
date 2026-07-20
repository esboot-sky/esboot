import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'node',
    environment: 'node',
    projects: ['packages/*', 'tools/*'],
    testTimeout: 20000,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/templates/**',
      '**/fixtures/**',
      '**/vscode-extension-esboot/**',
      '**/create-esboot/lib/sync/**',
    ],
  },
});
