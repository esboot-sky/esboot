import type { AddFunc } from '@/cfg/types';
import { CSSMinifier } from '@dz-web/esboot-common/constants';

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

export const addCSSMinimizer: AddFunc = async (cfg, webpackCfg) => {
  const { cssMinifier = CSSMinifier.cssnano, cssMinifierOptions = {} } = cfg.config;

  if (cssMinifier === CSSMinifier.none)
    return;

  let minifier: CssMinimizerPlugin;

  switch (cssMinifier) {
    default:
      minifier = new CssMinimizerPlugin(cssMinifierOptions);
  }

  webpackCfg.optimization!.minimizer!.push(minifier);
};
