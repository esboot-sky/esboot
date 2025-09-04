import type configuration from '../cfg';

import type { pluginHooksDict } from '../plugin';

export type ConfigurationInstance = typeof configuration;

export interface BaseBundlerOptions {
  configuration: ConfigurationInstance;
  pluginHooksDict: typeof pluginHooksDict;
}
