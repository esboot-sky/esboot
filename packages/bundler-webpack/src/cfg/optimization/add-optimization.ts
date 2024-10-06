import { addJSMinimizer } from './add-js-minimizer';
import { addCSSMinimizer } from './add-css-minimizer';
import { addCodeSplitting } from './code-splitting/add-code-splitting';

import type { AddFunc } from '@/cfg/types';

export const addOptimization: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, minimize } = cfg.config;

  if (isDev) return;

  webpackCfg.optimization = {
    // splitChunks,
    emitOnErrors: true,
    usedExports: true,
    sideEffects: false,
    minimize,
    minimizer: [],
  };

  if (!minimize) return;
  await addJSMinimizer(cfg, webpackCfg);
  await addCSSMinimizer(cfg, webpackCfg);
  await addCodeSplitting(cfg, webpackCfg);
};
