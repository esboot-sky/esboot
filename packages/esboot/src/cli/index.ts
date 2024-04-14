import { dev } from '@dz-web/esboot-bundler-webpack';

import { join } from 'path';
import { program } from 'commander';

const cwd = process.cwd();

const pkgPath = join(__dirname, '../../package.json');
const pkg = require(pkgPath);

export const run = () => {
  // registry({ root: cwd });

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
