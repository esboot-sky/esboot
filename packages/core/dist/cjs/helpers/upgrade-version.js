// src/helpers/upgrade-version.js
var fs = require("fs");
var path = require("path");
var outputPath = path.resolve("./package.json");
function editData() {
  const f = fs.readFileSync(outputPath, "utf8");
  const data = JSON.parse(f);
  const nextVersion = (Number(data.testVersion) || 0) + 1;
  return JSON.stringify(
    {
      ...data,
      testVersion: nextVersion
    },
    null,
    2
  );
}
fs.writeFileSync(path.resolve(__dirname, outputPath), editData(), { encoding: "utf8" });
