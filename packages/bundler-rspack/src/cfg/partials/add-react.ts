import type { SwcLoaderOptions } from '@rspack/core';

import type { AddFunc } from '@/cfg/types';

import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';

const TSX_RE = /\.tsx$/;

export const addReact: AddFunc = async (cfg, rspackCfg) => {
  const { isDev, experimental } = cfg.config;
  const reactCompiler = experimental?.reactCompiler;
  const swcReactCompiler = reactCompiler?.enable
    ? reactCompiler.target === '18'
      ? { target: '18' as const }
      : true
    : undefined;

  rspackCfg.module.rules.push({
    test: TSX_RE,
    use: [
      {
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
                development: isDev,
                refresh: isDev,
              },
              reactCompiler: swcReactCompiler,
            },
          },
        } satisfies SwcLoaderOptions,
      },
    ],
    type: 'javascript/auto',
  });

  if (isDev) {
    rspackCfg.plugins.push(new ReactRefreshRspackPlugin());
  }
};
