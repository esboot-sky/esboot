import TerserPlugin from 'terser-webpack-plugin';
// import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

import type { AddFunc } from '@/cfg/types';

export const addMinimizer: AddFunc = async function (cfg, webpackCfg) {
  const { isDev, jsMinifier = true } = cfg.config;

  if (isDev || !jsMinifier) return;

  // const terserMinifyOptions = {
  //   format: {
  //     comments: false,
  //   },
  // };

  webpackCfg.optimization!.minimizer = [
    new TerserPlugin({
      minify: TerserPlugin.terserMinify,
      parallel: true,
      // terserOptions: merge(terserMinifyOptions, jsMinifierOptions),
    }),
  ];
};
