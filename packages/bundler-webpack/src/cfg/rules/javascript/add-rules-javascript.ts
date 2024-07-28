import type { Configuration, ConfigurationInstance } from '@dz-web/esboot';
import Config from 'webpack-5-chain';

import { BundlerWebpackOptions } from '@/types';

import { getPlugins, env, presets } from './babelrc.config';

export const addJavaScriptRules = async (
  cfg: ConfigurationInstance,
  webpackChain: Config
) => {
  const { rootPath, isDev, alias, bundlerOptions } =
    cfg.config as Configuration<BundlerWebpackOptions>;

  const {
    extraBabelPlugins = [],
    extraBabelPresets = [],
    extraBabelIncludes = [],
  } = bundlerOptions;

  webpackChain.module
    .rule('javaScriptRules')
    .test(/\.(t|j)sx?|mjs$/)
    .include.add(rootPath)
    .end()
    .when(extraBabelIncludes.length > 0, (rule) =>
      rule.include.add(extraBabelIncludes.filter(Boolean))
    )
    // Temporarily disabled, otherwise regular expressions cannot be used for include
    .exclude.add(/\.*.json$/)
    .end()
    //
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({
      cacheDirectory: !isDev,
      presets: [...extraBabelPresets, ...presets].filter(Boolean),
      env,
      plugins: [
        ...extraBabelPlugins,
        ...getPlugins(alias),
        // ...(mfsu?.getBabelPlugins() ?? []),
        isDev && require.resolve('react-refresh/babel'),
      ].filter(Boolean),
    })
    .end()
    //
    .use('thread-loader')
    .loader(require.resolve('thread-loader'))
    .options({
      workerParallelJobs: 50,
      workerNodeArgs: ['--max-old-space-size=1024'],
      poolTimeout: 2e3,
      poolParallelJobs: 50,
      name: 'ESBoot-Pool',
    })
    .end()
    //
    .use('ts-loader')
    .loader(require.resolve('ts-loader'))
    .options({
      happyPackMode: true,
      transpileOnly: true,
    })
    .end();
};
