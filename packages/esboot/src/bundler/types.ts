import { UserConfig } from '../cfg/types';
import { CompileTimeConfig } from '../cfg/compile-time-cfg';

export interface BaseBundlerOptions<BundlerOptions = any> {
  compileTimeCfg: CompileTimeConfig;
  userOptions: Omit<UserConfig<BundlerOptions>, 'bundler'>;
}
