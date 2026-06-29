import type { AddFunc } from '@/cfg/types';

import path from 'node:path';

import { getLocalIdent } from '@dz-web/babel-plugin-react-css-modules/utils';
import {
  addPostcssPluginESBoot,
  addPostcssPluginPx2rem,
  addPostcssPluginTailwindcss,
  addPostcssPluginFontZoom,
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
    sourceMap,
    publicPath,
    rootPath,
  } = cfg.config;

  const isSourceMap = isUndefined(sourceMap) ? isDev : sourceMap;

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
  const postcssPluginPx2rem = await addPostcssPluginPx2rem(cfg);
  const tailwindCSS = await addPostcssPluginTailwindcss(cfg);
  const postcssPluginFontZoom = await addPostcssPluginFontZoom(cfg);

  const postcssPlugins = [
    postcssPluginESBoot,
    tailwindCSS,
    postcssPluginPx2rem,
    postcssPluginFontZoom,
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
