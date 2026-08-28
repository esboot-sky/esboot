import type { UserOptions } from '@dz-web/esboot';
import type { BundlerRspackOptions } from '@dz-web/esboot-bundler-rspack';
import type { BundlerViteOptions } from '@dz-web/esboot-bundler-vite';
import process from 'node:process';
import { CodeSplittingType, defineConfig, entryLogPlugin } from '@dz-web/esboot';
import { BundlerRspack } from '@dz-web/esboot-bundler-rspack';
import { BundlerVite } from '@dz-web/esboot-bundler-vite';
import vitestPlugin from '@dz-web/esboot-plugin-vitest';

const PX2REM_EXCLUDE = [/node_modules/];

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
  codeSplitting: {
    jsStrategy: CodeSplittingType.granularChunks,
    jsStrategyOptions: {
      frameworkBundles,
    },
  },
  px2rem: {
    enable: true,
    // 设计稿为默认750, 浏览器以375为基准，16px是为了方便使用tailwindcss, 32px对应750px设计稿中的16px
    rootValue: cfg.isMobile ? 32 : 16,
    exclude: PX2REM_EXCLUDE,
  },
  plugins: [
    vitestPlugin(),
    entryLogPlugin(),
  ],
}));

function getBundlerViteOptions(): UserOptions<BundlerViteOptions> {
  return {
    bundler: BundlerVite,
  };
}

function getBundlerRspackOptions(): UserOptions<BundlerRspackOptions> {
  return {
    bundler: BundlerRspack,
    bundlerOptions: {
      extraBabelIncludes: EXTRA_BABEL_INCLUDES,
    },
  };
}
