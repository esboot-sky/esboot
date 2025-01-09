// granularChunks and depPerChunk from UMIJS
import type { AddFunc } from '@/cfg/types';
import { CodeSplittingType } from '@/types';
import type {
  BundlerWebpackOptions,
  jsStrategyForGranularChunksOptions,
} from '@/types';

import { granularChunks } from './granular-chunks';

export const addCodeSplitting: AddFunc = async (cfg, webpackCfg) => {
  const { bundlerOptions } = cfg.config;
  const { codeSplitting } = bundlerOptions as BundlerWebpackOptions;
  const {
    jsStrategy = CodeSplittingType.granularChunks,
    jsStrategyOptions = {},
  } = codeSplitting || {};

  let splitChunks = {};

  switch (jsStrategy) {
    case CodeSplittingType.granularChunks:
      splitChunks = granularChunks(
        jsStrategyOptions as jsStrategyForGranularChunksOptions
      );
      break;
    case CodeSplittingType.depPerChunk:
      splitChunks = {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'async',
            name(module: any) {
              // e.g. node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es
              const path = module.context.replace(/.pnpm[\\/]/, '');
              const match = path.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              if (!match) return 'npm.unknown';
              const packageName = match[1];
              return `npm.${packageName
                .replace(/@/g, '_at_')
                .replace(/\+/g, '_')}`;
            },
          },
        },
      };
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
        ...jsStrategyOptions,
      };
      break;
  }

  webpackCfg.optimization!.splitChunks = splitChunks;
};
