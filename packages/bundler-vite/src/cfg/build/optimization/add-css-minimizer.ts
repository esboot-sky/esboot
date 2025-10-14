import type { AddFunc } from '@/cfg/types';

import { CSSMinifier } from '@dz-web/esboot-common/constants';

export const addCSSMinimizer: AddFunc = async (cfg, viteCfg) => {
  const { cssMinifier = CSSMinifier.esbuild, cssMinifierOptions = {} }
    = cfg.config;

  const isCanMinify = cssMinifier !== CSSMinifier.none;

  if (!isCanMinify) {
    viteCfg.build!.cssMinify = false;
    return;
  }

  if (cssMinifier === CSSMinifier.lightningcss) {
    viteCfg.build!.cssMinify = CSSMinifier.lightningcss;
    viteCfg.css!.lightningcss = cssMinifierOptions;
  }
};
