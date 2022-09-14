const { resolve } = require('path');
const spawn = require('cross-spawn');
const { searchCommand } = require('../../helpers/path');

const webpackCfgOption = `--config ${resolve(
  __dirname,
  './webpack.config.js'
)}`;

function execDev() {
  spawn.sync(
    `${searchCommand('cross-env')} NODE_ENV=development ${searchCommand(
      'webpack-dev-server'
    )} ${webpackCfgOption}`,
    { stdio: 'inherit', shell: true }
  );
}

function execBuild() {
  spawn.sync(
    `${searchCommand('cross-env')} NODE_ENV=production ${searchCommand(
      'webpack'
    )} ${webpackCfgOption}`,
    { stdio: 'inherit', shell: true }
  );
}

function execAnalyzer() {
  spawn.sync(
    `${searchCommand('cross-env')} NODE_ENV=production ${searchCommand(
      'webpack'
    )} ${webpackCfgOption} --profile --json=stats.json && ${searchCommand(
      'webpack-bundle-analyzer'
    )} ./stats.json`,
    { stdio: 'inherit', shell: true }
  );
}

function execPreview(port) {
  spawn.sync(searchCommand('http-server'), ['dist', '-p', port, '-c', '1'], {
    stdio: 'inherit',
    shell: true,
  });
}

module.exports = { execDev, execBuild, execPreview, execAnalyzer };
