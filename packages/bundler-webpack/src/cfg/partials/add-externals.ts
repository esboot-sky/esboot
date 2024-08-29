import type { AddFunc } from '@/cfg/types';

export const addExternals: AddFunc = async function (cfg, webpackCfg) {
  const { externals } = cfg.config;

  if (externals) {
    webpackCfg.externals = externals;
  }
};
