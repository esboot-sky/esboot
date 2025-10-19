import type { ConfigurationInstance } from '@dz-web/esboot';
import type {
  Configuration,
  EntryObject,
  RuleSetRule,
  WebpackPluginInstance,
} from 'webpack';

export interface CustomWebpackConfiguration extends Configuration {
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
  webpackCfg: CustomWebpackConfiguration,
  options?: Options extends Record<string, any> ? Options : never
) => Promise<void>;
