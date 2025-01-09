import { addJSMinimizer } from './optimization/add-js-minimizer.mts';
import { addCSSMinimizer } from './optimization/add-css-minimizer.mts';
import { addCodeSplitting } from './optimization/add-code-splitting.mts';
import type { AddFunc } from '@/cfg/types.mts';

export const addBuildCfg: AddFunc = async (cfg, viteCfg) => {
  const { sourceMap, outputPath, isDev, minimize = true } = cfg.config;

  if (isDev) return;

  if (!viteCfg.build) viteCfg.build = {};

  Object.assign(viteCfg.build, {
    emptyOutDir: true,
    copyPublicDir: false,
    sourcemap: sourceMap,
    outDir: outputPath,
    minify: minimize,
  });

  if (minimize) {
    addJSMinimizer(cfg, viteCfg);
    addCSSMinimizer(cfg, viteCfg);
  }

  addCodeSplitting(cfg, viteCfg);

  console.log(viteCfg.build);
};
