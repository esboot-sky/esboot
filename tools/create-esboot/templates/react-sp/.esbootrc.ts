import type { UserOptions } from '@dz-web/esboot';
import type { BundlerViteOptions } from '@dz-web/esboot-bundler-vite';
import { defineConfig } from '@dz-web/esboot';
import { BundlerVite, CodeSplittingType as CodeSplittingTypeVite } from '@dz-web/esboot-bundler-vite';
import vitestPlugin from '@dz-web/esboot-plugin-vitest';

export default defineConfig<BundlerViteOptions>(() => ({
  ...getBundlerViteOptions(),
  isSP: true,
  plugins: [
    vitestPlugin(),
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
          ],
        },
      },
    },
  };
}
