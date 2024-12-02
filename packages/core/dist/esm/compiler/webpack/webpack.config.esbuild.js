function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var path = require('path');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var TerserPlugin = require('terser-webpack-plugin');
var CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var CopyPlugin = require('copy-webpack-plugin');
var SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var _require = require('webpack-bundle-analyzer'),
  BundleAnalyzerPlugin = _require.BundleAnalyzerPlugin;
var ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var pxtorem = require('@alitajs/postcss-plugin-px2rem');
var esbuild = require('esbuild');
var _require2 = require('@dr.pogodin/babel-plugin-react-css-modules/utils'),
  getLocalIdent = _require2.getLocalIdent;
var libPath = path.resolve(__dirname, '../../');
var helpersPath = path.join(libPath, './helpers/config');
var getEntryList = require(path.resolve(__dirname, './helpers/entry'));
var postcssNormalize = require('postcss-normalize');
var _require3 = require('@umijs/mfsu'),
  MFSU = _require3.MFSU,
  esbuildLoader = _require3.esbuildLoader;
var _require4 = require(path.join(helpersPath, './config')),
  ESBOOT_CONFIG_PATH = _require4.ESBOOT_CONFIG_PATH,
  ESBOOT_RELATIVE_STATIC_CONFIG_PATH = _require4.ESBOOT_RELATIVE_STATIC_CONFIG_PATH,
  ESBOOT_IS_MOBILE = _require4.ESBOOT_IS_MOBILE;
