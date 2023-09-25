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
  config: CustomConfiguration;
  isDev: boolean;
  userOpts: any;
  cwd: string;
  mfsu: any | undefined;
}
