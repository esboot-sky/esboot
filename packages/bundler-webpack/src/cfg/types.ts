import type { ConfigurationInstance } from '@dz-web/esboot';
import type {
  Configuration,
  WebpackPluginInstance,
  EntryObject,
  RuleSetRule,
} from 'webpack';

export interface CustomWebpackConfiguration extends Configuration {
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
  webpackCfg: CustomWebpackConfiguration,
  options?: Options extends Record<string, any> ? Options : never
) => Promise<void>;
