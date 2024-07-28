import configuration from '../cfg';

export type ConfigurationInstance = typeof configuration;

export interface BaseBundlerOptions {
  configuration: ConfigurationInstance;
}
