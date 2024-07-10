import { Bundler } from '../bundler';
import type { BaseBundlerCfg } from '../bundler/types';

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

export interface UserConfig<BundlerCfg = any> {
  bundler: (new (config: BaseBundlerCfg) => Bundler) | null;
  BundlerCfg?: BundlerCfg;
  outputPath?: string;
  publicPath?: string;
  analyze?: boolean;
  alias?: Record<string, string>;
  define?: Record<string, string>;
  sourceMap?: boolean;
  copy?: Record<string, string>;
  px2rem?: Px2rem;
  svgr?: boolean;
  svgrOptions?: Record<string, any>;
  server?: {
    host?: string | undefined;
    open?: boolean | string;
  };
}
