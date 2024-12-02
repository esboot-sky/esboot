var _require = require('@umijs/ast'),
  getExportProps = _require.getExportProps;
var _require2 = require('fs'),
  readFileSync = _require2.readFileSync;
var _require3 = require('path'),
  resolve = _require3.resolve,
  basename = _require3.basename,
  join = _require3.join;
var glob = require('glob');
var _require4 = require(resolve(__dirname, '../../../helpers/config')),
  ESBOOT_PLATFORM = _require4.ESBOOT_PLATFORM,
  ESBOOT_PAGE_TYPE = _require4.ESBOOT_PAGE_TYPE,
  ESBOOT_TEMPLATE = _require4.ESBOOT_TEMPLATE,
  ESBOOT_CONFIG_PATH = _require4.ESBOOT_CONFIG_PATH,
  _require4$ESBOOT_CONT = _require4.ESBOOT_CONTENT_PATH,
  ESBOOT_CONTENT_PATH = _require4$ESBOOT_CONT === void 0 ? './' : _require4$ESBOOT_CONT,
  ESBOOT_CONTENT_PATTERN = _require4.ESBOOT_CONTENT_PATTERN;
var userConfig = require(ESBOOT_CONFIG_PATH);
var rootPath = resolve(process.cwd(), './src');
var contentRootPath = "./platforms/".concat(ESBOOT_PLATFORM, "/_").concat(ESBOOT_PAGE_TYPE);
function getEntryList() {
  var html = userConfig.html;
  if (html) return html;
  var content_path = join(contentRootPath, ESBOOT_CONTENT_PATH);
  var list = [];
  var files = glob.sync("/**/".concat(ESBOOT_CONTENT_PATTERN, ".entry.tsx"), {
    root: join(rootPath, content_path)
  });
  files.forEach(function (file, index) {
    var _ref = getExportProps(readFileSync(file, 'utf-8')) || {},
      title = _ref.title,
      template = _ref.template,
      name = _ref.name;
    var filename = basename(file, '.entry.tsx');
    var entryInfo = {
      name: name || filename,
      title: title || filename,
      entry: file
    };
    entryInfo.template = template || ESBOOT_TEMPLATE;
    list.push(entryInfo);
  });
  return list;
}
module.exports = getEntryList;