import { ConfigurationInstance, BaseBundlerOptions } from './types';
import {
  callPluginHookOfModifyBundlerConfig,
  callPluginHookOfAfterCompile,
  pluginHooksDict,
} from '@/plugin';

export abstract class Bundler {
  cfg: ConfigurationInstance;
  pluginHooksDict: typeof pluginHooksDict;

  constructor({ configuration, pluginHooksDict }: BaseBundlerOptions) {
    this.cfg = configuration;
    this.pluginHooksDict = pluginHooksDict;
  }

  abstract dev(): void;
  abstract build(): void;

  public onModifyBundlerConfig<T>(config: T): T {
    callPluginHookOfModifyBundlerConfig<T>(
      this.pluginHooksDict,
      this.cfg.config,
      config
    );

    return config;
  }

  public onAfterCompile() {
    callPluginHookOfAfterCompile(this.pluginHooksDict, this.cfg.config);
  }
}
