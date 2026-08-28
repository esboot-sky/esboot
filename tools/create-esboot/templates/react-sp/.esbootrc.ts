import type { BundlerViteOptions } from '@dz-web/esboot-bundler-vite';
import { CodeSplittingType, defineConfig, entryLogPlugin } from '@dz-web/esboot';
import { BundlerVite } from '@dz-web/esboot-bundler-vite';
import vitestPlugin from '@dz-web/esboot-plugin-vitest';

export default defineConfig<BundlerViteOptions>(() => ({
  bundler: BundlerVite,
  isSP: true,
  codeSplitting: {
    jsStrategy: CodeSplittingType.granularChunks,
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
  plugins: [
    vitestPlugin(),
    entryLogPlugin(),
  ],
}));
