import type { AddFunc } from '@/cfg/types';
import type { BundlerWebpackOptions } from '@/types';
import { isFunction } from '@dz-web/esboot-common/lodash';

export const customConfig: AddFunc = async (cfg, webpackCfg) => {
  const { bundlerOptions } = cfg.config;
  const { customConfig } = bundlerOptions as BundlerWebpackOptions;

  if (!customConfig || !isFunction(customConfig)) return;

  webpackCfg = customConfig(webpackCfg, cfg.config);
};
