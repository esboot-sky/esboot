// granularChunks and depPerChunk from UMIJS
import type { AddFunc } from '@/cfg/types';
import type { BundlerWebpackOptions } from '@/types';
import { createSplitChunksIntent } from '@dz-web/esboot-bundler-common';
import { merge } from '@dz-web/esboot-common/lodash';
import { CodeSplittingType } from '../../../types';

import { granularChunks } from './granular-chunks';

export const addCodeSplitting: AddFunc = async (cfg, webpackCfg) => {
  const { codeSplitting: topLevelCodeSplitting, bundlerOptions = {} } = cfg.config;
  const { codeSplitting: bundlerCodeSplitting } = bundlerOptions as BundlerWebpackOptions;
  const codeSplitting = merge({}, topLevelCodeSplitting, bundlerCodeSplitting);
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
