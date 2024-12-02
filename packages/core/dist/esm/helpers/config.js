function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
require('dotenv').config();
var path = require('path');
var isDevMode = process.env.NODE_ENV === 'development';
var publicPath = isDevMode ? '/' : './';
var PLATFORMS = {
  MOBILE: 'mobile',
  PC: 'pc'
};
var PAGE_TYPE = {
  native: 'native',
  browser: 'browser'
};
var TPL_DICT = _defineProperty(_defineProperty({}, PLATFORMS.MOBILE, 'template/mobile.html'), PLATFORMS.PC, 'template/pc.html');
var _process$env = process.env,
  NODE_ENV = _process$env.NODE_ENV,
  ESBOOT_CONTENT_PATH = _process$env.ESBOOT_CONTENT_PATH,
  _process$env$ESBOOT_P = _process$env.ESBOOT_PLATFORM,
  ESBOOT_PLATFORM = _process$env$ESBOOT_P === void 0 ? PLATFORMS.PC : _process$env$ESBOOT_P,
  _process$env$ESBOOT_P2 = _process$env.ESBOOT_PAGE_TYPE,
  ESBOOT_PAGE_TYPE = _process$env$ESBOOT_P2 === void 0 ? PAGE_TYPE.browser : _process$env$ESBOOT_P2,
  _process$env$ESBOOT_C = _process$env.ESBOOT_CONTENT_PATTERN,
  ESBOOT_CONTENT_PATTERN = _process$env$ESBOOT_C === void 0 ? '*' : _process$env$ESBOOT_C;
if (NODE_ENV === 'production') {
  process.env.BROWSERSLIST_ENV = "".concat(ESBOOT_PLATFORM, "-").concat(ESBOOT_PAGE_TYPE, "-production");
}
module.exports = {
  ESBOOT_CONTENT_PATTERN: ESBOOT_CONTENT_PATTERN,
  ESBOOT_PLATFORM: ESBOOT_PLATFORM,
  ESBOOT_PAGE_TYPE: ESBOOT_PAGE_TYPE,
  ESBOOT_TEMPLATE: TPL_DICT[ESBOOT_PLATFORM],
  ESBOOT_CONTENT_PATH: ESBOOT_CONTENT_PATH,
  ESBOOT_IS_MOBILE: ESBOOT_PLATFORM === PLATFORMS.MOBILE,
  ESBOOT_IS_BROWSER: ESBOOT_PAGE_TYPE === PAGE_TYPE.browser,
  ESBOOT_RELATIVE_STATIC_CONFIG_PATH: "".concat(publicPath, "static-").concat(ESBOOT_PLATFORM, "-").concat(ESBOOT_PAGE_TYPE, ".config.js"),
  ESBOOT_CONFIG_PATH: path.resolve(process.cwd(), "./dev/config/esboot/esboot-".concat(ESBOOT_PLATFORM, "-").concat(ESBOOT_PAGE_TYPE, ".config.js")),
  ESBOOT_STATIC_CONFIG_PATH: path.resolve(process.cwd(), "./dev/config/static-config/static-".concat(ESBOOT_PLATFORM, "-").concat(ESBOOT_PAGE_TYPE, ".config.js")),
  isDevMode: isDevMode,
  publicPath: publicPath
};