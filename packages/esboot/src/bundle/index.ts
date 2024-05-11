import { Bundler } from './bundler';

export class Bundle {
  bundler: Bundler;

  constructor(bundler: Bundler) {
    this.bundler = bundler;
  }
}
