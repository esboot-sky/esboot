import type { ConfigurationInstance } from '@dz-web/esboot';
import type { CustomViteConfiguration } from '@/types.mts';

export type AddFunc<Options = Record<string, string>> = (
  cfg: ConfigurationInstance,
  viteCfg: CustomViteConfiguration,
  options?: Options extends Record<string, any> ? Options : never
) => Promise<void>;
