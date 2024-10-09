import {
  SwcJsMinimizerRspackPlugin,
  LightningCssMinimizerRspackPlugin,
} from '@rspack/core';
// import { addCodeSplitting } from './code-splitting/add-code-splitting';

import type { AddFunc } from '@/cfg/types';

export const addOptimization: AddFunc = async (cfg, rspackCfg) => {
  const { isDev, minimize } = cfg.config;

  if (isDev) return;

  rspackCfg.optimization = {
    // splitChunks,
    emitOnErrors: true,
    usedExports: true,
    sideEffects: false,
    minimize,
    minimizer: [],
  };

  if (!minimize) return;

  rspackCfg.optimization.minimizer = [
    new SwcJsMinimizerRspackPlugin({
      minimizerOptions: {
        format: {
          comments: false,
        },
      },
    }),
    new LightningCssMinimizerRspackPlugin({
      minimizerOptions: {
        errorRecovery: false,
      },
    }),
  ];

  // await addCodeSplitting(cfg, rspackCfg);
};
