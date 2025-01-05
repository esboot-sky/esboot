import { addJSMinimizer } from './optimization/add-js-minimizer.mts';

import type { AddFunc } from '@/cfg/types.mts';

export const addBuildCfg: AddFunc = async (cfg, viteCfg) => {
  const { sourceMap, outputPath, isDev } = cfg.config;

  if (isDev) return;

  viteCfg.build = {
    emptyOutDir: true,
    copyPublicDir: false,
    sourcemap: sourceMap,
    outDir: outputPath,
  };

  addJSMinimizer(cfg, viteCfg);

  console.log(viteCfg.build);
};
