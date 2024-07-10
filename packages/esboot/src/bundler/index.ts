import type { BaseBundlerCfg } from './types';

export abstract class Bundler {
  constructor(options: BaseBundlerCfg) {
    console.log(options, '<-- options');
  }

  abstract dev(): void;
  abstract build(): void;
}
