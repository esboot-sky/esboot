import type { SwcLoaderOptions } from '@rspack/core';

import type { AddFunc } from '@/cfg/types';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ReactRefreshRspackPlugin } from '@rspack/plugin-react-refresh';

import { getCssHashRule } from '@/cfg/rules/style/utils';

export const addReact: AddFunc = async (cfg, rspackCfg) => {
  const { isDev } = cfg.config;

  const wasmPluginPath = fileURLToPath(
    import.meta.resolve('@dz-web/rspack-plugin-stylename/transform.wasm'),
  );

  rspackCfg.module.rules.push({
    test: /\.tsx$/,
    use: [
      {
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            experimental: {
              plugins: [
                [wasmPluginPath, { hashPattern: getCssHashRule() }],
              ],
              cacheRoot: path.join(cfg.config.rootPath, 'node_modules/.cache/esboot/.swc'),
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
      },
    ],
    type: 'javascript/auto',
  });

  if (isDev) {
    rspackCfg.plugins.push(new ReactRefreshRspackPlugin());
  }
};
