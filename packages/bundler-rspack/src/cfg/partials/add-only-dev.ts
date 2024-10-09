import type { AddFunc } from '@/cfg/types';

export const addOnlyDev: AddFunc = async (cfg, rspackCfg) => {
  const { isDev } = cfg.config;

  if (!isDev) return;
  
  Object.assign(rspackCfg, {
    stats: 'errors-only',
    infrastructureLogging: {
      level: 'error',
    },
  });
};
