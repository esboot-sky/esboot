import esbootConfig from '@@/config';
import { plugins, env, presets } from './babel/babelrc.config';

import { ApplyOpts } from '../types';

export async function addJavaScriptRules(applyOpts: ApplyOpts) {
  const { rootPath } = esbootConfig.extralConfig;

  const {
    config,
    isDev,
    mfsu,
    userOpts: { extraBabelPlugins, extraBabelPresets, extraBabelIncludes }
  } = applyOpts;

  config.module.rules.push({
    test: /\.(t|j)sx?$/,
    include: [
      rootPath,
      ...extraBabelIncludes,
    ].filter(Boolean),
    // exclude: /(node_modules|bower_components)/,
    use: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: !isDev,
          presets: [
            ...extraBabelPresets,
            ...presets,
          ].filter(Boolean),
          env,
          plugins: [
            ...extraBabelPlugins,
            ...plugins,
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
          name: 'my-pool',
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
}
