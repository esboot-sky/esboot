import type { AddFunc } from '@/cfg/types';
import {
  createRuntimeOptimizationIntent,
  shouldEnableCacheIntent,
} from '@dz-web/esboot-bundler-common';

export const addCache: AddFunc = async (cfg, rspackCfg) => {
  const { isDev, isCIBuild } = cfg.config;

  if (!shouldEnableCacheIntent({ isDev, isCIBuild })) {
    return;
  }

  rspackCfg.optimization = createRuntimeOptimizationIntent();
};
