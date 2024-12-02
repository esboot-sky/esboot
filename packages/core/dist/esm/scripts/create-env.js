#!/usr/bin/env node
var fs = require('fs-extra');
var path = require('node:path');
var file = './.env';
fs.pathExists(file, function (err, exists) {
  if (!exists) {
    fs.copy(path.resolve(__dirname, '../sample/.env'), file, function (err) {
      if (err) return console.error(err);
      console.log('success!');
    });
  }
});