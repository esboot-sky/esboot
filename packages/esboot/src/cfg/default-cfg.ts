import { Environment } from '@dz-web/esboot-common/constants';

import { DEFAULT_DEV_PORT } from '@dz-web/esboot-common/constants';
import type { Configuration } from './types';

export const defaultCfg: Configuration = {
  isDev: true,
  isSP: false,
  rootPath: '',
  configRootPath: '',
  configJSPath: '',
  env: Environment.dev,
  ipv4: 'localhost',
  version: '',
  entry: {},
  cwd: process.cwd(),
  staticPathList: [],
  bundler: null,
  bundlerOptions: {},
  analyze: false,
  outputPath: 'dist',
  publicPath: '/',
  useLangJsonPicker: true,
  alias: {},
  px2rem: {},
  svgr: true,
  svgrOptions: {},
  isMobile: false,
  isBrowser: true,
  minimize: true,
  useTailwindcss: true,
  server: {
    open: false,
    port: DEFAULT_DEV_PORT,
  },
};
