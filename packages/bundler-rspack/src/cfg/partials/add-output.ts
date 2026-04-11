import type { AddFunc } from '@/cfg/types';
import { createOutputIntent } from '@dz-web/esboot-bundler-common';

export const addOutput: AddFunc = async (cfg, rspackCfg) => {
  const { cwd, isDev, publicPath, outputPath } = cfg.config;

  rspackCfg.output = createOutputIntent({
    cwd,
    isDev,
    publicPath,
    outputPath,
  });
};
