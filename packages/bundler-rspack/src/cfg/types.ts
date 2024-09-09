import type { ConfigurationInstance } from '@dz-web/esboot';
import type {
  Configuration,
  WebpackPluginInstance,
  EntryObject,
  RuleSetRule,
} from '@rspack/core';

export interface CustomRspackConfiguration extends Configuration {
  plugins: WebpackPluginInstance[];
  entry: EntryObject;
  module: {
    rules: RuleSetRule[];
  };
  devServer: {
    [index: string]: any;
  };
}

export type AddFunc<Options = Record<string, string>> = (
  cfg: ConfigurationInstance,
  rspackCfg: CustomRspackConfiguration,
  options?: Options extends Record<string, any> ? Options : never
) => Promise<void>;
