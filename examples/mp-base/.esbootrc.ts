import { defineConfig } from '@dz-web/esboot';
import { BundlerRspack as Bundler, type BundlerRspackOptions as BundlerOptions } from '@dz-web/esboot-bundler-rspack';

export default (cfg) => defineConfig<BundlerOptions>({
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
  define: {
    'process.env.isMobile': JSON.stringify(cfg.isMobile),
    'process.env.isBrowser': JSON.stringify(cfg.isBrowser),
  },
});
