import path from 'path';
import { isUndefined } from '@dz-web/esboot-common/lodash';

import type { ConfigurationInstance } from '@dz-web/esboot';
import Config from 'webpack-5-chain';

import {
  getCssHashRule,
  getStyleLoader,
  getMiniCssExtractPluginOptions,
  getCssLoaderOptions,
} from './utils';

const postcssNormalize = require('postcss-normalize');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const pxtorem = require('@alitajs/postcss-plugin-px2rem');
const {
  getLocalIdent,
} = require('@dz-web/babel-plugin-react-css-modules/utils');

interface ParseScssModuleOpts {
  modules?: boolean;
}

export async function addStyleRules(
  cfg: ConfigurationInstance,
  webpackChain: Config
) {
  const {
    isDev,
    isSP,
    px2rem: px2remOptions,
    sourceMap,
    publicPath,
    rootPath,
    isMobile,
  } = cfg.config;

  const isSourceMap = isUndefined(sourceMap) ? isDev : sourceMap;
  const { enable: enablePxToRem, ...pxtoremCustom } = px2remOptions;
  const enablePxToRemByCompatibility = isUndefined(enablePxToRem)
    ? isMobile
    : enablePxToRem;

  const globalScssPathList = [path.join(rootPath, './styles/')];
  if (!isSP) {
    globalScssPathList.push(
      path.join(rootPath, './platforms/mobile/styles/'),
      path.join(rootPath, './platforms/pc/styles/')
    );
  }

  const cssLoaderOptions = {
    sourceMap: isSourceMap,
    ...getCssLoaderOptions(),
  };

  const styleLoader = getStyleLoader();
  const miniCssExtractPluginOptions = getMiniCssExtractPluginOptions();
  if (publicPath === './') miniCssExtractPluginOptions.publicPath = '../';

  webpackChain.module
    .rule('css')
    .test(/\.css$/)
    .use('style-loader')
    .loader(isDev ? styleLoader.loader : MiniCssExtractPlugin.loader)
    .options(isDev ? styleLoader.options : miniCssExtractPluginOptions)
    .end()
    .use('css-loader')
    .loader(require.resolve('css-loader'))
    .options(cssLoaderOptions)
    .end();

  webpackChain.module
    .rule('scss')
    .test(/\.scss$/)
    .oneOf('global')
    .include.add(globalScssPathList)
    .end()
    .use('style-loader')
    .loader(isDev ? styleLoader.loader : MiniCssExtractPlugin.loader)
    .options(isDev ? styleLoader.options : miniCssExtractPluginOptions)
    .end()
    .use('css-loader')
    .loader(require.resolve('css-loader'))
    .options({ ...cssLoaderOptions, importLoaders: 2 })
    .end()
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      sourceMap: isSourceMap,
      postcssOptions: {
        plugins: [
          enablePxToRemByCompatibility &&
            pxtorem({
              rootValue: 200,
              unitPrecision: 5,
              ...pxtoremCustom,
            }),
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: { flexbox: 'no-2009' },
            stage: 3,
          }),
          postcssNormalize(),
        ].filter(Boolean),
      },
    })
    .end()
    .use('sass-loader')
    .loader(require.resolve('sass-loader'))
    .options({ sourceMap: isSourceMap })
    .end();

  webpackChain.module
    .rule('scss')
    .oneOf('module')
    .exclude.add(globalScssPathList)
    .end()
    .use('style-loader')
    .loader(isDev ? styleLoader.loader : MiniCssExtractPlugin.loader)
    .options(isDev ? styleLoader.options : miniCssExtractPluginOptions)
    .end()
    .use('css-loader')
    .loader(require.resolve('css-loader'))
    .options({
      ...cssLoaderOptions,
      modules: {
        namedExport: true,
        localIdentContext: rootPath,
        getLocalIdent,
        localIdentName: getCssHashRule(),
      },
    })
    .end()
    .use('postcss-loader')
    .loader(require.resolve('postcss-loader'))
    .options({
      sourceMap: isSourceMap,
      postcssOptions: {
        plugins: [
          enablePxToRemByCompatibility &&
            pxtorem({
              rootValue: 200,
              unitPrecision: 5,
              ...pxtoremCustom,
            }),
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: { flexbox: 'no-2009' },
            stage: 3,
          }),
          postcssNormalize(),
        ].filter(Boolean),
      },
    })
    .end()
    .use('sass-loader')
    .loader(require.resolve('sass-loader'))
    .options({ sourceMap: isSourceMap })
    .end();
}
