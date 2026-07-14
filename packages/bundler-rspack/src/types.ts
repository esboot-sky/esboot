import type { Configuration as ESBootConfiguration } from '@dz-web/esboot';
import type { CustomRspackConfiguration } from './cfg/types';

export type { CustomRspackConfiguration };

import {
  CodeSplittingType,
  type jsStrategyForGranularChunksOptions,
  type CodeSplitting,
} from '@dz-web/esboot-common/cfg';

export { CodeSplittingType, type jsStrategyForGranularChunksOptions, type CodeSplitting };

export type CustomConfig = (
  config: CustomRspackConfiguration,
  cfg: ESBootConfiguration,
) => CustomRspackConfiguration;

export interface BundlerRspackOptions {
  customConfig?: CustomConfig;
  extraBabelIncludes?: Array<string | RegExp>;
  codeSplitting?: {
    jsStrategy?: CodeSplittingType;
    jsStrategyOptions?:
      | jsStrategyForGranularChunksOptions
      | Record<string, any>;
  };
}
