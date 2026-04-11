import type { Configuration as ESBootConfiguration } from '@dz-web/esboot';
import type { InlineConfig } from 'vite';

export enum CodeSplittingType {
  bigVendors = 'bigVendors',
  granularChunks = 'granularChunks',
}

export interface jsStrategyForGranularChunksOptions {
  frameworkBundles: string[];
}

export interface SharedConfig {
  pages: Record<
    string,
    {
      entry: string;
      sourceEntry: string;
      title: string;
      template: string;
    }
  >;
}

export interface CustomViteConfiguration extends Omit<InlineConfig, 'plugins'> {
  plugins: Required<Pick<InlineConfig, 'plugins'>>['plugins'];
  sharedConfig: SharedConfig;
}

export type CustomConfig = (
  config: CustomViteConfiguration,
  cfg: ESBootConfiguration,
) => CustomViteConfiguration;

export interface BundlerViteOptions {
  customConfig?: CustomConfig;
  legacy?: {
    enable?: boolean;
  };
  codeSplitting?: {
    jsStrategy: CodeSplittingType;
    jsStrategyOptions?:
      | jsStrategyForGranularChunksOptions
      | Record<string, any>;
  };
};
