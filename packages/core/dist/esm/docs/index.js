var spawn = require('cross-spawn');
var _require = require("../helpers/path"),
  searchCommand = _require.searchCommand,
  joinExecPath = _require.joinExecPath;
function execDocs(action) {
  spawn.sync("".concat(searchCommand('cross-env'), " APP_ROOT=").concat((joinExecPath, './docs'), " ").concat(searchCommand('dumi'), " ").concat(action), {
    stdio: 'inherit',
    shell: true
  });
}
module.exports = {
  execDocs: execDocs
};