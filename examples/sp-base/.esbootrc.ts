import type { BundlerViteOptions as BundlerOptions } from '@dz-web/esboot-bundler-vite';
import { defineConfig, definePlugin, PluginHooks } from '@dz-web/esboot';
import { BundlerVite as Bundler } from '@dz-web/esboot-bundler-vite';
import pluginDocs from '@dz-web/esboot-plugin-docs';
import pluginVitest from '@dz-web/esboot-plugin-vitest';

export default defineConfig<BundlerOptions>({
  plugins: [
    pluginDocs(),
    pluginVitest(),
    definePlugin({
      key: 'test1',
      [PluginHooks.afterCompile]: (cfg) => {
        console.log(cfg.entry);
      },
    }),
  ],
  bundler: Bundler,
  isSP: true,
  bundlerOptions: {},
  sourceMap: false,
  alias: {
    '@@': 'src',
  },
  server: {
    port: 14000,
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
