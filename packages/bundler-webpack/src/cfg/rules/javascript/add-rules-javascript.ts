import os from 'node:os';
import { fileURLToPath } from "node:url";
import { isAbsolute, resolve } from 'node:path';
import { isRegExp } from '@dz-web/esboot-common/lodash';
import { resolveLibPath } from '@dz-web/esboot-common/helpers';
import type { Configuration } from '@dz-web/esboot';

import type { BundlerWebpackOptions } from '@/types';
import type { AddFunc } from '@/cfg/types';

import type { MFSU } from '@/cfg/helpers/mfsu';

import { getPlugins, env, presets } from './babelrc.config';

const resolvePath = (p: string) => fileURLToPath(import.meta.resolve(p));
export const addJavaScriptRules: AddFunc<{ mfsu: MFSU; }> = async (
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

  console.log(extraBabelIncludes, 'cwd');
  const getExtraBabelIncludes = () => {
    return [...extraBabelIncludes].filter(Boolean).map((item) => {
      /**
       * @copy from https://github.com/umijs/umi/blob/7228d9941ec76481a91cc4de81c8ad4ebcd714fc/packages/bundler-webpack/src/config/javaScriptRules.ts#L53
       */
      if (isRegExp(item)) return item;
      if (isAbsolute(item as string)) return item;

      console.log(item, 'item');
      // resolve npm package name
      try {
        if ((item as string).startsWith('./')) {
          return resolve(cwd, item as string);
        }

        return resolveLibPath(item as string, resolvePath);
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
