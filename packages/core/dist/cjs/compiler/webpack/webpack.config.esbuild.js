// src/compiler/webpack/webpack.config.esbuild.js
var path = require("path");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var TerserPlugin = require("terser-webpack-plugin");
var CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var webpack = require("webpack");
var CopyPlugin = require("copy-webpack-plugin");
var SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
var FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
var { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
var ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
var pxtorem = require("@alitajs/postcss-plugin-px2rem");
var esbuild = require("esbuild");
var {
  getLocalIdent
  // eslint-disable-next-line import/no-unresolved
} = require("@dr.pogodin/babel-plugin-react-css-modules/utils");
var libPath = path.resolve(__dirname, "../../");
var helpersPath = path.join(libPath, "./helpers/config");
var getEntryList = require(path.resolve(__dirname, "./helpers/entry"));
var postcssNormalize = require("postcss-normalize");
var { MFSU, esbuildLoader } = require("@umijs/mfsu");
var { ESBOOT_CONFIG_PATH, ESBOOT_RELATIVE_STATIC_CONFIG_PATH, ESBOOT_IS_MOBILE } = require(path.join(helpersPath, "./config"));
var pkg = require("./package.json");
var userConfig = require(ESBOOT_CONFIG_PATH);
var ip = require(path.join(helpersPath, "./helpers/ip"));
var entryList = getEntryList();
var mfsu = new MFSU({
  implementor: webpack,
  buildDepWithESBuild: true
});
var smp = new SpeedMeasurePlugin();
var isDevMode = process.env.NODE_ENV === "development";
if (isDevMode) {
  console.log(
    entryList.map((item) => ({
      ...item,
      url: `http://${ip}:${userConfig.serverPort}/${item.name}.html`
    })),
    "<-- entryList"
  );
}
var parseScssModule = (options = {}) => {
  const { modules } = options;
  const cssLoaderOptions = {
    sourceMap: isDevMode
  };
  if (modules) {
    Object.assign(cssLoaderOptions, {
      importLoaders: 2,
      modules: {
        namedExport: true,
        localIdentContext: path.resolve(__dirname, "src"),
        getLocalIdent,
        localIdentName: "[name]__[local]__[contenthash:base64:5]"
      }
    });
  }
  return [
    isDevMode ? "style-loader" : MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: cssLoaderOptions
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: isDevMode,
        postcssOptions: {
          plugins: [
            ESBOOT_IS_MOBILE && pxtorem({
              rootValue: 100,
              unitPrecision: 5,
              propWhiteList: [],
              propBlackList: [],
              exclude: false,
              selectorBlackList: [],
              ignoreIdentifier: false,
              replace: true,
              mediaQuery: false,
              minPixelValue: 0
            }),
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009"
              },
              stage: 3
            }),
            postcssNormalize()
          ].filter(Boolean)
        }
      }
    },
    {
      loader: "sass-loader",
      options: { sourceMap: isDevMode }
    }
  ];
};
var createEntry = () => entryList.reduce((prev, curr) => {
  prev[curr.name] = curr.entry;
  return prev;
}, {});
var getPlugins = () => [
  // !isDevMode && new BundleAnalyzerPlugin(),
  ...entryList.map(
    (i) => new HtmlWebpackPlugin({
      inject: "auto",
      chunks: [i.name],
      filename: `${i.name}.html`,
      title: i.title || "ESboot App",
      template: i.template || "template/index.html",
      templateParameters: {
        configPath: `${ESBOOT_RELATIVE_STATIC_CONFIG_PATH}?v=${pkg.version}`
      },
      hash: true
    })
  ),
  new webpack.DefinePlugin({
    VERSION: JSON.stringify(pkg.version),
    ENV: JSON.stringify(process.env.NODE_ENV)
  }),
  new FriendlyErrorsWebpackPlugin(),
  new CopyPlugin({
    patterns: userConfig.copyFile
  }),
  isDevMode && new ReactRefreshPlugin(),
  isDevMode && new ForkTsCheckerWebpackPlugin({})
];
var getModulesRules = () => [
  {
    test: /\.(jpg|gif|png|svg|ico)$/,
    type: "asset",
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024
      }
    },
    generator: {
      filename: "images/[name].[hash:8][ext]"
    }
  },
  {
    test: /\.[jt]sx?$/,
    exclude: /node_modules/,
    use: {
      loader: esbuildLoader,
      options: {
        handler: [
          ...mfsu.getEsbuildLoaderHandler()
        ],
        target: "esnext",
        implementation: esbuild
      }
    }
  },
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"]
  },
  {
    test: /\.scss$/,
    exclude: path.resolve(__dirname, "src/global-css/"),
    use: parseScssModule({ modules: true })
  },
  {
    test: /\.scss$/,
    include: path.resolve(__dirname, "src/global-css/"),
    use: parseScssModule()
  }
];
var getDevServer = () => ({
  compress: true,
  hot: true,
  historyApiFallback: {
    disableDotRule: true
  },
  setupMiddlewares(middlewares) {
    middlewares.unshift(...mfsu.getMiddlewares());
    return middlewares;
  },
  port: userConfig.serverPort,
  host: "0.0.0.0"
});
var baseCfg = {
  mode: isDevMode ? "development" : "production",
  performance: {
    hints: false
  },
  entry: createEntry(),
  resolve: {
    extensions: [".ts", ".tsx", ".jsx", ".js"],
    alias: {
      "@": path.resolve(__dirname, contentRelativePath, "./src"),
      "@mobile": path.resolve(__dirname, contentRelativePath, "./src/platforms/mobile"),
      "@mobile-native": path.resolve(__dirname, contentRelativePath, "./src/platforms/mobile/native"),
      "@mobile-browser": path.resolve(__dirname, contentRelativePath, "./src/platforms/mobile/browser"),
      "@pc": path.resolve(__dirname, contentRelativePath, "./src/platforms/pc"),
      "@pc-native": path.resolve(__dirname, contentRelativePath, "./src/platforms/pc/native"),
      "@pc-browser": path.resolve(__dirname, contentRelativePath, "./src/platforms/pc/browser")
    }
  },
  output: {
    publicPath: "/",
    clean: !isDevMode,
    filename: isDevMode ? "js/[name].js" : "js/[name].[chunkhash:5].js"
  },
  plugins: getPlugins().filter(Boolean),
  module: {
    rules: getModulesRules()
  }
};
var devCfg = {
  devServer: getDevServer(),
  devtool: "cheap-source-map"
};
var prodCfg = {
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "vendor",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/
        }
      }
    },
    emitOnErrors: true,
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          format: {
            comments: false
          }
        }
      }),
      new CssMinimizerPlugin()
    ]
  }
  // externalsType: 'script',
  // externals: {
  //   'react': ['https://unpkg.com/react@17.0.2/umd/react.production.min.js', 'React', 'head'],
  //   'react-dom': ['https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js', 'ReactDOM', 'head'],
  //   'react-router-dom': [
  //     'https://unpkg.com/react-router-dom@6.3.0/umd/react-router-dom.production.min.js',
  //     'ReactRouterDOM',
  //     'head'
  //   ],
  //   // 'react': 'React',
  //   // 'react-dom': 'ReactDOM'
  // },
};
var cfg = Object.assign(baseCfg, isDevMode && devCfg, !isDevMode && prodCfg);
if (!isDevMode) {
  cfg.plugins.push(new MiniCssExtractPlugin({
    filename: "css/[name].[contenthash:5].css",
    chunkFilename: "css/[id].[contenthash:5].css"
  }));
}
var getConfig = async () => {
  await mfsu.setWebpackConfig({
    config: cfg
  });
  return cfg;
};
module.exports = isDevMode ? getConfig() : cfg;
