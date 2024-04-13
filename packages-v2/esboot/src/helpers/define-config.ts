import { UserOpts } from '@@/config/types';
import { CompileTimeConfig } from '@@/config/compile-time-config';

type Config =
  | ((compileTimeConfig: CompileTimeConfig) => UserOpts)
  | UserOpts;

function defineConfig(config: Config): Config {
  return config;
}

export default defineConfig;
