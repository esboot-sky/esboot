import type { Configuration as ESBootConfiguration } from '@dz-web/esboot';
import type { CustomRspackConfiguration } from './cfg/types';

export type { CustomRspackConfiguration };

export enum CodeSplittingType {
  bigVendors = 'bigVendors',
  depPerChunk = 'depPerChunk',
  granularChunks = 'granularChunks',
}

export interface jsStrategyForGranularChunksOptions {
  frameworkBundles?: string[];
  customSplitting?: Record<
    string,
    string[] | RegExp | ((id: string) => boolean)
  >;
}

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
