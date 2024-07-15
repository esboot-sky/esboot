import type { UserOptions } from './types';

function defineConfig<BundlerCfg>(
  config: UserOptions<BundlerCfg>
): UserOptions<BundlerCfg> {
  return config;
}

export default defineConfig;
