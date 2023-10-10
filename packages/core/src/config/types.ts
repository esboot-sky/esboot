import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import type { PluginOptions } from 'copy-webpack-plugin';
import type { Configuration } from 'webpack';

import { ApplyOpts } from '../compiler/webpack/config/types';

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

export interface Px2rem {
  enable?: boolean;
  rootValue?: number | Record<string, number>;
  unitPrecision?: number;
  propWhiteList?: string[];
  propBlackList?: string[];
  exclude?: any;
  selectorBlackList?: string[];
  ignoreIdentifier?: boolean | string;
  replace?: boolean;
  mediaQuery?: boolean;
  minPixelValue?: number;
}

export type UserOpts = {
  analyze?: boolean;
  mfsu?: boolean;
  copy?: Pick<PluginOptions, 'patterns'>;
  outputPath?: string;
  publicPath?: string;
  customWebpack?: (
    config: Configuration,
    applyOpts: ApplyOpts
  ) => Configuration;
  TSChecker?: boolean;
  analyzer?: any;
  extraBabelPlugins?: string[];
  extraBabelPresets?: string[];
  extraBabelIncludes?: Array<string | RegExp>;
  pxtorem?: Px2rem;
  jsMinifier?: JsMinifier;
  jsMinifierOptions?: any;
  cssMinifier?: CSSMinifier;
  cssMinifierOptions?: any;
  alias?: Record<string, string>;
  define?: Record<string, string>;
  codeSplitting?: {
    jsStrategy: CodeSplittingType;
    jsStrategyOptions: jsStrategyForGranularChunksOptions | Record<string, any>;
  };
  svgr?: boolean;
  svgrOptions?: Record<string, any>;
} & Pick<
  DevServerConfiguration,
  'https' | 'http2' | 'open' | 'host' | 'proxy' | 'port'
> &
  Pick<Configuration, 'externals' | 'devtool'>;
