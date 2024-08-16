import { type Options } from 'tsup';

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
    ...baseConfig,
    watch: true,
    format: ['cjs'],
    sourcemap: true,
    ...dev,
  };

  const prodConfig: Options = {
    ...baseConfig,
    minify: true,
    format: ['cjs', 'esm'],
    ...prod,
  };

  return process.env.NODE_ENV === 'development' ? devConfig : prodConfig;
};
