import { Environment, PROJECT_TYPE } from '@dz-web/esboot-common/constants';

import { DEFAULT_DEV_PORT } from '@dz-web/esboot-common/constants';

export const defaultCfg = {
  projectType: PROJECT_TYPE.MP,
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
  server: {
    open: false,
    port: DEFAULT_DEV_PORT,
  },
};
