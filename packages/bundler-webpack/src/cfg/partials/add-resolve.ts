import { join } from 'path';
import type { ConfigurationInstance } from '@dz-web/esboot';
import Config from 'webpack-5-chain';

export const addResolve = async (
  cfg: ConfigurationInstance,
  webpackChain: Config
) => {
  const { alias } = cfg.config;

  for (let k in alias) {
    const value = join(process.cwd(), `./${alias[k]}/`);

    webpackChain.resolve.alias.set(k, value);
  }

  ['.wasm', '.mjs', '.cjs', '.js', '.jsx', '.ts', '.tsx', '.json'].forEach(
    (v) => webpackChain.resolve.extensions.add(v)
  );
};
