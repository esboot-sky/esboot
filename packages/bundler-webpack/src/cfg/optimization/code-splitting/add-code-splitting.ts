// granularChunks and depPerChunk from UMIJS
import type { AddFunc } from '@/cfg/types';
import type {
  BundlerWebpackOptions,
  jsStrategyForGranularChunksOptions,
} from '@/types';
import { CodeSplittingType } from '@/types';
import { createSplitChunksIntent } from '@dz-web/esboot-bundler-common';

import { granularChunks } from './granular-chunks';

export const addCodeSplitting: AddFunc = async (cfg, webpackCfg) => {
  const { bundlerOptions } = cfg.config;
  const { codeSplitting } = bundlerOptions as BundlerWebpackOptions;
  const {
    jsStrategy = CodeSplittingType.granularChunks,
    jsStrategyOptions = {},
  } = codeSplitting || {};

  const splitChunks = createSplitChunksIntent({
    jsStrategy,
    jsStrategyOptions,
    granularChunksFactory: granularChunks as (options: Record<string, any>) => Record<string, any>,
  });

  webpackCfg.optimization!.splitChunks = splitChunks;
};
