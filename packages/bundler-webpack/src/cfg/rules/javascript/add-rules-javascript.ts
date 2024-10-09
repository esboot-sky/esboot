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
  const { rootPath, isDev, alias, bundlerOptions } =
    cfg.config as Configuration<BundlerWebpackOptions>;

  const {
    extraBabelPlugins = [],
    extraBabelPresets = [],
    extraBabelIncludes = [],
  } = bundlerOptions;

  webpackCfg.module.rules.push({
    test: /\.(t|j)sx?|mjs$/,
    include: [rootPath, ...extraBabelIncludes].filter(Boolean),
    // 暂时不开，不然include的时候不能用正则
    exclude: /\.*.json$/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: !isDev,
          presets: [...extraBabelPresets, ...presets].filter(Boolean),
          env,
          plugins: [
            ...extraBabelPlugins,
            ...getPlugins(alias),
            ...(mfsu?.getBabelPlugins() ?? []),
            isDev && require.resolve('react-refresh/babel'),
          ].filter(Boolean),
        },
      },
      {
        loader: require.resolve('thread-loader'),
        options: {
          workers: 4,
          workerParallelJobs: 50,
          workerNodeArgs: ['--max-old-space-size=1024'],
          poolTimeout: 2e3,
          poolParallelJobs: 50,
          name: 'ESBoot-thread-pool',
        },
      },
      {
        loader: require.resolve('ts-loader'),
        options: {
          happyPackMode: true,
          transpileOnly: true,
        },
      },
    ],
  });
};
