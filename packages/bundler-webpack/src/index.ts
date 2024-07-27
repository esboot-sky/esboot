import { Bundler } from '@dz-web/esboot';
import { BaseBundlerOptions, ConfigurationInstance } from '@dz-web/esboot';

import { getWebpackCfg } from './cfg';

export class BundlerWebpack implements Bundler {
  cfg: ConfigurationInstance;

  constructor(options: BaseBundlerOptions) {
    this.cfg = options.configuration;
  }

  async dev() {
    const webpackCfg = await getWebpackCfg(this.cfg);
    console.log(webpackCfg.toConfig(), '<-- dev');
  }

  build() {
    console.log(1, '<-- build');
  }
}

export * from './types';
export * from './options';
