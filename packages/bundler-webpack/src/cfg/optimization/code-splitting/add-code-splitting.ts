import type { AddFunc } from '@/cfg/types';
import { CodeSplittingType } from '@/types';
import type {
  BundlerWebpackOptions,
  jsStrategyForGranularChunksOptions,
} from '@/types';

import { granularChunks } from './granular-chunks';

export const addCodeSplitting: AddFunc = async function (cfg, webpackCfg) {
  const { bundlerOptions } = cfg.config;
  const { codeSplitting } = bundlerOptions as BundlerWebpackOptions;
  const { jsStrategy, jsStrategyOptions } = codeSplitting || {};

  let splitChunks = {};

  switch (jsStrategy) {
    case CodeSplittingType.granularChunks:
      splitChunks = granularChunks(
        jsStrategyOptions as jsStrategyForGranularChunksOptions
      );
      break;
    default:
      // bigVendors
      splitChunks = {
        chunks: 'all',
        name: 'vendor',
        minChunks: 2,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
          },
        },
      };
      break;
  }

  webpackCfg.optimization!.splitChunks = splitChunks;
};
