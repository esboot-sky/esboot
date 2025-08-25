import type {
  Environment,
  PLATFORMS,
  PAGE_TYPE,
  JsMinifier,
  CSSMinifier,
} from '@dz-web/esboot-common/constants';
import type { Plugin } from '@/plugin/type';

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
  exclude?: string[];
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

export type BabelPlugin = [string, Record<string, any>];

export interface ReactCompiler {
  enable?: boolean;
  target: string;
}

export interface UserOptions<BundlerOptions = unknown> {
  isSP?: boolean;
  bundler: (new (config: BaseBundlerOptions) => Bundler) | null;
  bundlerOptions?: BundlerOptions;
  outputPath?: string;
  publicPath?: string;
  useLangJsonPicker?: boolean;
  minimize?: boolean;
  jsMinifier?: JsMinifier;
  jsMinifierOptions?: Record<string, any>;
  cssMinifier?: CSSMinifier;
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
  legacy?: boolean;
  externals?: Record<string, string>;
  useTailwindcss?: boolean;
  plugins?: Plugin[];
  experimental?: {
    reactCompiler?: ReactCompiler;
  };
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
  | 'jsMinifier'
  | 'jsMinifierOptions'
  | 'cssMinifierOptions'
  | 'legacy'
  | 'cssMinifier'
  | 'experimental';

export type Configuration<BundlerOptions = unknown> = {
  [K in PreserveAttr]: Required<UserOptions<BundlerOptions>[K]>;
} & Omit<Required<UserOptions<BundlerOptions>>, PreserveAttr> & {
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
  } & (
    | { isSP: true; MPConfiguration: never }
    | { isSP: false; MPConfiguration: ConfigurationForMP }
  );
