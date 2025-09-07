import type { cfg } from '@/cfg';

import type { pluginHooksDict } from '@/plugin';

export type ConfigurationInstance = typeof cfg;

export interface BaseBundlerOptions {
  configuration: ConfigurationInstance;
  pluginHooksDict: typeof pluginHooksDict;
}
