import { BaseBundlerOptions } from '@dz-web/esboot';
import type { BundlerWebpackOptions } from './options/types';

import type { Pattern as copyWebpackPluginPattern } from 'copy-webpack-plugin';

export { copyWebpackPluginPattern };

type UserOptions = Omit<BaseBundlerOptions['userOptions'], 'bundlerOptions'>;
export interface BundlerCfg {
  compileTimeCfg: BaseBundlerOptions['compileTimeCfg'];
  userOptions: UserOptions;
  bundlerOptions: BundlerWebpackOptions | Record<string, unknown>;
}
