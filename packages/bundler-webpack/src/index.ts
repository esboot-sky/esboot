import { Bundler } from '@dz-web/esboot';
import { omit } from '@dz-web/esboot-common/lodash';

import { BaseBundlerOptions } from '@dz-web/esboot';
import type { BundlerWebpackOptions } from './options/types';

type UserOptions = Omit<BaseBundlerOptions['userOptions'], 'bundlerOptions'>;
export class BundlerWebpack implements Bundler {
  compileTimeCfg: BaseBundlerOptions['compileTimeCfg'];
  userOptions: UserOptions;
  bundlerOptions: BundlerWebpackOptions | Record<string, unknown>;

  constructor(cfg: BaseBundlerOptions<BundlerWebpackOptions>) {
    const { compileTimeCfg, userOptions } = cfg;

    this.userOptions = omit(userOptions, ['bundlerOptions']);
    this.compileTimeCfg = compileTimeCfg;
    this.bundlerOptions = userOptions.bundlerOptions || {};

    console.log(this.userOptions, '<-- this.userOptions');
    console.log(this.compileTimeCfg, '<-- this.compileTimeCfg');
    console.log(this.bundlerOptions, '<-- this.bundlerOptions');
  }

  dev() {
    console.log(1, '<-- dev');
  }

  build() {
    console.log(1, '<-- build');
  }
}

export * from './types';
export * from './options';
