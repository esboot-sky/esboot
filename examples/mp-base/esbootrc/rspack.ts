import { defineConfig, definePlugin, PluginHooks } from '@dz-web/esboot';
import { BundlerRspack as Bundler, type BundlerRspackOptions as BundlerOptions } from '@dz-web/esboot-bundler-rspack';

export default defineConfig<BundlerOptions>({
    plugins: [
    definePlugin({
      name: 'test1',
      [PluginHooks.afterCompile]: (cfg) => {
        console.log(cfg.entry);
      },
    }),
  ],
  bundler: Bundler,
  bundlerOptions: {},
  sourceMap: false,
  alias: {
    '@@': 'src',
  },
  server: {
    port: 14000,
    http2: false,
  },
});
