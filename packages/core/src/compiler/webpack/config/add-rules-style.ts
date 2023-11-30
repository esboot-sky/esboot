import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssNormalize from 'postcss-normalize';
import LightningCSS from 'lightningcss';
import { isUndefined } from 'lodash';

const pxtorem = require('@alitajs/postcss-plugin-px2rem');
const {
  getLocalIdent,
} = require('@dz-web/babel-plugin-react-css-modules/utils');

import esbootConfig from '@@/config';

import { ApplyOpts } from './types';

interface ParseScssModuleOpts {
  modules?: boolean;
}

export async function addCSSRules(applyOpts: ApplyOpts) {
  const {
    config,
    isDev,
    userOpts: { isRelativePublicPath, pxtorem: pxtoremAllOptions },
  } = applyOpts;
  const { enable: enablePxToRem, ...pxtoremCustom } = pxtoremAllOptions;
  const { rootPath, isMobile } = esbootConfig.compileTimeConfig;
  const enablePxToRemByCompatibility = isUndefined(enablePxToRem)
    ? isMobile
    : enablePxToRem;

  const globalScssPathList = [
    path.join(rootPath, './styles/'),
    path.join(rootPath, './platforms/mobile/styles/'),
    path.join(rootPath, './platforms/pc/styles/'),
  ];

  const parseScssModule = (options: ParseScssModuleOpts) => {
    const { modules = false } = options;
    const cssLoaderOptions = {
      sourceMap: isDev,
    };
    if (modules) {
      Object.assign(cssLoaderOptions, {
        importLoaders: 2,
        modules: {
          namedExport: true,
          localIdentContext: rootPath,
          getLocalIdent,
          localIdentName: '[name]__[local]__[contenthash:base64:5]',
        },
      });
    }
    return [
      isDev
        ? require.resolve('style-loader')
        : {
            loader: MiniCssExtractPlugin.loader,
            options: isRelativePublicPath ? { publicPath: '../' } : {},
          },
      {
        loader: require.resolve('css-loader'),
        options: cssLoaderOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          sourceMap: isDev,
          postcssOptions: {
            plugins: [
              enablePxToRemByCompatibility &&
                pxtorem({
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
      // {
      //   loader: require.resolve('lightningcss-loader'),
      //   options: {
      //     implementation: LightningCSS
      //   },
      // },
      {
        loader: require.resolve('sass-loader'),
        options: { sourceMap: isDev },
      },
    ];
  };

  config.module.rules.push(
    {
      /* Loads CSS stylesheets. It is assumed that CSS stylesheets come only
       * from dependencies, as we use SCSS inside our own code. */
      test: /\.css$/,
      use: [
        isDev
          ? require.resolve('style-loader')
          : {
              loader: MiniCssExtractPlugin.loader,
              // options: isRelativePublicPath ? { publicPath: '../' } : {},
            },
        ,
        require.resolve('css-loader'),
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
}
