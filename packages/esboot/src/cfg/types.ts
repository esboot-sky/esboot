import type {
  Environment,
  PLATFORMS,
  PAGE_TYPE,
} from '@dz-web/esboot-common/constants';
import type { Plugin } from '@/plugin/type';
import type { Config as tailwindCSSConfig } from 'tailwindcss';

import type { Bundler } from '../bundler';
import type { BaseBundlerOptions } from '../bundler/types';

interface Entry {
  chunkName: string;
  tpl: string;
  fileName: string;
  title: string;
  url: string;
  entry: string;
  langJsonPicker?: string[];
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

export interface Proxy {
  context: string[];
  target: string;
  changeOrigin?: boolean;
  pathRewrite?: Record<string, string>;
}

export interface UserOptions<BundlerOptions = unknown> {
  isSP?: boolean;
  bundler: (new (config: BaseBundlerOptions) => Bundler) | null;
  bundlerOptions?: BundlerOptions;
  outputPath?: string;
  publicPath?: string;
  useLangJsonPicker?: boolean;
  minimize?: boolean;
  jsMinifier?: boolean;
  jsMinifierOptions?: Record<string, any>;
  cssMinifier?: boolean;
  cssMinifierOptions?: Record<string, any>;
  analyze?: boolean;
  alias?: Record<string, string>;
  define?: Record<string, string>;
  sourceMap?: boolean;
  copy?: Record<string, string>;
  px2rem?: Px2rem;
  svgr?: boolean;
  svgrOptions?: Record<string, any>;
  server?: {
    host?: string;
    https?: boolean;
    http2?: boolean;
    open?: boolean;
    port?: number;
    proxy?: Proxy[];
  };
  externals?: Record<string, string>;
  useTailwindcss?: boolean;
  tailwindcssOptions?: (defaultCfg: tailwindCSSConfig) => tailwindCSSConfig;
  plugins?: Plugin[];
}

export interface ConfigurationForMP {
  pageType: PAGE_TYPE;
  platform: PLATFORMS;
  configRootPathOfPlatfrom: string;
  configRootPathOfPageType: string;
  contentRootPath: string;
}

type PreserveAttr =
  | 'define'
  | 'copy'
  | 'sourceMap'
  | 'jsMinifier'
  | 'jsMinifierOptions'
  | 'cssMinifierOptions'
  | 'tailwindcssOptions'
  | 'cssMinifier';
export interface Configuration<BundlerOptions = unknown>
  extends Required<Omit<UserOptions<BundlerOptions>, PreserveAttr>>,
    Pick<UserOptions<BundlerOptions>, PreserveAttr> {
  isDev: boolean;
  isCIBuild: boolean;
  rootPath: string;
  configRootPath: string;
  configJSPath: string;
  ipv4: string;
  version: string;
  cwd: string;
  env: Environment;
  entry: Record<string, Entry>;
  isMobile: boolean;
  isBrowser: boolean;
  staticPathList: {
    from: string;
    to: string;
  }[];
  alias: Record<string, string>;
  MPConfiguration?: ConfigurationForMP;
  sourceMap?: UserOptions['sourceMap'];
}
