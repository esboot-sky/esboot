import type { Configuration, UserOptions } from './types';

type DefineConfigParams<Options extends UserOptions = UserOptions>
  = | Options
    | ((cfg: Configuration) => Options);

function defineConfig<Options extends UserOptions = UserOptions>(
  config: DefineConfigParams<Options>,
): DefineConfigParams<Options> {
  return config;
}

export { defineConfig };
