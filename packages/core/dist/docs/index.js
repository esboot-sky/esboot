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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// src/docs/index.ts
var import_cross_spawn = __toESM(require("cross-spawn"));
var import_path = require("../helpers/path");
function execDocs(action) {
  import_cross_spawn.default.sync(`${(0, import_path.searchCommand)("cross-env")} APP_ROOT=${import_path.joinExecPath, "./docs"} ${(0, import_path.searchCommand)("dumi")} ${action}`, { stdio: "inherit", shell: true });
}
module.exports = { execDocs };
