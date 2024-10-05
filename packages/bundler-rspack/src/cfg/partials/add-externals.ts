import type { AddFunc } from '@/cfg/types';

export const addExternals: AddFunc = async (cfg, rspackCfg) => {
  const { externals } = cfg.config;

  if (externals) {
    rspackCfg.externals = externals;
  }
};
