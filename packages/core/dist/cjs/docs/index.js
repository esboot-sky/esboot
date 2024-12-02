// src/docs/index.js
var spawn = require("cross-spawn");
var { searchCommand, joinExecPath } = require("../helpers/path");
function execDocs(action) {
  spawn.sync(
    `${searchCommand("cross-env")} APP_ROOT=${joinExecPath, "./docs"} ${searchCommand("dumi")} ${action}`,
    { stdio: "inherit", shell: true }
  );
}
module.exports = { execDocs };
