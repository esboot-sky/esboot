import { join } from 'path';
import { program } from 'commander';
import { lint } from '@dz-web/esboot-lint';

import cfg from '@/cfg';

import { processPrepare } from './prepare';
import { loadEnv } from './load-env';

import { prepare } from './prepare/index';
import { Environment } from '@dz-web/esboot-common';
import { logBrand } from '@/helpers';

const cwd = process.cwd();

const pkgPath = join(__dirname, '../../package.json');
const pkg = require(pkgPath);

function createBundler(environment: Environment) {
  process.env.NODE_ENV = environment;
  cfg.load();
  const { config } = cfg;

  if (config.bundler) {
    const bundler = new config.bundler({ configuration: cfg });
    logBrand(config);
    return bundler;
  }

  return null;
}

export const run = () => {
  processPrepare();
  loadEnv({ root: cwd });

  program
    .command('dev')
    .description('Start to develop project')
    .allowUnknownOption(true)
    .action(async () => {
      const bundler = createBundler(Environment.dev);
      if (bundler) bundler.dev();
    });

  program
    .command('build')
    .description('Build project')
    .allowUnknownOption(true)
    .action(async () => {
      const bundler = createBundler(Environment.prod);
      if (bundler) bundler.build();
    });

  cfg.load();

  program
    .command('prepare')
    .description('Prepare esboot project')
    .action(() => {
      prepare();
    });

  program
    .command('lint')
    .description('Lint project files using ESLint and Stylelint')
    .allowUnknownOption(true)
    .action(async () => {
      lint();
    });

  program.version(pkg.version);
  program.parse(process.argv);
};
