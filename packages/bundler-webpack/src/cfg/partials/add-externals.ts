import type { AddFunc } from '@/cfg/types';

export const addExternals: AddFunc = async (cfg, webpackCfg) => {
  const { externals } = cfg.config;

  if (externals) {
    webpackCfg.externals = externals;
  }
};
