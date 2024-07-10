import type { BundlerOptions } from './types';

export abstract class Bundler {
  constructor(options: BundlerOptions) {
    console.log(options, '<-- options');
  }

  abstract dev(): void;
  abstract build(): void;
}
