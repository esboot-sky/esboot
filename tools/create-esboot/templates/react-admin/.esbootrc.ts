import type { BundlerViteOptions } from '@dz-web/esboot-bundler-vite';
import { defineConfig } from '@dz-web/esboot';
import { BundlerVite, CodeSplittingType as CodeSplittingTypeVite } from '@dz-web/esboot-bundler-vite';
import pluginVitest from '@dz-web/esboot-plugin-vitest';

// import pluginQiankun from './config/plugins/qiankun';

export default defineConfig<BundlerViteOptions>(() => {
  return {
    isSP: true,
    plugins: [
      pluginVitest(),
      // pluginQiankun({
      //   name: 'account',
      //   port: 11102,
      //   publicPath: '/account/',
      // }),
    ],
    bundler: BundlerVite,
    bundlerOptions: {
      codeSplitting: {
        jsStrategy: CodeSplittingTypeVite.granularChunks,
        jsStrategyOptions: {
          frameworkBundles: [
            'dayjs',
            '@tanstack/react-query',
            'zustand',
            'lodash-es',
            '@dz-web/axios',
            '@dz-web/axios-middlewares',
            'axios',
            'react-intl',
            '@dz-web/antd-pro-components',
            '@loadable/component',
          ],
        },
      },
    },
  };
});
