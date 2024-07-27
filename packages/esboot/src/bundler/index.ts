import cfg from '@/cfg';

export abstract class Bundler {
  cfg: typeof cfg;

  constructor() {
    this.cfg = cfg;
  }

  abstract dev(): void;
  abstract build(): void;
}
