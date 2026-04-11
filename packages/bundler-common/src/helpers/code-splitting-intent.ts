type JsStrategy = 'bigVendors' | 'depPerChunk' | 'granularChunks';

interface CreateSplitChunksIntentOptions<TOptions extends Record<string, any>> {
  jsStrategy: JsStrategy;
  jsStrategyOptions: TOptions;
  granularChunksFactory: (options: TOptions) => Record<string, any>;
}

function createDepPerChunkIntent() {
  return {
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        chunks: 'async',
        name(module: any) {
          const path = module.context.replace(/.pnpm[\\/]/, '');
          const match = path.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
          if (!match) {
            return 'npm.unknown';
          }
          const packageName = match[1];
          return `npm.${packageName
            .replace(/@/g, '_at_')
            .replace(/\+/g, '_')}`;
        },
      },
    },
  };
}

function createBigVendorsIntent<TOptions extends Record<string, any>>(jsStrategyOptions: TOptions) {
  return {
    chunks: 'all',
    name: 'vendor',
    minChunks: 2,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
      },
    },
    ...jsStrategyOptions,
  };
}

export function createSplitChunksIntent<TOptions extends Record<string, any>>(
  options: CreateSplitChunksIntentOptions<TOptions>,
) {
  const { jsStrategy, jsStrategyOptions, granularChunksFactory } = options;

  switch (jsStrategy) {
    case 'granularChunks':
      return granularChunksFactory(jsStrategyOptions);
    case 'depPerChunk':
      return createDepPerChunkIntent();
    default:
      return createBigVendorsIntent(jsStrategyOptions);
  }
}
