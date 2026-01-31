import type { SwcLoaderOptions } from '@rspack/core';
import type { AddFunc } from '@/cfg/types';

export const addJavaScriptRules: AddFunc = async (cfg, rspackCfg) => {
  const { isDev } = cfg.config;

  rspackCfg.module.rules.push({
    test: /\.(j|t)s$/,
    exclude: [
      /[\\/]node_modules[\\/]/,
      /[\\/]packages[\\/].*[\\/]dist[\\/]/,
    ],
    loader: 'builtin:swc-loader',
    options: {
      jsc: {
        parser: {
          syntax: 'typescript',
        },
        externalHelpers: false,
        transform: {
          react: {
            runtime: 'automatic',
            development: isDev,
            refresh: isDev,
          },
        },
      },
    } satisfies SwcLoaderOptions,
    type: 'javascript/auto',
  });
};
