import type { AddFunc } from '@/cfg/types';
import { createOutputIntent } from '@dz-web/esboot-bundler-common';

export const addOutput: AddFunc = async (cfg, webpackCfg) => {
  const { cwd, isDev, publicPath, outputPath } = cfg.config;

  webpackCfg.output = createOutputIntent({
    cwd,
    isDev,
    publicPath,
    outputPath,
  });
};
