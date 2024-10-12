import { defineConfig } from '@dz-web/esboot';
import { BundlerRspack as Bundler, type BundlerRspackOptions as BundlerOptions } from '@dz-web/esboot-bundler-rspack';

export default defineConfig<BundlerOptions>({
  bundler: Bundler,
  isSP: true,
  bundlerOptions: {},
  sourceMap: false,
  alias: {
    '@@': 'src',
  },
  server: {
    port: 4001,
    http2: false,
  },
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
