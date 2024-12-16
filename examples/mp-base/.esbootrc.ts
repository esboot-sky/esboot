import { defineConfig } from '@dz-web/esboot';
import { BundlerVite as Bundler, type BundlerViteOptions as BundlerOptions  } from '@dz-web/esboot-bundler-vite';
import pluginVitest from '@dz-web/esboot-plugin-vitest';

export default defineConfig<BundlerOptions>({
  plugins: [
    pluginVitest(),
  ],
  bundler: Bundler,
  bundlerOptions: {},
  sourceMap: false,
  alias: {
    '@@': 'src',
  },
  server: {
    port: 4000,
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
