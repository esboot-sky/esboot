import type { ConfigurationInstance } from '@dz-web/esboot';
import type { InlineConfig } from 'vite';

export type AddFunc<Options = Record<string, string>> = (
  cfg: ConfigurationInstance,
  viteCfg: InlineConfig,
  options?: Options extends Record<string, any> ? Options : never
) => Promise<void>;
