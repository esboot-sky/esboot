import { join } from 'path';
import esbootConfig from '@@/config';
import type { UserOpts } from '@@/config/types';

export const addResolve = async (applyOpts: any) => {
  const {
    config,
    userOpts: { alias },
  } = applyOpts;

  const customAlias: UserOpts['alias'] = {};

  for (let k in alias) {
    const value = join(process.cwd(), `./${alias[k]}/`);

    customAlias[k] = value;
  }

  config.resolve = {
    alias: customAlias,
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
