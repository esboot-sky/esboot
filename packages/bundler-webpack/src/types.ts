import { CustomWebpackConfiguration } from '@/cfg/types';
import type { Configuration as ESBootConfiguration } from '@dz-web/esboot';

export enum CodeSplittingType {
  bigVendors = 'bigVendors',
  depPerChunk = 'depPerChunk',
  granularChunks = 'granularChunks',
}

export interface jsStrategyForGranularChunksOptions {
  frameworkBundles: string[];
}

export interface MFSUOpts {
  cwd?: string;
  excludeNodeNatives?: boolean;
  exportAllMembers?: Record<string, string[]>;
  getCacheDependency?: Function;
  onMFSUProgress?: Function;
  mfName?: string;
  tmpBase?: string;
  unMatchLibs?: Array<string | RegExp>;
  runtimePublicPath?: boolean | string;
  buildDepWithESBuild?: boolean;
  depBuildConfig?: any;
  strategy?: 'eager' | 'normal';
  include?: string[];
  srcCodeCache?: any;
  shared?: any;
  remoteName?: string;
  remoteAliases?: string[];
  startBuildWorker?: (dep: any[]) => Worker;
}

export type CustomConfig = (
  config: CustomWebpackConfiguration,
  cfg: ESBootConfiguration
) => CustomWebpackConfiguration;

export type BundlerWebpackOptions = {
  mfsu?: boolean;
  mfsuOptions?: (cfg: MFSUOpts) => MFSUOpts;
  extraBabelPlugins?: string[];
  extraBabelPresets?: string[];
  extraBabelIncludes?: Array<string | RegExp>;
  customConfig?: CustomConfig;
  codeSplitting?: {
    jsStrategy: CodeSplittingType;
    jsStrategyOptions?:
      | jsStrategyForGranularChunksOptions
      | Record<string, any>;
  };
};
