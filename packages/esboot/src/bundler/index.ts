import { ConfigurationInstance } from './types';

export abstract class Bundler {
  cfg: ConfigurationInstance;

  constructor({ configuration }: { configuration: ConfigurationInstance }) {
    this.cfg = configuration;
  }

  abstract dev(): void;
  abstract build(): void;
}
