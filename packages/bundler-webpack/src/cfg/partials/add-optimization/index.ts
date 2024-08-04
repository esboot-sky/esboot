// import crypto from 'crypto';
// import TerserPlugin from 'terser-webpack-plugin';
// import { merge } from 'lodash';

import { addMinimizer } from './add-minimizer';

import type { AddFunc } from '@/cfg/types';

export const addOptimization: AddFunc = async function (cfg, webpackCfg) {
  const { isDev } = cfg.config;

  if (isDev) return;

  webpackCfg.optimization = {
    // splitChunks,
    emitOnErrors: true,
    usedExports: true,
    sideEffects: false,
    minimize: true,
  };

  await addMinimizer(cfg, webpackCfg);
};

// function isModuleCSS(module: { type: string }) {
//   return (
//     // mini-css-extract-plugin
//     module.type === `css/mini-extract` ||
//     // extract-css-chunks-webpack-plugin (old)
//     module.type === `css/extract-chunks` ||
//     // extract-css-chunks-webpack-plugin (new)
//     module.type === `css/extract-css-chunks`
//   );
// }
