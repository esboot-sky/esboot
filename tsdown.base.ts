import type { UserConfig } from 'tsdown';
import { env } from 'node:process';

interface BaseConfig {
  base?: UserConfig;
  dev?: UserConfig;
  prod?: UserConfig;
}

export function defineConfig(config: BaseConfig = {}): UserConfig {
  const { base, dev, prod } = config;

  const baseConfig: UserConfig = {
    entry: ['src/index.ts'],
    clean: false,
    dts: true,
    format: ['esm'],
    ...base,
  };

  const devConfig: UserConfig = {
    watch: true,
    sourcemap: true,
    ...baseConfig,
    ...dev,
  };

  const prodConfig: UserConfig = {
    ...baseConfig,
    minify: true,
    sourcemap: false,
    clean: true,
    dts: true,
    ...prod,
  };

  return env.NODE_ENV === 'development' ? devConfig : prodConfig;
};
