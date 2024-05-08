import { join } from 'path';
import { program } from 'commander';

import { dev } from '@dz-web/esboot-bundler-webpack';
import { processPrepare } from './prepare';
import { loadEnv } from './load-env';
import cfg from '@/cfg';

const cwd = process.cwd();

const pkgPath = join(__dirname, '../../package.json');
const pkg = require(pkgPath);

export const run = () => {
  processPrepare();
  loadEnv({ root: cwd });
  cfg.load();

  program
    .command('dev')
    .description('Start development project')
    .allowUnknownOption(true)
    .action(async () => {
      dev();
    });

  program
    .command('postinstall')
    .description('Postinstall action')
    .allowUnknownOption(true)
    .action(async () => {
      console.log(1, '<-- postinstall');
    });

  program.version(pkg.version);
  program.parse(process.argv);
};
