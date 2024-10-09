import type { AddFunc } from '@/cfg/types';

const DEFAULT_DEVTOOL = 'cheap-module-source-map';

export const addDevtool: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, sourceMap } = cfg.config;

  if (sourceMap) {
    webpackCfg.devtool = 'source-map';
    return;
  }

  if (isDev) {
    webpackCfg.devtool = DEFAULT_DEVTOOL;
  }
};
