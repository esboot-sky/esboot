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
    minify: true,
    ...baseConfig,
    ...prod,
  };

  return process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
};
