import { UserConfig } from '../cfg/types';
import { CompileTimeConfig } from '../cfg/compile-time-cfg';

export interface BaseBundlerOptions {
  compileTimeCfg: CompileTimeConfig;
  userOptions: Omit<UserConfig, 'bundler'>;
}
