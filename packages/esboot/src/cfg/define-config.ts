import type { UserOptions, Configuration } from './types';

type DefineConfigParams<BundlerCfg> =
  | UserOptions<BundlerCfg>
  | ((cfg: Configuration) => UserOptions<BundlerCfg>);

function defineConfig<BundlerCfg>(
  config: DefineConfigParams<BundlerCfg>
): DefineConfigParams<BundlerCfg> {
  return config;
}

export default defineConfig;
