import { defineConfig } from '../../tsdown.base';

export default defineConfig({
  base: {
    external: ['postcss', 'tailwindcss'],
  },
});
