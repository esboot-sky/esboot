import { defineConfig } from '@dz-web/esboot';
import { BundlerVite } from '@dz-web/esboot-bundler-vite';
import { BundlerWebpack } from '@dz-web/esboot-bundler-webpack';

export default defineConfig({
  // bundler: new BundlerVite({}),
  bundler: BundlerWebpack as any,
  sourceMap: false,
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
