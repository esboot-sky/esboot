import { join } from 'path';
import { program } from 'commander';

import cfg from '@/cfg';

import { processPrepare } from './prepare';
import { loadEnv } from './load-env';

import { prepare } from './services/prepare';
import { Environment } from '@dz-web/esboot-common';

const cwd = process.cwd();

const pkgPath = join(__dirname, '../../package.json');
const pkg = require(pkgPath);

export const run = () => {
  processPrepare();
  loadEnv({ root: cwd });
  cfg.load();

  program
    .command('dev')
    .description('Start to develop project')
    .allowUnknownOption(true)
    .action(async () => {
      // cfg.updateCompileTimeCfg({ env: Environment.dev });
      // cfg.initBundler();
      // cfg?.bundler?.dev();
    });

  program
    .command('build')
    .description('Build project')
    .allowUnknownOption(true)
    .action(async () => {
      // cfg.updateCompileTimeCfg({ env: Environment.prod });
      // cfg.initBundler();
      // cfg?.bundler?.build();
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
