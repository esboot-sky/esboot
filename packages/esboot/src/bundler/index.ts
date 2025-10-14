import type { BaseBundlerOptions, ConfigurationInstance } from './types';
import type {
  pluginHooksDict,
} from '@/plugin';
import { PluginHooks } from '@dz-web/esboot-common/plugin';
import {
  callPluginHookOfModifyBundlerConfig,
  callPluginHookOfOnlyExec,
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

  onModifyBundlerConfig = <T>(config: T): T => {
    callPluginHookOfModifyBundlerConfig<T>(
      this.pluginHooksDict,
      this.cfg.config,
      config,
      this.getName(),
    );

    return config;
  };

  onAfterCompile = (): void => {
    callPluginHookOfOnlyExec(
      PluginHooks.afterCompile,
      this.pluginHooksDict,
      this.cfg.config,
    );
  };
}
