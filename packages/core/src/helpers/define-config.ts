import { UserOpts } from '@@/config/types';
import compileTimeConfig from '@@/config/compile-time-config';
import { ExcludeFunctions } from './type';

type Config =
  | ((compileTimeCfg: ExcludeFunctions<typeof compileTimeConfig>) => UserOpts)
  | UserOpts;

function defineConfig(config: Config): Config {
  return config;
}

export default defineConfig;
