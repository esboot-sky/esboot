var path = require('path');
var fs = require('fs-extra');
var _require = require("../helpers/path"),
  joinExecPath = _require.joinExecPath;
var _require2 = require("../helpers/config"),
  ESBOOT_PLATFORM = _require2.ESBOOT_PLATFORM,
  ESBOOT_PAGE_TYPE = _require2.ESBOOT_PAGE_TYPE;
var srcPath = joinExecPath('./src');
var scriptPath = path.join(srcPath, './platforms', ESBOOT_PLATFORM, "_".concat(ESBOOT_PAGE_TYPE), './helpers/multi-platforms.ts');
var targetPath = path.join(srcPath, './helpers/multi-platforms.ts');
fs.copy(scriptPath, targetPath).then(function () {
  return console.log('CreateMultiPlatform success!');
}).catch(function (err) {
  return console.error("CreateMultiPlatform error: ".concat(err, "!"));
});