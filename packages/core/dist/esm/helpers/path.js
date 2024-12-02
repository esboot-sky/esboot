var _require = require('path'),
  join = _require.join;
function joinExecPath(path) {
  return join(process.cwd(), path);
}
function searchCommand(command) {
  return joinExecPath("./node_modules/.bin/".concat(command));
}
;
module.exports = {
  joinExecPath: joinExecPath,
  searchCommand: searchCommand
};