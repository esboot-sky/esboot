import type { BaseBundlerOptions } from './types';

export abstract class Bundler {
  constructor(options: BaseBundlerOptions) {
    console.log(options, '<-- options');
  }

  abstract dev(): void;
  abstract build(): void;
}
