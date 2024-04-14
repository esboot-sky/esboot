import { join } from 'path';
import { program } from 'commander';

import { dev } from '@dz-web/esboot-bundler-webpack';
import { processPrepare } from './prepare';

// const cwd = process.cwd();

const pkgPath = join(__dirname, '../../package.json');
const pkg = require(pkgPath);

export const run = () => {
  processPrepare();
  // registry({ root: cwd });
  console.log(23, '<-- 23');

  program
    .command('dev')
    .description('Start development project')
    .allowUnknownOption(true)
    .action(async () => {
      dev();
    });

  program.version(pkg.version);
  program.parse(process.argv);
};
