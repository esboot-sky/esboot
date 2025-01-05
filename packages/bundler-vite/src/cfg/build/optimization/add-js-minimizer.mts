import { JsMinifier } from '@dz-web/esboot-common/constants';
import { merge } from '@dz-web/esboot-common/lodash';

import type { AddFunc } from '@/cfg/types.mts';

export const addJSMinimizer: AddFunc = async (cfg, viteCfg) => {
  const { jsMinifier = JsMinifier.esbuild, jsMinifierOptions = {} } =
    cfg.config;

  const isCanMinify = jsMinifier !== JsMinifier.none;

  if (!isCanMinify) {
    viteCfg.build!.minify = false;
    return;
  }

  if (jsMinifier === JsMinifier.terser) {
    const terserMinifyOptions = {
      format: {
        comments: false,
      },
    };

    viteCfg.build!.terserOptions = merge(
      terserMinifyOptions,
      jsMinifierOptions
    );
  }
};
