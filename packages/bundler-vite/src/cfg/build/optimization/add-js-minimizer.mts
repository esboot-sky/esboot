import { JsMinifier } from '@dz-web/esboot-common/constants';
import { merge } from '@dz-web/esboot-common/lodash';

import type { AddFunc } from '@/cfg/types.mts';

export const addJSMinimizer: AddFunc = async (cfg, viteCfg) => {
  const {
    minimize,
    jsMinifier = JsMinifier.esbuild,
    jsMinifierOptions = {},
  } = cfg.config;

  const _minimize = minimize && jsMinifier !== JsMinifier.none;

  if (!_minimize) {
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
