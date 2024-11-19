import os from 'node:os';
import type { Configuration } from '@dz-web/esboot';

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
  const { rootPath, isDev, alias, legacy, bundlerOptions } =
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
      include: [...extraBabelIncludes].filter(Boolean),
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
