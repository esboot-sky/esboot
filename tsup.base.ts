import type { Options } from 'tsup';
import { env } from 'node:process';

interface Config {
  base?: Options;
  dev?: Options;
  prod?: Options;
}

export function defineConfig(config: Config = {}): Options {
  const { base, dev, prod } = config;

  const baseConfig: Options = {
    entry: ['src/index.ts'],
    clean: false,
    dts: true,
    format: ['esm'],
    ...base,
  };

  const devConfig: Options = {
    watch: true,
    sourcemap: true,
    ...baseConfig,
    ...dev,
  };

  const prodConfig: Options = {
    ...baseConfig,
    minify: true,
    sourcemap: false,
    clean: true,
    dts: true,
    ...prod,
  };

  return env.NODE_ENV === 'development' ? devConfig : prodConfig;
};
