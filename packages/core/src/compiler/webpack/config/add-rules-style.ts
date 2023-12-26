import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import postcssNormalize from 'postcss-normalize';
// import LightningCSS from 'lightningcss';
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

// export const getCssHashRule = () =>
//   process.env.NODE_ENV === 'production'
//     ? '[local]__[contenthash:base64:5]'
//     : '[name]__[local]__[contenthash:base64:5]';
// : '[package]___[path][name]___[local]___[hash:base64:6]';

export const getCssHashRule = () => '[local]__[contenthash:base64:8]';
const getStyleLoader = (): Record<string, any> => ({
  loader: require.resolve('style-loader'),
  options: {
    esModule: true,
  },
});
const getMiniCssExtractPluginOptions = (): Record<string, any> => ({
  emit: true,
  esModule: true,
});
const getCssLoaderOptions = (): Record<string, any> => ({
  esModule: true,
  import: true,
});

export async function addCSSRules(applyOpts: ApplyOpts) {
  const {
    config,
    isDev,
    userOpts: { isRelativePublicPath, pxtorem: pxtoremAllOptions, sourceMap },
  } = applyOpts;
  const isSourceMap = isUndefined(sourceMap) ? isDev : sourceMap;
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

    const miniCssExtractPluginOptions = getMiniCssExtractPluginOptions();
    if (isRelativePublicPath) miniCssExtractPluginOptions.publicPath = '../';

    return [
      isDev
        ? getStyleLoader()
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
        options: { sourceMap: isSourceMap },
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
          ? getStyleLoader()
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
}
