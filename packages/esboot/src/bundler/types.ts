import { pluginHooksDict } from '../plugin';
import configuration from '../cfg';

export type ConfigurationInstance = typeof configuration;

export interface BaseBundlerOptions {
  configuration: ConfigurationInstance;
  pluginHooksDict: typeof pluginHooksDict;
}
