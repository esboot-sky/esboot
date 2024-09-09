import type { AddFunc } from '@/cfg/types';

const DEFAULT_DEVTOOL = 'cheap-module-source-map';

export const addDevtool: AddFunc = async function (cfg, rspackCfg) {
  const { isDev, sourceMap } = cfg.config;

  if (sourceMap) {
    rspackCfg.devtool = 'source-map';
    return;
  }

  if (isDev) {
    rspackCfg.devtool = DEFAULT_DEVTOOL;
  }
};
