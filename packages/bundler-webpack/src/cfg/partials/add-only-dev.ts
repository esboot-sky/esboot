import type { AddFunc } from '@/cfg/types';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

export const addOnlyDev: AddFunc = async (cfg, webpackCfg) => {
  const { isDev } = cfg.config;

  if (!isDev)
    return;

  Object.assign(webpackCfg, {
    stats: 'errors-only',
    infrastructureLogging: {
      level: 'error',
    },
  });

  webpackCfg.plugins.push(new ReactRefreshWebpackPlugin({ overlay: false }));
};
