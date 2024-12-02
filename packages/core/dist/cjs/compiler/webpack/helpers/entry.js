// src/compiler/webpack/helpers/entry.js
var { getExportProps } = require("@umijs/ast");
var { readFileSync } = require("fs");
var { resolve, basename, join } = require("path");
var glob = require("glob");
var {
  ESBOOT_PLATFORM,
  ESBOOT_PAGE_TYPE,
  ESBOOT_TEMPLATE,
  ESBOOT_CONFIG_PATH,
  ESBOOT_CONTENT_PATH = "./",
  ESBOOT_CONTENT_PATTERN
} = require(resolve(__dirname, "../../../helpers/config"));
var userConfig = require(ESBOOT_CONFIG_PATH);
var rootPath = resolve(process.cwd(), "./src");
var contentRootPath = `./platforms/${ESBOOT_PLATFORM}/_${ESBOOT_PAGE_TYPE}`;
function getEntryList() {
  const { html } = userConfig;
  if (html)
    return html;
  const content_path = join(contentRootPath, ESBOOT_CONTENT_PATH);
  const list = [];
  const files = glob.sync(`/**/${ESBOOT_CONTENT_PATTERN}.entry.tsx`, {
    root: join(rootPath, content_path)
  });
  files.forEach((file, index) => {
    const { title, template, name } = getExportProps(readFileSync(file, "utf-8")) || {};
    const filename = basename(file, ".entry.tsx");
    const entryInfo = {
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
