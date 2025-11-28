import type { AddFunc } from '@/cfg/types';
import { addCSSMinimizer } from './add-css-minimizer';
import { addJSMinimizer } from './add-js-minimizer';

import { addCodeSplitting } from './code-splitting/add-code-splitting';

export const addOptimization: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, minimize } = cfg.config;

  if (isDev)
    return;

  webpackCfg.optimization = {
    // splitChunks,
    emitOnErrors: true,
    usedExports: true,
    sideEffects: true,
    // For fixing the moduleID is not number
    moduleIds: 'natural',
    minimize,
    minimizer: [],
  };

  if (!minimize)
    return;
  await addJSMinimizer(cfg, webpackCfg);
  await addCSSMinimizer(cfg, webpackCfg);
  await addCodeSplitting(cfg, webpackCfg);
};
