import { Bundler } from '@dz-web/esboot';
import type { BundlerWebpackOptions } from './options/types';

export class BundlerWebpack implements Bundler {
  constructor(cfg: BundlerWebpackOptions) {
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
export * from './options';
