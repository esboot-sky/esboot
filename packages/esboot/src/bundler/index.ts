import { ConfigurationInstance } from './types';
import { callPluginHookOfModifyBundlerConfig } from '@/plugin';

export abstract class Bundler {
  cfg: ConfigurationInstance;

  constructor({ configuration }: { configuration: ConfigurationInstance }) {
    this.cfg = configuration;
  }

  abstract dev(): void;
  abstract build(): void;

  public onModifyBundlerConfig<T>(config: T): T {
    callPluginHookOfModifyBundlerConfig<T>(this.cfg.config, config);
    return config;
  }
}
