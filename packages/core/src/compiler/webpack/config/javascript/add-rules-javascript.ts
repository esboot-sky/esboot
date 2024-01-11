import esbootConfig from '@@/config';
import { getPlugins, env, presets } from './babel/babelrc.config';

import { ApplyOpts } from '../types';

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

  chainedConfig.module
    .rule('compile')
    .test(/\.(t|j)sx?|mjs$/)
    .include.add(rootPath)
    .merge(extraBabelIncludes)
    .end()
    // 暂时不开，不然include的时候不能用正则
    .exclude.add(/\.*.json$/)
    .end()
    .use('babel-loader')
    .loader(require.resolve('babel-loader'))
    .options({
      cacheDirectory: !isDev,
      presets: [...extraBabelPresets, ...presets].filter(Boolean),
      env,
      plugins: [
        ...extraBabelPlugins,
        ...getPlugins(alias),
        ...(mfsu?.getBabelPlugins() ?? []),
        isDev && require.resolve('react-refresh/babel'),
      ].filter(Boolean),
    })
    .end()
    .use('thread-loader')
    .loader(require.resolve('thread-loader'))
    .options({
      workers: 4,
      workerParallelJobs: 50,
      workerNodeArgs: ['--max-old-space-size=1024'],
      poolTimeout: 2e3,
      poolParallelJobs: 50,
      name: 'my-pool',
    })
    .end()
    .use('ts-loader')
    .loader(require.resolve('ts-loader'))
    .options({
      happyPackMode: true,
      transpileOnly: true,
    });
}
