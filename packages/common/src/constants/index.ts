import { resolve, join } from 'path';

export * from './environment';

export const USER_CONFIG_FILE = resolve(process.cwd(), './.esbootrc.ts');

export const DEFAULT_OUTPUT_PATH = 'dist';
export const DEFAULT_DEV_PORT = 8100;

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
