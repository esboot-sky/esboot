import { join } from 'path';
import { program } from 'commander';

import cfg from '@/cfg';

import { processPrepare } from './prepare';
import { loadEnv } from './load-env';

import { prepare } from './services/prepare';

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
      cfg.userCfg.bundler?.dev();
    });

  program
    .command('prepare')
    .description('Prepare esboot project')
    .action(() => {
      prepare();
    });

  program.version(pkg.version);
  program.parse(process.argv);
};
