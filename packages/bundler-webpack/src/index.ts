import { Bundler } from '@dz-web/esboot';
import type { BundlerWebpackCfg } from './cfg/types';

export class BundlerWebpack implements Bundler {
  constructor(cfg: BundlerWebpackCfg) {
    console.log(cfg, '<-- cfg');
  }

  dev() {
    console.log(1, '<-- dev');
  }

  build() {
    console.log(1, '<-- build');
  }
}

export * from './types';
export * from './cfg';
