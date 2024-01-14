import { join } from 'path';
import esbootConfig from '@@/config';
import type { UserOpts } from '@@/config/types';

export const addResolve = async (applyOpts: any) => {
  const {
    chainedConfig,
    userOpts: { alias },
  } = applyOpts;

  const customAlias: UserOpts['alias'] = {};

  for (let k in alias) {
    const value = join(process.cwd(), `./${alias[k]}/`);

    customAlias[k] = value;
  }

  chainedConfig.resolve.alias.merge(customAlias);
  chainedConfig.resolve.extensions
    .clear()
    .merge(['.wasm', '.mjs', '.cjs', '.js', '.jsx', '.ts', '.tsx', '.json']);
};
