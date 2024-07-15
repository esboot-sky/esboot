import { Bundler } from '@dz-web/esboot';
import { omit } from '@dz-web/esboot-common/lodash';
import { BaseBundlerOptions } from '@dz-web/esboot';
import type { BundlerWebpackOptions } from './options/types';

import { getWebpackCfg } from './cfg';

import type { BundlerCfg } from './types';

export class BundlerWebpack implements Bundler {
  bundlerCfg: BundlerCfg;

  constructor(cfg: BaseBundlerOptions<BundlerWebpackOptions>) {
    const { compileTimeCfg, userOptions, updateCompileTimeCfg } = cfg;

    this.bundlerCfg = {
      userOptions: omit(userOptions, ['bundlerOptions']),
      compileTimeCfg,
      bundlerOptions: userOptions.bundlerOptions || {},
      updateCompileTimeCfg,
    };
  }

  async dev() {
    const webpackCfg = await getWebpackCfg(this.bundlerCfg);
    console.log(webpackCfg, '<-- dev');
  }

  build() {
    console.log(1, '<-- build');
  }
}

export * from './types';
export * from './options';
