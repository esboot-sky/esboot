var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/compiler/webpack/index.ts
var webpack_exports = {};
__export(webpack_exports, {
  execDev: () => execDev
});
module.exports = __toCommonJS(webpack_exports);
var import_path = require("path");
var import_cross_spawn = __toESM(require("cross-spawn"));
var import_path2 = require("../../helpers/path");
var import_config = __toESM(require("./config/config"));
var import_environment = require("./config/environment");
var import_dotenv = __toESM(require("dotenv"));
var webpackCfgOption = `--config ${(0, import_path.resolve)(__dirname, "./webpack.config.js")}`;
async function execDev() {
  import_dotenv.default.config();
  const opts = {
    env: import_environment.Environment.dev
  };
  const cfg = await (0, import_config.default)(opts);
  console.log(JSON.stringify(cfg, "", 2), "<-- config");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  execDev
});
