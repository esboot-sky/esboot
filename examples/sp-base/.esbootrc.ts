import { defineConfig } from '@dz-web/esboot';
import { BundlerVite } from '@dz-web/esboot-bundler-vite';

export default defineConfig({
  bundler: new BundlerVite({}),
  // analyze: true,
  // extraBabelIncludes: [
  //   /filter-obj/i,
  //   /immer/i,
  //   /zustand/i,
  //   /query-string/i,
  //   /react-intl/i,
  //   /d3-/i,
  //   /@tanstack/i,
  //   /@react-spring/i,
  //   /@floating-ui/i,
  // ],
});
