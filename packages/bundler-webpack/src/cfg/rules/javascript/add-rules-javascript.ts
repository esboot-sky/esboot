import os from 'node:os';
import { dirname, isAbsolute } from 'node:path';
import { isRegExp } from '@dz-web/esboot-common/lodash';
import type { Configuration } from '@dz-web/esboot';
import resolve from 'resolve';

import type { BundlerWebpackOptions } from '@/types';
import type { AddFunc } from '@/cfg/types';

import type { MFSU } from '@/cfg/helpers/mfsu';

import { getPlugins, env, presets } from './babelrc.config';

export const addJavaScriptRules: AddFunc<{ mfsu: MFSU }> = async (
  cfg,
  webpackCfg,
  options
) => {
  const { mfsu } = options!;
  const { rootPath, isDev, alias, legacy, bundlerOptions, cwd } =
    cfg.config as Configuration<BundlerWebpackOptions>;

  const {
    extraBabelPlugins = [],
    extraBabelPresets = [],
    extraBabelIncludes = [],
  } = bundlerOptions;

  const babelLoader = require.resolve('babel-loader');
  const threadLoader = {
    loader: require.resolve('thread-loader'),
    options: {
      workers: os.cpus().length,
      workerParallelJobs: 50,
      workerNodeArgs: ['--max-old-space-size=1024'],
      poolTimeout: 2e3,
      poolParallelJobs: 50,
      name: 'ESBoot-Thread-Pool',
    },
  };
  const tsLoader = {
    loader: require.resolve('ts-loader'),
    options: {
      happyPackMode: true,
      transpileOnly: true,
    },
  };
  const getBabelLoaderOptions = (isExtra = false) => {
    return {
      cacheDirectory: !isDev,
      presets: [...extraBabelPresets, ...presets].filter(Boolean),
      env,
      plugins: [
        ...extraBabelPlugins,
        ...getPlugins(alias, legacy),
        ...(mfsu?.getBabelPlugins() ?? []),
        isDev && !isExtra && require.resolve('react-refresh/babel'),
      ].filter(Boolean),
    };
  };

  const getExtraBabelIncludes = () => {
    return [...extraBabelIncludes].filter(Boolean).map((item) => {
      /**
       * @copy from https://github.com/umijs/umi/blob/7228d9941ec76481a91cc4de81c8ad4ebcd714fc/packages/bundler-webpack/src/config/javaScriptRules.ts#L53
       */
      // regexp
      if (isRegExp(item)) {
        return item;
      }

      // handle absolute path
      if (isAbsolute(item as string)) {
        return item;
      }

      // resolve npm package name
      try {
        if ((item as string).startsWith('./')) {
          return require.resolve(item as string, { paths: [cwd] });
        }
        // use resolve instead of require.resolve
        // since require.resolve may meet the ERR_PACKAGE_PATH_NOT_EXPORTED error
        return dirname(
          resolve.sync(`${item as string}/package.json`, {
            basedir: cwd,
            // same behavior as webpack, to ensure `include` paths matched
            // ref: https://webpack.js.org/configuration/resolve/#resolvesymlinks
            preserveSymlinks: false,
          })
        );
      } catch (e: any) {
        if (e.code === 'MODULE_NOT_FOUND') {
          throw new Error('Cannot resolve extraBabelIncludes: ' + item, {
            cause: e,
          });
        }
        throw e;
      }
    });
  };

  webpackCfg.module.rules.push(
    {
      test: /\.tsx?$/,
      include: [rootPath],
      exclude: [/node_modules/, /config\.js$/],
      use: [
        {
          loader: babelLoader,
          options: getBabelLoaderOptions(),
        },
        threadLoader,
        tsLoader,
      ],
    },
    {
      test: /\.(js|mjs|cjs)$/,
      include: getExtraBabelIncludes(),
      exclude: [rootPath, /\.json$/],
      use: [
        {
          loader: babelLoader,
          options: {
            ...getBabelLoaderOptions(true),
          },
        },
        threadLoader,
      ],
    }
  );
};
