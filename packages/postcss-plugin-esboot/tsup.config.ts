import { defineConfig } from '../../tsup.base';

export default defineConfig({
  base: {
    // Prevent dynamic require issues with Node.js built-in modules
    noExternal: ['*'],
    format: ['esm'],
    // Tell tsup to bundle external Node.js modules
    external: []
  }
});
