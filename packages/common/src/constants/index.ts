import { join, resolve } from 'node:path';
import process from 'node:process';

export * from './environment';

export function getUserConfigFile(path: string): string {
  return resolve(path || process.cwd(), './.esbootrc.ts');
}

export const isWins = process.platform === 'win32';
export const DEFAULT_OUTPUT_PATH = 'dist';

export const DEFAULT_DEV_PORT = 8100;
export const DEFAULT_ANALYZE_PORT = 8101;
export const DEFAULT_PREVIEW_PORT = 8102;

export const DEFAULT_CONFIG_FOLDER = 'config';
export const DEFAULT_SRC_FOLDER = 'src';

export function getCacheDir(cwd: string): string {
  return resolve(cwd, 'node_modules/.cache/esboot');
}

export function getWebpackCacheDir(cwd: string): string {
  return join(getCacheDir(cwd), 'webpack-cache');
}

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
  esbuild = 'esbuild',
  swc = 'swc',
  none = 'none',
}

export enum CSSMinifier {
  esbuild = 'esbuild',
  cssnano = 'cssnano',
  lightningcss = 'lightningcss',
  none = 'none',
}
