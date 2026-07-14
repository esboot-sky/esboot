import type { AddFunc } from '@/cfg/types';
import type { BundlerRspackOptions } from '@/types';
import { createSplitChunksIntent } from '@dz-web/esboot-bundler-common';
import { merge } from '@dz-web/esboot-common/lodash';
import { CodeSplittingType } from '../../../types';

import { granularChunks } from './granular-chunks';

export const addCodeSplitting: AddFunc = async (cfg, rspackCfg) => {
  const { codeSplitting: topLevelCodeSplitting, bundlerOptions = {} } = cfg.config;
  const { codeSplitting: bundlerCodeSplitting } = bundlerOptions as BundlerRspackOptions;
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

  rspackCfg.optimization!.splitChunks = splitChunks;
};
