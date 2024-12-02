#!/usr/bin/env node

// src/scripts/create-env.js
var fs = require("fs-extra");
var path = require("node:path");
var file = "./.env";
fs.pathExists(file, (err, exists) => {
  if (!exists) {
    fs.copy(path.resolve(__dirname, "../sample/.env"), file, (err2) => {
      if (err2)
        return console.error(err2);
      console.log("success!");
    });
  }
});
