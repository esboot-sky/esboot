import type { BabelPlugin, Configuration as ESBootConfiguration } from '@dz-web/esboot';
import type { CustomWebpackConfiguration } from '@/cfg/types';

export type { CustomWebpackConfiguration };

import {
  CodeSplittingType,
  type jsStrategyForGranularChunksOptions,
  type CodeSplitting,
} from '@dz-web/esboot-common/cfg';

export { CodeSplittingType, type jsStrategyForGranularChunksOptions, type CodeSplitting };

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
  cfg: ESBootConfiguration,
) => CustomWebpackConfiguration;

export interface BundlerWebpackOptions {
  mfsu?: boolean;
  buildCache?: boolean;
  mfsuOptions?: (cfg: MFSUOpts) => MFSUOpts;
  extraBabelPlugins?: BabelPlugin[];
  extraBabelPresets?: string[];
  extraBabelIncludes?: Array<string | RegExp>;
  customConfig?: CustomConfig;
  codeSplitting?: {
    jsStrategy: CodeSplittingType;
    jsStrategyOptions?:
      | jsStrategyForGranularChunksOptions
      | Record<string, any>;
  };
}
