import type { Configuration } from './types';
import process from 'node:process';

import {
  CSSMinifier,
  DEFAULT_DEV_PORT,
  Environment,
  JsMinifier,
  PAGE_TYPE,
  PLATFORMS,
} from '@/constants';

export const defaultCfg: Configuration = {
  isDev: true,
  isSP: false,
  rootPath: '',
  MPConfiguration: {
    pageType: PAGE_TYPE.browser,
    platform: PLATFORMS.PC,
    configRootPathOfPlatfrom: '',
    configRootPathOfPageType: '',
    contentRootPath: '',
  },
  configRootPath: '',
  configJSPath: '',
  env: Environment.dev,
  ipv4: 'localhost',
  version: '',
  entry: {},
  externals: {},
  cwd: process.cwd(),
  staticPathList: [],
  analyze: false,
  outputPath: 'dist',
  publicPath: '/',
  alias: {},
  css: {
    modules: {
      useStyleName: true,
      localsConvention: 'asIs',
    },
    tailwind: {
      enable: true,
      version: 'next',
      separateImports: false,
    },
    fontZoom: {
      enable: false,
      offsetVar: '--font-offset',
      zoomLineHeight: false,
      minPixelValue: 0,
      exclude: undefined,
    },
  },
  px2rem: {},
  svgr: true,
  svgrOptions: {},
  isMobile: false,
  isBrowser: true,
  minimize: true,
  isCIBuild: false,
  legacy: false,
  define: {},
  copy: {},
  jsMinifier: JsMinifier.terser,
  jsMinifierOptions: {},
  cssMinifier: CSSMinifier.cssnano,
  cssMinifierOptions: {},
  useLangJsonPicker: false,
  sourceMap: false,
  server: {
    host: '0.0.0.0',
    open: false,
    port: DEFAULT_DEV_PORT,
  },
  assetsInlineLimit: 4 * 1024, // 4 KB
  plugins: [],
  experimental: {
    reactCompiler: {
      enable: true,
      target: '19',
    },
  },
};
