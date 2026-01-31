import type { AddFunc } from '@/cfg/types';

import {
  LightningCssMinimizerRspackPlugin,
  SwcJsMinimizerRspackPlugin,
} from '@rspack/core';

import { addCodeSplitting } from './code-splitting/add-code-splitting';

export const addOptimization: AddFunc = async (cfg, rspackCfg) => {
  const { isDev, minimize } = cfg.config;

  if (isDev)
    return;

  rspackCfg.optimization = {
    emitOnErrors: true,
    usedExports: true,
    sideEffects: true,
    moduleIds: 'deterministic',
    runtimeChunk: {
      name: 'runtime',
    },
    minimize,
    minimizer: [],
  };

  if (!minimize)
    return;

  rspackCfg.optimization.minimizer = [
    new SwcJsMinimizerRspackPlugin({
      minimizerOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
        mangle: true,
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

  await addCodeSplitting(cfg, rspackCfg);
};
