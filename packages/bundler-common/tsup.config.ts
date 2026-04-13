import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    external: ['@tailwindcss/postcss', 'tailwindcss'],
  },
});
