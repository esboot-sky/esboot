var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/compiler/webpack/webpack.config.js
var path = require("path");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var TerserPlugin = require("terser-webpack-plugin");
var CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var InjectBodyPlugin = require("inject-body-webpack-plugin").default;
var portfinder = require("portfinder");
var webpack = require("webpack");
var CopyPlugin = require("copy-webpack-plugin");
var SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
var FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
var { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
var ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
var pxtorem = require("@alitajs/postcss-plugin-px2rem");
var {
  getLocalIdent
  // eslint-disable-next-line import/no-unresolved
} = require("@dr.pogodin/babel-plugin-react-css-modules/utils");
var createMultiPlatform = require("../../scripts/create-multi-platform");
var postcssNormalize = require("postcss-normalize");
var { MFSU } = require("@umijs/mfsu");
var srcPath = path.resolve("./src");
var libPath = path.resolve(__dirname, "../../");
var helpersPath = path.join(libPath, "./helpers");
var getEntryList = require(path.resolve(__dirname, "./helpers/entry"));
var ip = require(path.join(helpersPath, "./ip"));
var pkg = require(path.resolve(process.cwd(), "./package.json"));
var { ESBOOT_CONFIG_PATH, ESBOOT_RELATIVE_STATIC_CONFIG_PATH, ESBOOT_IS_MOBILE, ESBOOT_IS_BROWSER, isDevMode, publicPath } = require(path.join(helpersPath, "./config"));
var userConfig = require(ESBOOT_CONFIG_PATH);
var entryList = getEntryList();
var mfsu = new MFSU({
  implementor: webpack,
  buildDepWithESBuild: true
});
var useMFSU = Number(process.env.useMFSU) !== 0;
var tsChecker = Number(process.env.tsChecker) !== 0;
var smp = new SpeedMeasurePlugin();
var globalScssPathList = [
  path.join(srcPath, "./styles/"),
  path.join(srcPath, "./platforms/mobile/styles/"),
  path.join(srcPath, "./platforms/pc/styles/")
];
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
        localIdentContext: srcPath,
        getLocalIdent,
        localIdentName: "[name]__[local]__[contenthash:base64:5]"
      }
    });
  }
  return [
    isDevMode ? "style-loader" : {
      loader: MiniCssExtractPlugin.loader,
      options: { publicPath: "../" }
    },
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
  // new AntdDayjsWebpackPlugin(),
  ...entryList.map(
    (i) => new HtmlWebpackPlugin({
      inject: true,
      chunks: [i.name],
      filename: `${i.name}.html`,
      title: i.title || "ESboot App",
      template: i.template || "template/index.html",
      hash: true
    })
  ),
  new InjectBodyPlugin({
    content: `
    <script src="${ESBOOT_RELATIVE_STATIC_CONFIG_PATH}?v=${process.env.BUILD_VERSION || pkg.version}"></script>
    ${!ESBOOT_IS_BROWSER && isDevMode ? `<script>
      window.brigeMockHost = "http://${ip}";
      window.brigeMockPort = ${process.env.BRIDGE_MOCK_PORT || 3e3};
      </script>` : ""}
    `
  }),
  new webpack.DefinePlugin({
    VERSION: JSON.stringify(pkg.version),
    ENV: JSON.stringify(process.env.NODE_ENV)
  }),
  new FriendlyErrorsWebpackPlugin(),
  new CopyPlugin({
    patterns: userConfig.copyFile
  }),
  isDevMode && new ReactRefreshPlugin(),
  isDevMode && tsChecker && new ForkTsCheckerWebpackPlugin({})
];
var getModulesRules = () => [
  {
    test: /\.(jpg|gif|png|ico|svg)$/,
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
    test: /_svg\.svg$/,
    type: "asset/source",
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024
      }
    },
    generator: {
      encoding: false,
      filename: "images/[name].[hash:8][ext]"
    }
  },
  {
    test: /\.(t|j)sx?$/,
    include: srcPath,
    exclude: /(node_modules|bower_components)/,
    use: [
      {
        loader: "babel-loader",
        options: {
          cacheDirectory: !isDevMode,
          plugins: [
            ...isDevMode && useMFSU ? mfsu.getBabelPlugins() : [],
            isDevMode && require.resolve("react-refresh/babel")
          ].filter(Boolean)
        }
      },
      {
        loader: "thread-loader",
        options: {
          workers: 4,
          workerParallelJobs: 50,
          workerNodeArgs: ["--max-old-space-size=1024"],
          poolTimeout: 2e3,
          poolParallelJobs: 50,
          name: "my-pool"
        }
      },
      {
        loader: "ts-loader",
        options: {
          happyPackMode: true,
          transpileOnly: true
        }
      }
    ]
  },
  {
    test: /\.css$/,
    use: ["style-loader", "css-loader"]
  },
  {
    test: /\.scss$/,
    exclude: globalScssPathList,
    use: parseScssModule({ modules: true })
  },
  {
    test: /\.scss$/,
    include: globalScssPathList,
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
    if (useMFSU) {
      middlewares.unshift(...mfsu.getMiddlewares());
    }
    return middlewares;
  },
  port: 8100,
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
      "@": srcPath,
      "@mobile": path.join(srcPath, "./src/platforms/mobile"),
      "@mobile-native": path.join(srcPath, "./src/platforms/mobile/_native"),
      "@mobile-browser": path.join(srcPath, "./src/platforms/mobile/_browser"),
      "@pc": path.join(srcPath, "./src/platforms/pc"),
      "@pc-native": path.join(srcPath, "./src/platforms/pc/_native"),
      "@pc-browser": path.join(srcPath, "./src/platforms/pc/_browser")
    }
  },
  output: {
    publicPath,
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
  devtool: "cheap-module-source-map"
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
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM'
  // },
};
var cfg = Object.assign(baseCfg, isDevMode && devCfg, !isDevMode && prodCfg);
if (!isDevMode) {
  cfg.plugins.push(
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:5].css",
      chunkFilename: "css/[id].[contenthash:5].css"
    })
  );
}
var getConfig = async () => {
  if (isDevMode) {
    if (useMFSU) {
      await mfsu.setWebpackConfig({
        config: cfg
      });
    }
    try {
      let port = userConfig.serverPort;
      if (!port) {
        port = await portfinder.getPortPromise();
      }
      cfg.devServer.port = port;
      console.log(
        entryList.map((item) => ({
          ...item,
          url: `http://${ip}:${port}${!ESBOOT_IS_BROWSER ? `/${item.name}.html` : ""}`
        }))
      );
    } catch (err) {
    }
  }
  return cfg;
};
module.exports = getConfig();
