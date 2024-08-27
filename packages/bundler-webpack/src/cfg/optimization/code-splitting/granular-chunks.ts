import crypto from 'crypto';
import type { jsStrategyForGranularChunksOptions } from '@/types';

export const granularChunks = (
  options?: jsStrategyForGranularChunksOptions
) => {
  const { frameworkBundles = [] } = options || {};

  const FRAMEWORK_BUNDLES = [
    // React Series
    'react-dom',
    'react',
    'react-intl',
    'react-router',
    'react-router-dom',
    'classnames',
    //
    'lodash',
    'dayjs',
    'zustand',
    '@loadable/component',
    ...frameworkBundles,
  ];

  return {
    chunks: 'all',
    name: 'vendor',
    minChunks: 2,
    cacheGroups: {
      default: false,
      defaultVendors: false,
      framework: {
        name: 'framework',
        chunks: 'all',
        test: new RegExp(
          `[\\\\/]node_modules[\\\\/](${FRAMEWORK_BUNDLES.join(`|`)})[\\\\/]`
        ),
        priority: 40,
        enforce: true,
      },
      lib: {
        test(module: any) {
          return (
            !isModuleCSS(module) &&
            module.size() > 160000 &&
            /node_modules[/\\]/.test(module.identifier())
          );
        },
        name(module: any) {
          const rawRequest =
            module.rawRequest &&
            module.rawRequest.replace(/^@(\w+)[/\\]/, '$1-');
          if (rawRequest) {
            return `${
              // when `require()` a package with relative path,
              // need remove leading `.` and `/`, otherwise will not found `.js` file
              // e.g. require('../../lib/codemirror')
              rawRequest.replace(/\./g, '_').replace(/\//g, '-')
            }-lib`;
          }

          const identifier = module.identifier();
          const trimmedIdentifier = /(?:^|[/\\])node_modules[/\\](.*)/.exec(
            identifier
          );
          const processedIdentifier =
            trimmedIdentifier &&
            trimmedIdentifier[1].replace(/^@(\w+)[/\\]/, '$1-');

          return `${processedIdentifier || identifier}-lib`;
        },
        priority: 30,
        minChunks: 1,
        reuseExistingChunk: true,
        chunks: 'async',
      },
      shared: {
        name(_module: any, chunks: any) {
          const cryptoName = crypto
            .createHash('sha1')
            .update(
              chunks.reduce((acc: any, chunk: any) => {
                return acc + chunk.name;
              }, '')
            )
            .digest('base64')
            .replace(/\//g, '')
            .replace(/\+/g, '-')
            .replace(/=/g, '_');
          return `shared-${cryptoName}`;
        },
        priority: 10,
        minChunks: 2,
        reuseExistingChunk: true,
        chunks: 'async',
      },
    },
  };
};

function isModuleCSS(module: { type: string }) {
  return (
    // mini-css-extract-plugin
    module.type === `css/mini-extract` ||
    // extract-css-chunks-webpack-plugin (old)
    module.type === `css/extract-chunks` ||
    // extract-css-chunks-webpack-plugin (new)
    module.type === `css/extract-css-chunks`
  );
}
