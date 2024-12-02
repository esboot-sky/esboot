// src/scripts/create-multi-platform.js
var path = require("path");
var fs = require("fs-extra");
var { joinExecPath } = require("../helpers/path");
var { ESBOOT_PLATFORM, ESBOOT_PAGE_TYPE } = require("../helpers/config");
var srcPath = joinExecPath("./src");
var scriptPath = path.join(srcPath, "./platforms", ESBOOT_PLATFORM, `_${ESBOOT_PAGE_TYPE}`, "./helpers/multi-platforms.ts");
var targetPath = path.join(srcPath, "./helpers/multi-platforms.ts");
fs.copy(scriptPath, targetPath).then(() => console.log("CreateMultiPlatform success!")).catch((err) => console.error(`CreateMultiPlatform error: ${err}!`));
