import { defineConfig } from '@dz-web/esboot';
import { BundlerVite as Bundler, type BundlerViteOptions as BundlerOptions  } from '@dz-web/esboot-bundler-vite';
import pluginVitest from '@dz-web/esboot-plugin-vitest';

export default defineConfig<BundlerOptions>((cfg) => ({
  plugins: [
    pluginVitest(),
  ],
  bundler: Bundler,
  bundlerOptions: {},
  sourceMap: false,
  alias: {
    '@@': 'src',
  },
  // publicPath: '/test',
  server: {
    port: 4000,
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
    // 设计稿为默认750, 浏览器以375为基准，16px是为了方便使用tailwindcss, 32px对应750px设计稿中的16px
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
