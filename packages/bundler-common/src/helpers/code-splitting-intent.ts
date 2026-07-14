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
    vendors?: VendorsCacheGroup;
    [key: string]: any;
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
  let intent: SplitChunksIntent;

  switch (jsStrategy) {
    case 'granularChunks':
      intent = granularChunksFactory(jsStrategyOptions);
      break;
    case 'depPerChunk':
      intent = createDepPerChunkIntent();
      break;
    default:
      intent = createBigVendorsIntent(jsStrategyOptions);
      break;
  }

  const { customGroups } = jsStrategyOptions;
  if (customGroups) {
    if (!intent.cacheGroups) {
      intent.cacheGroups = {} as any;
    }
    for (const [chunkName, rule] of Object.entries(customGroups)) {
      let matchRule = rule;
      let extraOptions: Record<string, any> = {};

      if (
        rule &&
        typeof rule === 'object' &&
        !Array.isArray(rule) &&
        !(rule instanceof RegExp)
      ) {
        const { match, ...rest } = rule as any;
        matchRule = match;
        extraOptions = rest;
      }

      intent.cacheGroups[chunkName] = {
        name: chunkName,
        test(module: any) {
          const resource = module.nameForCondition?.();
          if (!resource) return false;
          const normalizedResource = resource.replace(/\\/g, '/');

          if (Array.isArray(matchRule)) {
            return matchRule.some((item) => {
              if (item instanceof RegExp) {
                return item.test(normalizedResource);
              }
              return normalizedResource.includes(`node_modules/${item}/`);
            });
          }
          if (matchRule instanceof RegExp) {
            return matchRule.test(normalizedResource);
          }
          if (typeof matchRule === 'function') {
            return matchRule(resource);
          }
          return false;
        },
        chunks: 'all',
        priority: 50,
        enforce: true,
        ...extraOptions,
      };
    }
  }

  return intent;
}
