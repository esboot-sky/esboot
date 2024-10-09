import type { AddFunc } from '@/cfg/types';

export const addCache: AddFunc = async (cfg, rspackCfg) => {
  const { isDev, isCIBuild } = cfg.config;

  if (isDev || isCIBuild) return;

  rspackCfg.optimization = {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
  };
};
