import type { AddFunc } from '@/cfg/types';
import { resolveDevtoolIntent } from '@dz-web/esboot-bundler-common';

export const addDevtool: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, sourceMap } = cfg.config;
  if (isDev && !sourceMap) {
    webpackCfg.devtool = 'eval-cheap-module-source-map';
    return;
  }

  const devtool = resolveDevtoolIntent({ isDev, sourceMap });

  if (devtool) {
    webpackCfg.devtool = devtool;
  }
};
