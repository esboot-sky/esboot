import { UserOptions } from '../cfg/types';
import { CompileTimeConfig } from '../cfg/compile-time-cfg';

export interface BaseBundlerOptions<BundlerOptions = any> {
  updateCompileTimeCfg: (cfg: Partial<CompileTimeConfig>) => void;
  compileTimeCfg: CompileTimeConfig;
  userOptions: Omit<UserOptions<BundlerOptions>, 'bundler'>;
}
