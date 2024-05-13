import { defineConfig } from '@dz-web/esboot';
import { BundlerWebpack } from '@dz-web/esboot-bundler-webpack';

export default defineConfig({
  mfsu: false,
  bundler: new BundlerWebpack(),
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
