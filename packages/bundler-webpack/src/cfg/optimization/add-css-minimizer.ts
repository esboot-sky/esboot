import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import type { AddFunc } from '@/cfg/types';

export const addCSSMinimizer: AddFunc = async (cfg, webpackCfg) => {
  const { cssMinifier = true, cssMinifierOptions = {} } = cfg.config;

  if (!cssMinifier) return;

  let minifier: CssMinimizerPlugin;

  switch (cssMinifier) {
    default:
      minifier = new CssMinimizerPlugin(cssMinifierOptions);
  }

  webpackCfg.optimization!.minimizer!.push(minifier);
};
