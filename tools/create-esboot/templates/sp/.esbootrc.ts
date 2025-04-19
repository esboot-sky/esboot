import { defineConfig, PluginHooks, definePlugin, type UserOptions } from '@dz-web/esboot';
import {
  BundlerWebpack,
  CodeSplittingType as CodeSplittingTypeWebpack,
} from '@dz-web/esboot-bundler-webpack';
import { BundlerVite, CodeSplittingType as CodeSplittingTypeVite } from '@dz-web/esboot-bundler-vite';
import type { BundlerWebpackOptions } from '@dz-web/esboot-bundler-webpack';
import type { BundlerViteOptions } from '@dz-web/esboot-bundler-vite';
import vitestPlugin from '@dz-web/esboot-plugin-vitest';
import docsPlugin from '@dz-web/esboot-plugin-docs';

export default defineConfig<BundlerWebpackOptions | BundlerViteOptions>((cfg) => ({
  ...(process.env.ESBOOT_BUNDLER === 'vite' ? getBundlerViteOptions() : getBundlerWebpackOptions(cfg)),
  isSP: true,
  plugins: [
    vitestPlugin(),
    docsPlugin(),
  ],
}));

function getBundlerViteOptions(): UserOptions<BundlerViteOptions> {
  return {
    bundler: BundlerVite,
    bundlerOptions: {
      codeSplitting: {
        jsStrategy: CodeSplittingTypeVite.granularChunks,
        jsStrategyOptions: {
          frameworkBundles: [
            '@dz-web/bridge',
            'dayjs',
            '@tanstack/react-query',
            'react-redux',
            '@reduxjs/toolkit',
            'zustand',
            'immer',
            'lodash',
            '@dz-web/axios',
            '@dz-web/axios-middlewares',
            'axios',
            'react-intl',
            '@loadable/component',
            'classnames',
          ],
        },
      },
    },
  };
}

function getBundlerWebpackOptions(cfg): UserOptions<BundlerWebpackOptions> {
  return {
    bundler: BundlerWebpack,
    bundlerOptions: {
      mfsu: false,
      extraBabelIncludes: [
        /filter-obj/i,
        /immer/i,
        /zustand/i,
        /query-string/i,
        /react-intl/i,
        /d3-/i,
        /@tanstack/i,
        /@react-spring/i,
        /@floating-ui/i,
        /radash/i,
        /tailwind-merge/i,
        /@radix-ui/i,
        /quote-client-s6/i,
      ],
      codeSplitting: {
        jsStrategy: CodeSplittingTypeWebpack.granularChunks,
        jsStrategyOptions: {
          // 为了提高首屏速度，我们把一些非常非常常用的库打进公共代码库里, 不常用的让跟着页面js加载，以免影响大部分小页面的加载与js解析速度
          frameworkBundles: [
            // 不要添加router进来，我们绝大多数页面都是嵌入到webview中用的小页面，不需要router，所以router不需要打进公共代码库里。会影响大部分页面的加载速度
            '@dz-web/bridge',
            'dayjs',
            '@tanstack/react-query',
            'redux',
            'redux-thunk',
            'react-redux',
            '@reduxjs/toolkit',
            'zustand',
            'immer',
            'lodash',
            'nanoid',
            '@dz-web/axios',
            '@dz-web/axios-middlewares',
            'axios',
            'react-intl',
            '@loadable/component',
            'classnames',
            'perfect-scrollbar',
          ],
        },
      },
    },
  };
}
