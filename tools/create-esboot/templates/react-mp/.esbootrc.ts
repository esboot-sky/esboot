import type { BabelPlugin, UserOptions } from '@dz-web/esboot';
import type { BundlerViteOptions } from '@dz-web/esboot-bundler-vite';
import type { BundlerWebpackOptions } from '@dz-web/esboot-bundler-webpack';
import process from 'node:process';
import { defineConfig, definePlugin, PluginHooks } from '@dz-web/esboot';
import { BundlerVite, CodeSplittingType as CodeSplittingTypeVite } from '@dz-web/esboot-bundler-vite';
import {
  BundlerWebpack,
  CodeSplittingType as CodeSplittingTypeWebpack,
  getImportPluginsOfRsuite,
} from '@dz-web/esboot-bundler-webpack';
import vitestPlugin from '@dz-web/esboot-plugin-vitest';

export default defineConfig<BundlerWebpackOptions | BundlerViteOptions>(cfg => ({
  ...(process.env.ESBOOT_BUNDLER === 'webpack' ? getBundlerWebpackOptions(cfg) : getBundlerViteOptions()),
  px2rem: {
    enable: true,
    // 设计稿为默认750, 浏览器以375为基准，16px是为了方便使用tailwindcss, 32px对应750px设计稿中的16px
    rootValue: cfg.isMobile ? 32 : 16,
    exclude: ['node_modules'],
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

function getBundlerWebpackOptions(cfg): UserOptions<BundlerWebpackOptions> {
  const extraBabelPlugins: BabelPlugin[] = [];
  if (!cfg.isMobile) {
    extraBabelPlugins.push(getImportPluginsOfRsuite([]));
  }

  return {
    bundler: BundlerWebpack,
    bundlerOptions: {
      mfsu: false,
      extraBabelPlugins,
      extraBabelIncludes: [
        /zustand/i,
        /query-string/i,
        /react-intl/i,
        /@tanstack/i,
        /@floating-ui/i,
        /tailwind-merge/i,
      ],
      codeSplitting: {
        jsStrategy: CodeSplittingTypeWebpack.granularChunks,
        jsStrategyOptions: {
          frameworkBundles,
        },
      },
    },
  };
}
