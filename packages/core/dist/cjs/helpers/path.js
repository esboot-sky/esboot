// src/helpers/path.js
var { join } = require("path");
function joinExecPath(path) {
  return join(process.cwd(), path);
}
function searchCommand(command) {
  return joinExecPath(`./node_modules/.bin/${command}`);
}
module.exports = { joinExecPath, searchCommand };
