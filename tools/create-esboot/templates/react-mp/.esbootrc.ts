import type { UserOptions } from '@dz-web/esboot';
import type { BundlerRspackOptions } from '@dz-web/esboot-bundler-rspack';
import type { BundlerViteOptions } from '@dz-web/esboot-bundler-vite';
import process from 'node:process';
import { defineConfig, definePlugin, PluginHooks } from '@dz-web/esboot';
import {
  BundlerRspack,
  CodeSplittingType as CodeSplittingTypeRspack,
} from '@dz-web/esboot-bundler-rspack';
import { BundlerVite, CodeSplittingType as CodeSplittingTypeVite } from '@dz-web/esboot-bundler-vite';
import vitestPlugin from '@dz-web/esboot-plugin-vitest';

const PX2REM_EXCLUDE = [/node_modules/];
const EXTRA_BABEL_INCLUDES = [
  /zustand/i,
  /query-string/i,
  /react-intl/i,
  /@tanstack/i,
  /@floating-ui/i,
  /tailwind-merge/i,
];

export default defineConfig<BundlerRspackOptions | BundlerViteOptions>(cfg => ({
  ...(process.env.ESBOOT_BUNDLER === 'rspack' ? getBundlerRspackOptions() : getBundlerViteOptions()),
  px2rem: {
    enable: true,
    // 设计稿为默认750, 浏览器以375为基准，16px是为了方便使用tailwindcss, 32px对应750px设计稿中的16px
    rootValue: cfg.isMobile ? 32 : 16,
    exclude: PX2REM_EXCLUDE,
  },
  define: {
    'process.env.isMobile': cfg.isMobile,
    'process.env.isBrowser': cfg.isBrowser,
  },
  plugins: [
    vitestPlugin(),
    definePlugin({
      key: 'log',
      [PluginHooks.afterCompile]: (cfg) => {
        const { isDev } = cfg;
        if (!isDev)
          return;

        console.log(cfg.entry);
      },
    }),
  ],
}));

const frameworkBundles = [
  '@dz-web/bridge',
  'dayjs',
  '@tanstack/react-query',
  'zustand',
  'lodash-es',
  '@dz-web/axios',
  '@dz-web/axios-middlewares',
  'axios',
  'react-intl',
];

function getBundlerViteOptions(): UserOptions<BundlerViteOptions> {
  return {
    bundler: BundlerVite,
    bundlerOptions: {
      customConfig: (viteConfig) => {
        viteConfig.optimizeDeps = { exclude: ['@dz-web/bridge', '@dz-web/bridge-core', '@dz-web/bridge-mock'] };
        return viteConfig;
      },
      codeSplitting: {
        jsStrategy: CodeSplittingTypeVite.granularChunks,
        jsStrategyOptions: {
          frameworkBundles,
        },
      },
    },
  };
}

function getBundlerRspackOptions(): UserOptions<BundlerRspackOptions> {
  return {
    bundler: BundlerRspack,
    bundlerOptions: {
      extraBabelIncludes: EXTRA_BABEL_INCLUDES,
      codeSplitting: {
        jsStrategy: CodeSplittingTypeRspack.granularChunks,
        jsStrategyOptions: {
          frameworkBundles,
        },
      },
    },
  };
}
