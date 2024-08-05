import { addJSMinimizer } from './add-js-minimizer';
import { addCSSMinimizer } from './add-css-minimizer';

import type { AddFunc } from '@/cfg/types';

export const addOptimization: AddFunc = async function (cfg, webpackCfg) {
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
};
