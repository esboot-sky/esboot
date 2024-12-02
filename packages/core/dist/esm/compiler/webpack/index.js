var _require = require('path'),
  resolve = _require.resolve;
var spawn = require('cross-spawn');
var _require2 = require("../../helpers/path"),
  searchCommand = _require2.searchCommand;
var webpackCfgOption = "--config ".concat(resolve(__dirname, './webpack.config.js'));
function execDev() {
  spawn.sync("".concat(searchCommand('cross-env'), " NODE_ENV=development ").concat(searchCommand('webpack-dev-server'), " ").concat(webpackCfgOption), {
    stdio: 'inherit',
    shell: true
  });
}
function execBuild() {
  spawn.sync("".concat(searchCommand('cross-env'), " NODE_ENV=production ").concat(searchCommand('webpack'), " ").concat(webpackCfgOption), {
    stdio: 'inherit',
    shell: true
  });
}
function execAnalyzer() {
  spawn.sync("".concat(searchCommand('cross-env'), " NODE_ENV=production ").concat(searchCommand('webpack'), " ").concat(webpackCfgOption, " --profile --json=stats.json && ").concat(searchCommand('webpack-bundle-analyzer'), " ./stats.json"), {
    stdio: 'inherit',
    shell: true
  });
}
function execPreview(port) {
  spawn.sync(searchCommand('http-server'), ['dist', '-p', port, '-c', '1'], {
    stdio: 'inherit',
    shell: true
  });
}
module.exports = {
  execDev: execDev,
  execBuild: execBuild,
  execPreview: execPreview,
  execAnalyzer: execAnalyzer
};