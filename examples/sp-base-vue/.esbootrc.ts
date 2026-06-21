import type { BundlerViteOptions as BundlerOptions } from '@dz-web/esboot-bundler-vite';
import { defineConfig, definePlugin, PluginHooks } from '@dz-web/esboot';
import { BundlerVite as Bundler } from '@dz-web/esboot-bundler-vite';
import pluginDocs from '@dz-web/esboot-plugin-docs';
import pluginVitest from '@dz-web/esboot-plugin-vitest';
import pluginVue from '@dz-web/esboot-plugin-vue'

export default defineConfig<BundlerOptions>({
  plugins: [
    pluginDocs(),
    pluginVitest(),
    pluginVue(),
    definePlugin({
      key: 'test1',
      [PluginHooks.afterCompile]: (cfg) => {
        console.log(cfg.entry);
      },
    }),
  ],
  bundler: Bundler,
  isSP: true,
  bundlerOptions: {
    legacy: {
      enable: false,
    },
  },
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
