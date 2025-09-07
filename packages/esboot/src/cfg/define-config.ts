import type { Configuration, UserOptions } from '@/cfg';

type DefineConfigParams<BundlerCfg>
  = | UserOptions<BundlerCfg>
    | ((cfg: Configuration) => UserOptions<BundlerCfg>);

function defineConfig<BundlerCfg>(
  config: DefineConfigParams<BundlerCfg>,
): DefineConfigParams<BundlerCfg> {
  return config;
}

export { defineConfig };
