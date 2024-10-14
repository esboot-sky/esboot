// import { resolve } from 'node:path';
import type { AddFunc } from '@/cfg/types';
import type { SwcLoaderOptions } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';

export const addReact: AddFunc = async (cfg, rspackCfg) => {
  const { isDev } = cfg.config;

  rspackCfg.module.rules.push({
    test: /\.tsx$/,
    use: [
      // custom loader transform react
      // {
      //   loader: resolve(__dirname, 'loaders/stylename/index.js'),
      //   options: {
      //     config: cfg.config,
      //   },
      // },
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
            },
          },
        } satisfies SwcLoaderOptions,
      }
    ],
    type: 'javascript/auto',
  });

  if (isDev) {
    rspackCfg.plugins.push(new ReactRefreshPlugin());
  }
};
