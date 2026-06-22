import type { BundlerRspackOptions as BundlerOptions } from '@dz-web/esboot-bundler-rspack';
import { defineConfig } from '@dz-web/esboot';
import { BundlerRspack as Bundler } from '@dz-web/esboot-bundler-rspack';
import pluginTailwind3 from '@dz-web/esboot-plugin-tailwind3';

export default defineConfig<BundlerOptions>({
  plugins: [
    pluginTailwind3(),
  ],
  bundler: Bundler,
  isSP: true,
  bundlerOptions: {
    extraBabelIncludes: [
      /filter-obj/i,
      /immer/i,
      /zustand/i,
      /query-string/i,
      /react-intl/i,
      /d3-/i,
      /@tanstack/i,
      /@react-spring/i,
      /@floating-ui/i,
    ],
  },
  sourceMap: false,
  alias: {
    '@@': 'src',
  },
  server: {
    port: 4006,
    http2: false,
  },
});
