import type {
  CSSMinifier,
  Environment,
  JsMinifier,
  PAGE_TYPE,
  PLATFORMS,
} from '@/constants';
import type { Plugin } from '@/plugin/type';

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

export type LocalsConvention
  = | 'camelCase'
    | 'camelCaseOnly'
    | 'asIs'
    | 'dashes'
    | 'dashesOnly'
    | ((name: string) => string);

export interface CSSOptions {
  modules?: {
    useStyleName?: boolean;
    localsConvention?: LocalsConvention;
  };
  tailwind?: {
    enable?: boolean;
    version?: TailwindVersion;
    separateImports?: boolean;
  };
}

export interface ReactCompiler {
  enable?: boolean;
  target: '18' | '19';
}

export type TailwindVersion = '3' | 'next';

export interface UserOptions {
  isSP?: boolean;
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
  define?: Record<string, string | boolean | number>;
  sourceMap?: boolean;
  copy?: Record<string, string>;
  css?: CSSOptions;
  px2rem?: Px2rem;
  svgr?: boolean;
  svgrOptions?: Record<string, any>;
  assetsInlineLimit?: number;
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

type PreserveAttr
  = | 'define'
    | 'copy'
    | 'jsMinifier'
    | 'jsMinifierOptions'
    | 'cssMinifierOptions'
    | 'legacy'
    | 'cssMinifier'
    | 'css'
    | 'experimental';

export type Configuration<Options extends UserOptions = UserOptions> = {
  [K in PreserveAttr]: Required<Options[K]>;
} & Omit<Required<Options>, PreserveAttr> & {
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
