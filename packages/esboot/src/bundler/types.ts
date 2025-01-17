import type { pluginHooksDict } from '../plugin';

import type configuration from '../cfg';

export type ConfigurationInstance = typeof configuration;

export interface BaseBundlerOptions {
  configuration: ConfigurationInstance;
  pluginHooksDict: typeof pluginHooksDict;
}
