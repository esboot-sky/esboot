import type { MFSU } from '@/cfg/helpers/mfsu';
import type { AddFunc } from '@/cfg/types';
import type { BundlerWebpackOptions } from '@/types';
import os from 'node:os';
import { isAbsolute, resolve } from 'node:path';

import { createResolvePath, resolveLibPath } from '@dz-web/esboot-common/helpers';

import { isRegExp } from '@dz-web/esboot-common/lodash';

import { env, getPlugins, presets } from './babelrc.config';

const resolvePath = createResolvePath(import.meta.resolve);
export const addJavaScriptRules: AddFunc<{ mfsu: MFSU }> = async (
  cfg,
  webpackCfg,
  options,
) => {
  const { mfsu } = options!;
  const { rootPath, isDev, alias, legacy, bundlerOptions = {}, cwd }
    = cfg.config;

  const {
    extraBabelPlugins = [],
    extraBabelPresets = [],
    extraBabelIncludes = [],
  } = bundlerOptions as BundlerWebpackOptions;

  const babelLoader = resolvePath('babel-loader');
  const threadLoader = {
    loader: resolvePath('thread-loader'),
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
    loader: resolvePath('ts-loader'),
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
        ...getPlugins(cfg, alias, legacy ?? false),
        ...(mfsu?.getBabelPlugins() ?? []),
        isDev && !isExtra && resolvePath('react-refresh/babel'),
      ].filter(Boolean),
    };
  };

  const getExtraBabelIncludes = (): RegExp[] | string[] => {
    return [...extraBabelIncludes].filter(Boolean).map((item: any) => {
      /**
       * @copy from https://github.com/umijs/umi/blob/7228d9941ec76481a91cc4de81c8ad4ebcd714fc/packages/bundler-webpack/src/config/javaScriptRules.ts#L53
       */
      if (isRegExp(item))
        return item;
      if (isAbsolute(item as string))
        return item;

      // resolve npm package name
      try {
        if ((item as string).startsWith('./')) {
          return resolve(cwd, item as string);
        }

        return resolveLibPath(item as string, resolvePath);
      }
      catch (e: any) {
        if (e.code === 'MODULE_NOT_FOUND') {
          throw new Error(`Cannot resolve extraBabelIncludes: ${item}`, {
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
    },
  );
};
