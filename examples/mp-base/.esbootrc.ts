import type { BundlerViteOptions as BundlerOptions } from '@dz-web/esboot-bundler-vite';
import { defineConfig, entryLogPlugin } from '@dz-web/esboot';
import { BundlerVite as Bundler, CodeSplittingType } from '@dz-web/esboot-bundler-vite';
import pluginVitest from '@dz-web/esboot-plugin-vitest';

export default defineConfig<BundlerOptions>((cfg) => ({
  plugins: [
    pluginVitest({
      customConfig: (config) => config,
    }),
    entryLogPlugin(),
  ],
  bundler: Bundler,
  bundlerOptions: {
    codeSplitting: {
      jsStrategy: CodeSplittingType.granularChunks,
      jsStrategyOptions: {
        frameworkBundles: ['dayjs'],
      },
    },
  },
  sourceMap: false,
  alias: {
    '@@': 'src',
  },
  // publicPath: '/test',
  server: {
    port: 4100,
    http2: true,
    https: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    ],
  },
  px2rem: {
    enable: true,
    rootValue: cfg.isMobile ? 32 : 16,
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
}));
