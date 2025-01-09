import { mergeFrameworkBundles } from '@dz-web/esboot-bundler-common';

import { CodeSplittingType } from '@/types.mts';

import type { BundlerViteOptions } from '@/types.mts';
import type { AddFunc } from '@/cfg/types.mts';

export const addCodeSplitting: AddFunc = async (cfg, viteCfg) => {
  const { bundlerOptions } = cfg.config;
  const { codeSplitting } = bundlerOptions as BundlerViteOptions;
  const {
    jsStrategy = CodeSplittingType.granularChunks,
    jsStrategyOptions = {},
  } = codeSplitting || {};

  let manualChunks: Record<string, any> | ((id: string) => string) = {};

  if (jsStrategy === CodeSplittingType.granularChunks) {
    const { frameworkBundles = [] } = jsStrategyOptions;
    const _frameworkBundles = mergeFrameworkBundles(frameworkBundles);

    manualChunks = {
      framework: _frameworkBundles,
    };
  } else if (jsStrategy === CodeSplittingType.bigVendors) {
    manualChunks = (id: string) => {
      if (id.includes('node_modules')) {
        return 'vendors';
      }
    };
  }

  Object.assign(viteCfg.build!.rollupOptions!, {
    output: {
      manualChunks,
    },
  });
};
