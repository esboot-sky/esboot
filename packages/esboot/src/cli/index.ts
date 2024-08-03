import { join } from 'path';
import { program } from 'commander';

import cfg from '@/cfg';

import { processPrepare } from './prepare';
import { loadEnv } from './load-env';

import { prepare } from './services/prepare';
import { Environment } from '@dz-web/esboot-common';
import { logBrand } from '@/helpers';

const cwd = process.cwd();

const pkgPath = join(__dirname, '../../package.json');
const pkg = require(pkgPath);

export const run = () => {
  processPrepare();
  loadEnv({ root: cwd });

  program
    .command('dev')
    .description('Start to develop project')
    .allowUnknownOption(true)
    .action(async () => {
      process.env.NODE_ENV = Environment.dev;
      cfg.load();

      const { config } = cfg;

      if (config.bundler) {
        const bundler = new config.bundler({ configuration: cfg });

        logBrand(config);
        bundler.dev();
      }
    });

  program
    .command('build')
    .description('Build project')
    .allowUnknownOption(true)
    .action(async () => {
      // FIXME: extract logic with dev
      process.env.NODE_ENV = Environment.prod;
      cfg.load();

      const { config } = cfg;

      if (config.bundler) {
        const bundler = new config.bundler({ configuration: cfg });

        logBrand(config);
        bundler.build();
      }
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
