import type { InlineConfig } from 'vite';
import type { Configuration as ESBootConfiguration } from '@dz-web/esboot';

export type CustomConfig = (
  config: InlineConfig,
  cfg: ESBootConfiguration
) => InlineConfig;

export type BundlerViteOptions = {
  customConfig?: CustomConfig;
};