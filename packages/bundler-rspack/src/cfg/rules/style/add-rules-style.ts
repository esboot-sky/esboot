import type { AddFunc } from '@/cfg/types';

import path from 'node:path';

// @ts-expect-error - no types available
import pxtorem from '@alitajs/postcss-plugin-px2rem';
import { getLocalIdent } from '@dz-web/babel-plugin-react-css-modules/utils';
import {
  addPostcssPluginESBoot,
  addPostcssPluginTailwindcss,
} from '@dz-web/esboot-bundler-common';
import { createResolvePath } from '@dz-web/esboot-common/helpers';
import { isUndefined } from '@dz-web/esboot-common/lodash';
import { CssExtractRspackPlugin as MiniCssExtractPlugin } from '@rspack/core';
// @ts-expect-error - no types available
import postcssNormalize from 'postcss-normalize';
import postcssPresetEnv from 'postcss-preset-env';

import {
  getCssHashRule,
  getCssLoaderOptions,
  getMiniCssExtractPluginOptions,
  getStyleLoader,
} from './utils';

const resolvePath = createResolvePath(import.meta.resolve);

interface ParseScssModuleOpts {
  modules?: boolean;
}

export const addStyleRules: AddFunc = async (cfg, rspackCfg) => {
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
      path.join(rootPath, './platforms/pc/styles/'),
    );
  }

  const styleLoader = getStyleLoader();
  const miniCssExtractPluginOptions = getMiniCssExtractPluginOptions();
  if (publicPath === './')
    miniCssExtractPluginOptions.publicPath = '../';

  const cssLoaderOptions = {
    sourceMap: isSourceMap,
    ...getCssLoaderOptions(),
  };

  const postcssPluginESBoot = await addPostcssPluginESBoot(cfg);
  const tailwindCSS = await addPostcssPluginTailwindcss(cfg);

  const postcssPlugins = [
    postcssPluginESBoot,
    tailwindCSS,
    enablePxToRemByCompatibility
    && pxtorem({
      rootValue: 200,
      unitPrecision: 5,
      propWhiteList: [],
      propBlackList: [],
      exclude: false,
      selectorBlackList: [],
      ignoreIdentifier: false,
      replace: true,
      mediaQuery: false,
      minPixelValue: 0,
      ...pxtoremCustom,
    }),
    postcssPresetEnv({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
    postcssNormalize(),
  ].filter(Boolean);

  const parseScssModule = (options: ParseScssModuleOpts) => {
    const { modules = false } = options;

    const cssLoaderOptionsCopy = { ...cssLoaderOptions, importLoaders: 2 };

    if (modules) {
      Object.assign(cssLoaderOptionsCopy, {
        modules: {
          namedExport: false,
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
        loader: resolvePath('css-loader'),
        options: cssLoaderOptionsCopy,
      },
      {
        loader: resolvePath('postcss-loader'),
        options: {
          sourceMap: isSourceMap,
          postcssOptions: {
            plugins: postcssPlugins,
          },
        },
      },
      {
        loader: resolvePath('sass-loader'),
        options: {
          sourceMap: isSourceMap,
          api: 'modern-compiler',
          implementation: resolvePath('sass-embedded'),
        },
      },
    ];
  };

  rspackCfg.module.rules.push(
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
          loader: resolvePath('css-loader'),
          options: cssLoaderOptions,
        },
        {
          loader: resolvePath('postcss-loader'),
          options: {
            sourceMap: isSourceMap,
            postcssOptions: {
              plugins: postcssPlugins,
            },
          },
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
    },
  );

  if (!isDev) {
    rspackCfg.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[id].[contenthash:8].css',
      }),
    );
  }
};
