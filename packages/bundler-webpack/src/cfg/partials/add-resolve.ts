import type { Configuration } from '@dz-web/esboot';
import type { AddFunc } from '@/cfg/types';
import { join } from 'node:path';
import process from 'node:process';

export const addResolve: AddFunc = async (cfg, webpackCfg) => {
  const { alias } = cfg.config;
  const customAlias: Configuration['alias'] = {};

  for (const k in alias) {
    const value = join(process.cwd(), `./${alias[k]}/`);

    customAlias[k] = value;
  }

  webpackCfg.resolve = {
    alias: customAlias,
    mainFields: ['module', 'browser', 'main'],
    extensions: [
      '.wasm',
      '.mjs',
      '.cjs',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json',
    ],
  };
};
