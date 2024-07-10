import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import type { Configuration } from 'webpack';

export enum JsMinifier {
  terser = 'terser',
  // esbuild = 'esbuild',
  swc = 'swc',
  none = 'none',
}

export enum CSSMinifier {
  cssnano = 'cssnano',
  lightningcss = 'lightningcss',
  none = 'none',
}

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

export type BundlerWebpackOptions = {
  mfsu?: boolean;
  mfsuOptions?: (cfg: MFSUOpts) => MFSUOpts;
  TSChecker?: boolean;
  extraBabelPlugins?: string[];
  extraBabelPresets?: string[];
  extraBabelIncludes?: Array<string | RegExp>;
  //
  // copy?: Pick<PluginOptions, 'patterns'>;
  jsMinifier?: JsMinifier;
  jsMinifierOptions?: any;
  cssMinifier?: CSSMinifier;
  cssMinifierOptions?: any;
  codeSplitting?: {
    jsStrategy: CodeSplittingType;
    jsStrategyOptions: jsStrategyForGranularChunksOptions | Record<string, any>;
  };
} & Pick<
  DevServerConfiguration,
  'https' | 'http2' | 'proxy' | 'port'
> &
  Pick<Configuration, 'externals'>;
