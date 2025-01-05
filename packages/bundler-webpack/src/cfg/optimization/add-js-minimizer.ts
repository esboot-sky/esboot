import TerserPlugin from 'terser-webpack-plugin';
import { JsMinifier } from '@dz-web/esboot-common/constants';
import { merge } from '@dz-web/esboot-common/lodash';

import type { AddFunc } from '@/cfg/types';

export const addJSMinimizer: AddFunc = async (cfg, webpackCfg) => {
  const { jsMinifier = JsMinifier.terser, jsMinifierOptions = {} } = cfg.config;

  if (jsMinifier === JsMinifier.none) return;

  const terserMinifyOptions = {
    format: {
      comments: false,
    },
  };

  let minifier: TerserPlugin;

  switch (jsMinifier) {
    default:
      minifier = new TerserPlugin({
        minify: TerserPlugin.terserMinify,
        parallel: true,
        terserOptions: merge(terserMinifyOptions, jsMinifierOptions),
        exclude: /config\.js$/,
      });
  }

  webpackCfg.optimization!.minimizer!.push(minifier);
};
