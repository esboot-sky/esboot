import { resolve, join } from 'path';

export * from './environment';

export const getUserConfigFile = (path: string) =>
  resolve(path || process.cwd(), './.esbootrc.ts');

export const isWins = process.platform === 'win32';
export const DEFAULT_OUTPUT_PATH = 'dist';

export const DEFAULT_DEV_PORT = 8100;
export const DEFAULT_ANALYZE_PORT = 8101;
export const DEFAULT_PREVIEW_PORT = 8102;

export const cacheDir = resolve(process.cwd(), 'node_modules/.cache/esboot');
export const webpackCacheDir = join(cacheDir, 'webpack-cache');

export enum PLATFORMS {
  MOBILE = 'mobile',
  PC = 'pc',
}

export enum PAGE_TYPE {
  native = 'native', // Embed
  browser = 'browser',
}

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
