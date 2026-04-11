import type { AddFunc } from '@/cfg/types';
import { resolveDevtoolIntent } from '@dz-web/esboot-bundler-common';

export const addDevtool: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, sourceMap } = cfg.config;
  const devtool = resolveDevtoolIntent({ isDev, sourceMap });

  if (devtool) {
    webpackCfg.devtool = devtool;
  }
};
