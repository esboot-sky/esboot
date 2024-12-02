// src/helpers/ip.js
var interfaces = require("os").networkInterfaces();
var ipAddress = "";
for (devName in interfaces) {
  iface = interfaces[devName];
  for (i = 0; i < iface.length; i++) {
    alias = iface[i];
    if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
      ipAddress = alias.address;
    }
  }
}
var iface;
var alias;
var i;
var devName;
module.exports = ipAddress;
