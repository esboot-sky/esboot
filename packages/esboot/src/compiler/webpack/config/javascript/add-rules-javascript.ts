import esbootConfig from '@@/config';
import { getPlugins, env, presets } from './babel/babelrc.config';

import { ApplyOpts } from '../types';

const threadLoaderOptions = {
  workers: 4,
  workerParallelJobs: 50,
  workerNodeArgs: ['--max-old-space-size=1024'],
  poolTimeout: 2e3,
  poolParallelJobs: 50,
  name: 'my-pool',
};

const tsLoaderOptions = {
  happyPackMode: true,
  transpileOnly: true,
};

export async function addJavaScriptRules(applyOpts: ApplyOpts) {
  const { rootPath } = esbootConfig.compileTimeConfig;

  const {
    chainedConfig,
    isDev,
    mfsu,
    userOpts: {
      extraBabelPlugins,
      extraBabelPresets,
      extraBabelIncludes = [],
      alias,
    },
  } = applyOpts;

  const babelLoaderOptions = {
    cacheDirectory: !isDev,
    presets: [...extraBabelPresets, ...presets].filter(Boolean),
    env,
    plugins: [
      ...extraBabelPlugins,
      ...getPlugins(alias),
      ...(mfsu?.getBabelPlugins() ?? []),
      isDev && require.resolve('react-refresh/babel'),
    ].filter(Boolean),
  };

  chainedConfig.module
    .rule('javascript')
    .test(/\.(t|j)sx?|mjs$/)
    .include.add(rootPath)
    .merge(extraBabelIncludes)
    .end()
    // For now, don't enable it; otherwise, regular expressions cannot be used during inclusion
    .exclude.add(/\.*.json$/)
    .end()
    // babel-loader
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options(babelLoaderOptions)
    .end()
    // thread-loader
    .use('thread-loader')
    .loader(require.resolve('thread-loader'))
    .options(threadLoaderOptions)
    .end()
    // ts-loader
    .use('ts-loader')
    .loader(require.resolve('ts-loader'))
    .options(tsLoaderOptions);
}
