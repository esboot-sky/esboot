import webpack, { Configuration } from 'webpack';
import webpackbar from 'webpackbar';
import { MFSU } from '@umijs/mfsu';
import { noop, isUndefined } from 'lodash';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { Environment } from '@@webpack/config/environment';

import { addEntry } from '@@webpack/config/add-entry';
import { addDevServer } from '@@webpack/config/add-dev-server';
import { addOptimization } from '@@webpack/config/add-optimization';
import { addResolve } from '@@webpack/config/add-resolve';
import { addOutput } from '@@webpack/config/add-output';
import { addDevtool } from '@@webpack/config/add-devtool';

import { addJavaScriptRules } from '@@webpack/config/javascript/add-rules-javascript';
import { addCSSRules } from '@@webpack/config/add-rules-style';
import { addAssetRules } from '@@webpack/config/add-rules-asset';

// Plugins
import { addInjectBodyPlugin } from '@@webpack/config/plugins/add-plugin-inject-body';
import { addDefinePlugin } from '@@webpack/config/plugins/add-plugin-define';
import { addCopyPlugin } from '@@webpack/config/plugins/add-plugin-copy';
import { addForkTsCheckerWebpackPlugin } from '@@webpack/config/plugins/add-plugin-fork-ts-checker';
import { addBundleAnalyzerPlugin } from '@@webpack/config/plugins/add-plugin-bundle-analyzer';

// Fun
import { addCache } from '@@webpack/config/add-cache';

import esbootConfig from '@@/config';

import { mfsuCacheDir } from '@@/constants';
import { afterHooks } from '@@/helpers/hooks';
import { invokeEachPlugin } from '@@/helpers/plugins';

import { ApplyOpts, CustomConfiguration } from './types';

export interface IOpts {
  env: Environment;
}

let execHooks = false;

const getWebpackConfig = async (opts: IOpts) => {
  const { userOpts } = esbootConfig;
  const config: CustomConfiguration = {
    entry: {},
    plugins: [],
    devServer: {},
    module: {
      rules: [],
    },
  };

  const isDev = opts.env === Environment.dev;

  let mfsu: MFSU | undefined;
  if (isDev && userOpts.mfsu) {
    mfsu = new MFSU({
      cwd: process.cwd(),
      tmpBase: mfsuCacheDir,
      implementor: webpack,
      depBuildConfig: {},
      unMatchLibs: [/rsuite/],
      buildDepWithESBuild: true,
      startBuildWorker: noop as any,
    });
  }

  const applyOpts: ApplyOpts = {
    config,
    userOpts,
    cwd: process.cwd(),
    isDev,
    mfsu,
  };

  await addEntry(applyOpts);
  await addOutput(applyOpts);
  await addResolve(applyOpts);

  // Rules
  await addJavaScriptRules(applyOpts);
  await addCSSRules(applyOpts);
  await addAssetRules(applyOpts);

  // Plugins
  await addInjectBodyPlugin(applyOpts);
  await addDefinePlugin(applyOpts);
  await addCopyPlugin(applyOpts);
  await addForkTsCheckerWebpackPlugin(applyOpts);
  await addBundleAnalyzerPlugin(applyOpts);

  await addOptimization(applyOpts);
  await addDevServer(applyOpts);

  // Fun
  await addCache(applyOpts);
  await addDevtool(applyOpts);

  const {
    externals = {},
    customWebpack,
    analyze,
  } = userOpts;

  // RestPlugins
  const restPlugins: any[] = [
    new webpackbar({
      name: 'ESBoot',
      color: 'magenta',
      fancy: true,
      basic: true,
      profile: analyze,
      reporters: [
        'fancy',
        analyze && 'profile',
        {
          afterAllDone() {
            if (!execHooks) afterHooks();
            execHooks = true;
          },
        },
      ].filter(Boolean) as any[],
    }),
    isDev && new ReactRefreshWebpackPlugin(),
    !isDev &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:5].css',
        chunkFilename: 'css/[id].[contenthash:5].css',
      }),
  ].filter(Boolean);

  config.plugins.push(...restPlugins);

  // Other Config
  if (isDev) {
    Object.assign(config, {
      stats: 'errors-only',
      infrastructureLogging: {
        level: 'error',
      },
    });
  }

  Object.assign(config, {
    mode: isDev ? Environment.dev : Environment.prod,
    performance: {
      hints: isDev ? false : 'warning',
    },
    externals,
  });

  const depConfig = {
    output: {},
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },
      ],
    },
    plugins: [],
  };

  if (mfsu) await mfsu.setWebpackConfig({ config, depConfig } as any);

  invokeEachPlugin((plugin) => plugin?.customWebpack?.(config, applyOpts));
  return customWebpack ? customWebpack(config, applyOpts) : config;
};

export default getWebpackConfig;
