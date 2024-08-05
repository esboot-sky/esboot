import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import type { AddFunc } from '@/cfg/types';

export const addCSSMinimizer: AddFunc = async function (cfg, webpackCfg) {
  const { cssMinifier = true, cssMinifierOptions = {} } = cfg.config;

  if (!cssMinifier) return;

  let minifier;

  switch (cssMinifier) {
    default:
      new CssMinimizerPlugin(cssMinifierOptions);
  }

  webpackCfg.optimization!.minimizer!.push(minifier);
};
