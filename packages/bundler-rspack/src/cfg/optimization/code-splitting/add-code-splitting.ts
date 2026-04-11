import type { AddFunc } from '@/cfg/types';
import type {
  BundlerRspackOptions,
  jsStrategyForGranularChunksOptions,
} from '@/types';
import { CodeSplittingType } from '@/types';
import { createSplitChunksIntent } from '@dz-web/esboot-bundler-common';

import { granularChunks } from './granular-chunks';

export const addCodeSplitting: AddFunc = async (cfg, rspackCfg) => {
  const { bundlerOptions } = cfg.config;
  const { codeSplitting } = bundlerOptions as BundlerRspackOptions;
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
