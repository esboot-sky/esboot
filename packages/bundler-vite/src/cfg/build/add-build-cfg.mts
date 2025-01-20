import legacy from '@vitejs/plugin-legacy'
import { addJSMinimizer } from './optimization/add-js-minimizer.mts';
import { addCSSMinimizer } from './optimization/add-css-minimizer.mts';
import { addCodeSplitting } from './optimization/add-code-splitting.mts';
import { addBundleAnalyzerPlugin } from './plugins/add-plugin-bundle-analyzer.mts';
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
  viteCfg.plugins.push(legacy());

  if (minimize) {
    addJSMinimizer(cfg, viteCfg);
    addCSSMinimizer(cfg, viteCfg);
  }

  addCodeSplitting(cfg, viteCfg);
  await addBundleAnalyzerPlugin(cfg, viteCfg);
  // console.log(viteCfg.build);
};
