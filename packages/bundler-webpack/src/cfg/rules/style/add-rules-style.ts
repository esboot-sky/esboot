import path from 'node:path';
import { isUndefined } from '@dz-web/esboot-common/lodash';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {
  addPostcssPluginTailwindcss,
  addPostcssPluginPx2rem,
} from '@dz-web/esboot-bundler-common';

import type { AddFunc } from '@/cfg/types';

import {
  getCssHashRule,
  getStyleLoader,
  getMiniCssExtractPluginOptions,
  getCssLoaderOptions,
} from './utils';

const postcssNormalize = require('postcss-normalize');
const {
  getLocalIdent,
} = require('@dz-web/babel-plugin-react-css-modules/utils');

interface ParseScssModuleOpts {
  modules?: boolean;
}

export const addStyleRules: AddFunc = async (cfg, webpackCfg) => {
  const { isDev, isSP, sourceMap, publicPath, rootPath } = cfg.config;

  const isSourceMap = isUndefined(sourceMap) ? isDev : sourceMap;

  const globalScssPathList = [path.join(rootPath, './styles/')];
  if (!isSP) {
    globalScssPathList.push(
      path.join(rootPath, './platforms/mobile/styles/'),
      path.join(rootPath, './platforms/pc/styles/')
    );
  }

  const postcssPluginPx2rem = addPostcssPluginPx2rem(cfg);
  const postcssPluginTailwindcss = addPostcssPluginTailwindcss(cfg);

  const styleLoader = getStyleLoader();
  const miniCssExtractPluginOptions = getMiniCssExtractPluginOptions();
  if (publicPath === './') miniCssExtractPluginOptions.publicPath = '../';

  const cssLoaderOptions = {
    sourceMap: isSourceMap,
    ...getCssLoaderOptions(),
  };

  const parseScssModule = (options: ParseScssModuleOpts) => {
    const { modules = false } = options;

    const cssLoaderOptionsCopy = { ...cssLoaderOptions, importLoaders: 2 };

    if (modules) {
      Object.assign(cssLoaderOptionsCopy, {
        modules: {
          namedExport: true,
          localIdentContext: rootPath,
          getLocalIdent,
          localIdentName: getCssHashRule(),
        },
      });
    }

    return [
      isDev
        ? styleLoader
        : {
            loader: MiniCssExtractPlugin.loader,
            options: miniCssExtractPluginOptions,
          },
      {
        loader: require.resolve('css-loader'),
        options: cssLoaderOptionsCopy,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          sourceMap: isSourceMap,
          postcssOptions: {
            plugins: [
              postcssPluginTailwindcss,
              postcssPluginPx2rem,
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              postcssNormalize(),
            ].filter(Boolean),
          },
        },
      },
      {
        loader: require.resolve('sass-loader'),
        options: { sourceMap: isSourceMap },
      },
    ];
  };

  webpackCfg.module.rules.push(
    {
      /* Loads CSS stylesheets. It is assumed that CSS stylesheets come only
       * from dependencies, as we use SCSS inside our own code. */
      test: /\.css$/,
      use: [
        isDev
          ? styleLoader
          : {
              loader: MiniCssExtractPlugin.loader,
              options: getMiniCssExtractPluginOptions(),
            },
        {
          loader: require.resolve('css-loader'),
          options: cssLoaderOptions,
        },
      ],
    },
    {
      test: /\.scss$/,
      oneOf: [
        {
          exclude: globalScssPathList,
          use: parseScssModule({ modules: true }),
        },
        {
          include: globalScssPathList,
          use: parseScssModule({}),
        },
      ],
    }
  );

  if (!isDev) {
    webpackCfg.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:5].css',
        chunkFilename: 'css/[id].[contenthash:5].css',
      })
    );
  }
};
