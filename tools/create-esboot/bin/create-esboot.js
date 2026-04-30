#!/usr/bin/env node

const process = require('node:process');

process.env.FS_LOGGER = 'none';
require('../dist/cli');
