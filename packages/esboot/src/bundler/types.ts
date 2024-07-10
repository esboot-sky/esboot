import { UserConfig } from '../cfg/types';
import { CompileTimeConfig } from '../cfg/compile-time-cfg';

export interface BaseBundlerCfg {
  compileTimeCfg: CompileTimeConfig;
  userOptions: Omit<UserConfig, 'bundler'>;
}
