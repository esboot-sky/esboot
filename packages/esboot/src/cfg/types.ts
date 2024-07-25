import {
  Environment,
  PROJECT_TYPE,
  PLATFORMS,
  PAGE_TYPE,
} from '@dz-web/esboot-common/constants';

import { Bundler } from '../bundler';
import type { BaseBundlerOptions } from '../bundler/types';

interface Entry {
  chunkName: string;
  tpl: string;
  fileName: string;
  title: string;
  url: string;
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

export interface UserOptions<BundlerOptions = any> {
  bundler: (new (config: BaseBundlerOptions) => Bundler) | null;
  bundlerOptions?: BundlerOptions;
  outputPath?: string;
  publicPath?: string;
  useLangJsonPicker?: boolean;
  //
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
    open?: boolean;
    port?: number;
  };
}

export interface ConfigurationForMP {
  pageType: PAGE_TYPE;
  platform: PLATFORMS;
  isMobile: boolean;
  isBrowser: boolean;
  configRootPathOfPlatfrom: string;
  configRootPathOfPageType: string;
  contentRootPath: string;
}

export interface Configuration {
  projectType: PROJECT_TYPE;
  isDev: boolean;
  isSP: boolean;
  rootPath: string;
  configRootPath: string;
  configJSPath: string;
  ipv4: string;
  version: string;
  cwd: string;
  env: Environment;
  entry: Record<string, Entry>;
  staticPathList: {
    from: string;
    to: string;
  }[];
  MPConfiguration?: ConfigurationForMP;
}
