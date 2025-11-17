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
    pluginVue({
      jsxOptions: {
        enable: true,
      }
    }),
    definePlugin({
      key: 'test1',
      [PluginHooks.afterCompile]: (cfg) => {
        console.log(cfg.entry);
      },
    }),
  ],
  bundler: Bundler,
  isSP: true,
  svgr: false,
  bundlerOptions: {},
  sourceMap: false,
  alias: {
    '@@': 'src',
  },
  server: {
    port: 4000,
    http2: false,
    proxy: [
      {
        context: ['/api'],
        target: 'http://10.10.11.93:6003',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    ],
  },
});
