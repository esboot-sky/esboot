import type { Configuration as ConfigurationWithoutBundler, UserOptions as UserOptionsWithoutBundler } from '@dz-web/esboot-common/cfg';
import type { Bundler } from '@/bundler';
import type { BaseBundlerOptions } from '@/bundler/types';
import { ESBootCfg } from '@dz-web/esboot-common/cfg';

export interface UserOptions<BundlerOptions = unknown> extends UserOptionsWithoutBundler {
  bundler: (new (config: BaseBundlerOptions) => Bundler) | null;
  bundlerOptions?: BundlerOptions;
}

export type Configuration<Options extends UserOptions = UserOptions> = ConfigurationWithoutBundler<Options>;

export const cfg = new ESBootCfg<Configuration>();
