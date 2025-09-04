import type { BaseBundlerOptions, ConfigurationInstance } from './types';
import type {
  pluginHooksDict,
} from '@/plugin';
import {
  callPluginHookOfModifyBundlerConfig,
  callPluginHookOfOnlyExec,
  PluginHooks,
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

  abstract getName(): string;

  public onModifyBundlerConfig<T>(config: T): T {
    callPluginHookOfModifyBundlerConfig<T>(
      this.pluginHooksDict,
      this.cfg.config,
      config,
      this.getName(),
    );

    return config;
  }

  public onAfterCompile(): void {
    callPluginHookOfOnlyExec(
      PluginHooks.afterCompile,
      this.pluginHooksDict,
      this.cfg.config,
    );
  }
}
