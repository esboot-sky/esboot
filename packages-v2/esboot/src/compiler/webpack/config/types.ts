import Config from 'webpack-5-chain';
import type {
  Configuration,
  WebpackPluginInstance,
  EntryObject,
  RuleSetRule,
  WebpackOptionsNormalized,
} from 'webpack';

export interface CustomConfiguration extends Configuration {
  plugins: WebpackPluginInstance[];
  entry: EntryObject;
  module: {
    rules: RuleSetRule[];
  };
  devServer: {
    [index: string]: any;
  };
}

export interface ApplyOpts {
  chainedConfig: Config;
  config: CustomConfiguration;
  isDev: boolean;
  userOpts: any;
  cwd: string;
  mfsu: any | undefined;
}
