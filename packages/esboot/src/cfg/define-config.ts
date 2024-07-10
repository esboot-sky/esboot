import type { UserConfig } from './types';

function defineConfig<BundlerCfg>(
  config: UserConfig<BundlerCfg>
): UserConfig<BundlerCfg> {
  return config;
}

export default defineConfig;
