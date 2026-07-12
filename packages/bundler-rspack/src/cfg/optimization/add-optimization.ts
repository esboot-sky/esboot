import type { AddFunc } from '@/cfg/types';
import { CSSMinifier, JsMinifier } from '@dz-web/esboot-common/constants';
import { mergeWith } from '@dz-web/esboot-common/lodash';

import {
  LightningCssMinimizerRspackPlugin,
  SwcJsMinimizerRspackPlugin,
} from '@rspack/core';

import { addCodeSplitting } from './code-splitting/add-code-splitting';

export const addOptimization: AddFunc = async (cfg, rspackCfg) => {
  const {
    isDev,
    minimize,
    jsMinifier = JsMinifier.swc,
    jsMinifierOptions = {},
    cssMinifier = CSSMinifier.lightningcss,
    cssMinifierOptions = {},
  } = cfg.config;

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

  const defaultSwcMinimizerOptions = {
    compress: {
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log'],
    },
    mangle: true,
    format: {
      comments: false,
    },
  };

  const customizer = (objValue: any, srcValue: any): any => {
    if (Array.isArray(srcValue)) {
      return srcValue;
    }
  };

  if (jsMinifier !== JsMinifier.none) {
    rspackCfg.optimization.minimizer.push(new SwcJsMinimizerRspackPlugin({
      minimizerOptions: mergeWith({}, defaultSwcMinimizerOptions, jsMinifierOptions, customizer),
    }));
  }

  if (cssMinifier !== CSSMinifier.none) {
    rspackCfg.optimization.minimizer.push(new LightningCssMinimizerRspackPlugin({
      minimizerOptions: {
        errorRecovery: false,
        ...cssMinifierOptions,
      },
    }));
  }

  await addCodeSplitting(cfg, rspackCfg);
};
