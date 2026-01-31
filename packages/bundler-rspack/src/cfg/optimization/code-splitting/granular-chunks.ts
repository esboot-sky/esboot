import type { jsStrategyForGranularChunksOptions } from '@/types';

export function granularChunks(options: jsStrategyForGranularChunksOptions): any {
  const { frameworkBundles = [] } = options;

  return {
    chunks: 'all',
    cacheGroups: {
      // Framework bundles (React, Vue, etc.)
      ...frameworkBundles.reduce(
        (acc: Record<string, any>, framework: string) => {
          acc[framework] = {
            name: framework,
            test: new RegExp(`[\\\\/]node_modules[\\\\/](${framework})[\\\\/]`),
            priority: 30,
            enforce: true,
          };
          return acc;
        },
        {} as Record<string, any>,
      ),
      // Vendor chunks
      vendors: {
        name: 'vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: 10,
        minChunks: 2,
      },
      // Common chunks
      common: {
        name: 'common',
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true,
      },
    },
  };
}
