import { UserConfig } from '../cfg/types';
import { CompileTimeConfig } from '../cfg/compile-time-cfg';

export interface BundlerOptions {
  compileTimeCfg: CompileTimeConfig;
  userCfg: Omit<UserConfig, 'bundler'>;
}
