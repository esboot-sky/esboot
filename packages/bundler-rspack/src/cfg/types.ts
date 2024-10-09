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
  experiments: Required<Pick<Configuration, 'experiments'>>['experiments'];
  devServer: Required<Pick<Configuration, 'devServer'>>['devServer'];
}

export type AddFunc<Options = Record<string, string>> = (
  cfg: ConfigurationInstance,
  rspackCfg: CustomRspackConfiguration,
  options?: Options extends Record<string, any> ? Options : never
) => Promise<void>;
