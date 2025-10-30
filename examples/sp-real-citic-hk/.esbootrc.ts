import { defineConfig, PluginHooks, definePlugin, type UserOptions } from '@dz-web/esboot';
import { BundlerWebpack, CodeSplittingType as CodeSplittingTypeWebpack } from '@dz-web/esboot-bundler-webpack';
import { BundlerVite, CodeSplittingType as CodeSplittingTypeVite } from '@dz-web/esboot-bundler-vite';
import type { BundlerWebpackOptions } from '@dz-web/esboot-bundler-webpack';
import type { BundlerViteOptions } from '@dz-web/esboot-bundler-vite';

export default defineConfig<BundlerWebpackOptions>(() => {
  const bundlerOptions = process.env.ESBOOT_BUNDLER === 'vite' ? getBundlerViteOptions() : getBundlerWebpackOptions();

  return {
    isSP: true,
    sourceMap: false,
    // minimize: false,
    plugins: [
      definePlugin({
        key: 'log',
        [PluginHooks.afterCompile]: (cfg) => {
          const { isDev } = cfg;
          if (!isDev) return;

          console.log(cfg.entry);
        },
      }),
    ],
    alias: {
      '@quote': 'src/modules/quote',
      '@page-ipo': 'src/modules/ipo',
      '@trade': 'src/modules/trade',
      '@page-trade': 'src/modules/trade/views/trade',
      '@page-home': 'src/modules/home',
      '@page-symbol-info': 'src/modules/quote/views/symbol-info',
    },
    svgr: true,
    useTailwindcss: true,
    px2rem: {
      enable: true,
      rootValue: 100,
      exclude: [/node_modules/],
    },
    useLangJsonPicker: true,
    ...bundlerOptions,
    server: {
      port: 11113,
    },
    experimental: {
      reactCompiler: {
        enable: true,
        target: '18',
      },
    },
  } as UserOptions<BundlerViteOptions | BundlerWebpackOptions>;
});

const getBundlerViteOptions = (): UserOptions<BundlerViteOptions> => {
  return {
    bundler: BundlerVite,
    sourceMap: false,
    bundlerOptions: {
      customConfig: (viteConfig) => {
        viteConfig.optimizeDeps = { exclude: ['@dz-web/bridge', '@dz-web/bridge-pingan'] };
        return viteConfig;
      },
      codeSplitting: {
        jsStrategy: CodeSplittingTypeVite.granularChunks,
        jsStrategyOptions: {
          frameworkBundles: [
            '@dz-web/bridge',
            'dayjs',
            '@tanstack/react-query',
            'zustand',
            '@dz-web/axios',
            'lodash-es',
            '@dz-web/axios-middlewares',
            'axios',
            'react-intl',
            '@dz-web/esboot-browser',
          ],
        },
      },
    },
  };
};

function getBundlerWebpackOptions(): UserOptions<BundlerWebpackOptions> {
  return {
    bundler: BundlerWebpack,
    // sourceMap: true,
    // minimize: true,
    bundlerOptions: {
      customConfig: (webpackConfig) => {
        webpackConfig.devServer.allowedHosts = ['all'];
        webpackConfig.devServer.headers = {
          'Access-Control-Allow-Origin': '*',
        };

        return webpackConfig;
      },
      mfsu: false,
      extraBabelIncludes: [
        /filter-obj/i,
        /zustand/i,
        /query-string/i,
        /react-intl/i,
        /@tanstack/i,
        /antd-mobile/i,
        '@dz-web/quote-client-react',
      ],
      codeSplitting: {
        jsStrategy: CodeSplittingTypeWebpack.granularChunks,
        jsStrategyOptions: {
          frameworkBundles: [
            '@dz-web/bridge',
            'dayjs',
            '@tanstack/react-query',
            'zustand',
            '@dz-web/axios',
            'lodash-es',
            '@dz-web/axios-middlewares',
            'axios',
            'react-intl',
            '@dz-web/esboot-browser',
          ],
        },
      },
    },
  };
}
