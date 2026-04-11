import type { MFSU } from '@/cfg/helpers/mfsu';
import type { AddFunc } from '@/cfg/types';
import type { BundlerWebpackOptions } from '@/types';
import os from 'node:os';
import { isAbsolute, resolve } from 'node:path';

import { createResolvePath, resolveLibPath } from '@dz-web/esboot-common/helpers';

import { isRegExp } from '@dz-web/esboot-common/lodash';

import { env, getPlugins, presets } from './babelrc.config';

const resolvePath = createResolvePath(import.meta.resolve);
const TS_JS_RE = /\.tsx?$/;
const NODE_MODULES_RE = /node_modules/;
const CONFIG_JS_RE = /config\.js$/;
const EXTRA_JS_RE = /\.(js|mjs|cjs)$/;
const JSON_RE = /\.json$/;

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
  const threadLoaders = isDev ? [] : [threadLoader];
  const getBabelLoaderOptions = (isExtra = false): Record<string, any> => {
    return {
      cacheDirectory: true,
      cacheCompression: false,
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
    return [...extraBabelIncludes].filter(Boolean).map((item) => {
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

        return resolveLibPath(item as string, import.meta.resolve);
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
      test: TS_JS_RE,
      include: [rootPath],
      exclude: [NODE_MODULES_RE, CONFIG_JS_RE],
      use: [
        {
          loader: babelLoader,
          options: getBabelLoaderOptions(),
        },
        ...threadLoaders,
        tsLoader,
      ],
    },
    {
      test: EXTRA_JS_RE,
      include: getExtraBabelIncludes(),
      exclude: [rootPath, JSON_RE],
      use: [
        {
          loader: babelLoader,
          options: {
            ...getBabelLoaderOptions(true),
          },
        },
        ...threadLoaders,
      ],
    },
  );
};
