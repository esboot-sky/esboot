type JsStrategy = 'bigVendors' | 'depPerChunk' | 'granularChunks';
const NODE_MODULES_RE = /[\\/]node_modules[\\/]/;
const PNPM_PATH_SEGMENT_RE = /.pnpm[\\/]/;
const PACKAGE_NAME_RE = /[\\/]node_modules[\\/](.*?)([\\/]|$)/;
const PACKAGE_SCOPE_RE = /@/g;
const PACKAGE_PLUS_RE = /\+/g;

interface VendorsCacheGroup {
  test: RegExp;
  priority?: number;
  chunks?: 'async';
  name?: (module: { context: string }) => string;
}

interface SplitChunksIntent {
  chunks?: 'all';
  name?: string;
  minChunks?: number;
  cacheGroups: {
    vendors: VendorsCacheGroup;
  };
  [key: string]: any;
}

interface CreateSplitChunksIntentOptions<TOptions extends Record<string, any>> {
  jsStrategy: JsStrategy;
  jsStrategyOptions: TOptions;
  granularChunksFactory: (options: TOptions) => SplitChunksIntent;
}

function createDepPerChunkIntent(): SplitChunksIntent {
  return {
    cacheGroups: {
      vendors: {
        test: NODE_MODULES_RE,
        priority: 10,
        chunks: 'async',
        name(module) {
          const path = module.context.replace(PNPM_PATH_SEGMENT_RE, '');
          const match = path.match(PACKAGE_NAME_RE);
          if (!match) {
            return 'npm.unknown';
          }
          const packageName = match[1];
          return `npm.${packageName
            .replace(PACKAGE_SCOPE_RE, '_at_')
            .replace(PACKAGE_PLUS_RE, '_')}`;
        },
      },
    },
  };
}

function createBigVendorsIntent<TOptions extends Record<string, any>>(jsStrategyOptions: TOptions): SplitChunksIntent {
  return {
    chunks: 'all',
    name: 'vendor',
    minChunks: 2,
    cacheGroups: {
      vendors: {
        test: NODE_MODULES_RE,
      },
    },
    ...jsStrategyOptions,
  };
}

export function createSplitChunksIntent<TOptions extends Record<string, any>>(
  options: CreateSplitChunksIntentOptions<TOptions>,
): SplitChunksIntent {
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
