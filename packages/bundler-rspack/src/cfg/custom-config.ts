import type { AddFunc } from '@/cfg/types';
import type { BundlerRspackOptions } from '@/types';
import { isFunction } from '@dz-web/esboot-common/lodash';

export const customConfig: AddFunc = async (cfg, rspackCfg) => {
  const { bundlerOptions } = cfg.config;
  const { customConfig } = bundlerOptions as BundlerRspackOptions;

  if (!customConfig || !isFunction(customConfig)) return;

  rspackCfg = customConfig(rspackCfg, cfg.config);
};