var pkg = require("./package.json");
var userConfig = require(ESBOOT_CONFIG_PATH);
var ip = require(path.join(helpersPath, './helpers/ip'));
var entryList = getEntryList();
var mfsu = new MFSU({
  implementor: webpack,
  buildDepWithESBuild: true
});
var smp = new SpeedMeasurePlugin();
var isDevMode = process.env.NODE_ENV === 'development';
if (isDevMode) {
  console.log(entryList.map(function (item) {
    return _objectSpread(_objectSpread({}, item), {}, {
      url: "http://".concat(ip, ":").concat(userConfig.serverPort, "/").concat(item.name, ".html")
    });
  }), '<-- entryList');
}
var parseScssModule = function parseScssModule() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var modules = options.modules;
  var cssLoaderOptions = {
    sourceMap: isDevMode
  };
  if (modules) {
    Object.assign(cssLoaderOptions, {
      importLoaders: 2,
      modules: {
        namedExport: true,
        localIdentContext: path.resolve(__dirname, 'src'),
        getLocalIdent: getLocalIdent,
        localIdentName: '[name]__[local]__[contenthash:base64:5]'
      }
    });
  }
  return [isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader, {
    loader: 'css-loader',
    options: cssLoaderOptions
  }, {
    loader: 'postcss-loader',
    options: {
      sourceMap: isDevMode,
      postcssOptions: {
        plugins: [ESBOOT_IS_MOBILE && pxtorem({
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
        }), require('postcss-flexbugs-fixes'), require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }), postcssNormalize()].filter(Boolean)
      }
    }
  }, {
    loader: 'sass-loader',
    options: {
      sourceMap: isDevMode
    }
  }];
};
var createEntry = function createEntry() {
  return entryList.reduce(function (prev, curr) {
    prev[curr.name] = curr.entry;
    return prev;
  }, {});
};
var getPlugins = function getPlugins() {
  return [].concat(_toConsumableArray(entryList.map(function (i) {
    return new HtmlWebpackPlugin({
      inject: 'auto',
      chunks: [i.name],
      filename: "".concat(i.name, ".html"),
      title: i.title || 'ESboot App',
      template: i.template || 'template/index.html',
      templateParameters: {
        configPath: "".concat(ESBOOT_RELATIVE_STATIC_CONFIG_PATH, "?v=").concat(pkg.version)
      },
      hash: true
    });
  })), [new webpack.DefinePlugin({
    VERSION: JSON.stringify(pkg.version),
    ENV: JSON.stringify(process.env.NODE_ENV)
  }), new FriendlyErrorsWebpackPlugin(), new CopyPlugin({
    patterns: userConfig.copyFile
  }), isDevMode && new ReactRefreshPlugin(), isDevMode && new ForkTsCheckerWebpackPlugin({})]);
};
var getModulesRules = function getModulesRules() {
  return [{
    test: /\.(jpg|gif|png|svg|ico)$/,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 8 * 1024
      }
    },
    generator: {
      filename: 'images/[name].[hash:8][ext]'
    }
  }, {
    test: /\.[jt]sx?$/,
    exclude: /node_modules/,
    use: {
      loader: esbuildLoader,
      options: {
        handler: _toConsumableArray(mfsu.getEsbuildLoaderHandler()),
        target: 'esnext',
        implementation: esbuild
      }
    }
  }, {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  }, {
    test: /\.scss$/,
    exclude: path.resolve(__dirname, 'src/global-css/'),
    use: parseScssModule({
      modules: true
    })
  }, {
    test: /\.scss$/,
    include: path.resolve(__dirname, 'src/global-css/'),
    use: parseScssModule()
  }];
};
var getDevServer = function getDevServer() {
  return {
    compress: true,
    hot: true,
    historyApiFallback: {
      disableDotRule: true
    },
    setupMiddlewares: function setupMiddlewares(middlewares) {
      middlewares.unshift.apply(middlewares, _toConsumableArray(mfsu.getMiddlewares()));
      return middlewares;
    },
    port: userConfig.serverPort,
    host: '0.0.0.0'
  };
};
var baseCfg = {
  mode: isDevMode ? 'development' : 'production',
  performance: {
    hints: false
  },
  entry: createEntry(),
  resolve: {
    extensions: ['.ts', '.tsx', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, contentRelativePath, './src'),
      '@mobile': path.resolve(__dirname, contentRelativePath, './src/platforms/mobile'),
      '@mobile-native': path.resolve(__dirname, contentRelativePath, './src/platforms/mobile/native'),
      '@mobile-browser': path.resolve(__dirname, contentRelativePath, './src/platforms/mobile/browser'),
      '@pc': path.resolve(__dirname, contentRelativePath, './src/platforms/pc'),
      '@pc-native': path.resolve(__dirname, contentRelativePath, './src/platforms/pc/native'),
      '@pc-browser': path.resolve(__dirname, contentRelativePath, './src/platforms/pc/browser')
    }
  },
  output: {
    publicPath: '/',
    clean: !isDevMode,
    filename: isDevMode ? 'js/[name].js' : 'js/[name].[chunkhash:5].js'
  },
  plugins: getPlugins().filter(Boolean),
  module: {
    rules: getModulesRules()
  }
};
var devCfg = {
  devServer: getDevServer(),
  devtool: 'cheap-source-map'
};
var prodCfg = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/
        }
      }
    },
    emitOnErrors: true,
    usedExports: true,
    minimize: true,
    minimizer: [new TerserPlugin({
      parallel: true,
      terserOptions: {
        format: {
          comments: false
        }
      }
    }), new CssMinimizerPlugin()]
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

// const cfg = Object.assign(baseCfg, isDevMode && devCfg, !isDevMode && smp.wrap(prodCfg));
var cfg = Object.assign(baseCfg, isDevMode && devCfg, !isDevMode && prodCfg);

// See https://github.com/stephencookdev/speed-measure-webpack-plugin/issues/167
if (!isDevMode) {
  cfg.plugins.push(new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash:5].css',
    chunkFilename: 'css/[id].[contenthash:5].css'
  }));
}
var getConfig = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return mfsu.setWebpackConfig({
            config: cfg
          });
        case 2:
          return _context.abrupt("return", cfg);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getConfig() {
    return _ref.apply(this, arguments);
  };
}();
module.exports = isDevMode ? getConfig() : cfg;