import { Bundler } from '@dz-web/esboot';

export * from './types';
export * from './cfg';

export class BundlerWebpack implements Bundler {
  dev() {
    console.log(1, '<-- dev');
  }

  build() {
    console.log(1, '<-- build');
  }
}
