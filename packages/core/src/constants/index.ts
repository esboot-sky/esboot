import { resolve, join } from 'path';

export const USER_CONFIG_FILE = resolve(process.cwd(), './.esbootrc.ts');

export const DEFAULT_DEVTOOL = 'cheap-module-source-map';
export const DEFAULT_OUTPUT_PATH = 'dist';
export const DEFAULT_DEV_PORT = 8100;
export const isWins = process.platform === 'win32';

const cacheDir = resolve(process.cwd(), 'node_modules/.cache/esboot');
export const webpackCacheDir = join(cacheDir, 'webpack-cache');
export const mfsuCacheDir = join(cacheDir, './mfsu');
