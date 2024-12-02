// src/helpers/zip.js
var path = require("path");
var del = require("del");
var AdmZip = require("adm-zip");
var pkg = require("./package.json");
var z = new AdmZip();
var entryPath = path.resolve(__dirname, "./dist/");
var outputFolder = path.resolve(__dirname, "./release/");
var outputPath = path.join(outputFolder, `./v${pkg.version}.${pkg.testVersion}.zip`);
del.sync([outputFolder]);
z.addLocalFolder(entryPath);
z.writeZip(outputPath);
