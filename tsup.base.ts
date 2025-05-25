import type { Options } from 'tsup';

interface Config {
  base?: Options;
  dev?: Options;
  prod?: Options;
}

export const defineConfig = (config: Config = {}): Options => {
  const { base, dev, prod } = config;

  const baseConfig: Options = {
    entry: ['src/index.ts'],
    clean: false,
    dts: true,
    ...base,
  };

  const devConfig: Options = {
    watch: true,
    format: ['esm'],
    sourcemap: true,
    ...baseConfig,
    ...dev,
  };

  const prodConfig: Options = {
    minify: true,
    format: ['esm'],
    ...baseConfig,
    ...prod,
  };

  return process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
};
