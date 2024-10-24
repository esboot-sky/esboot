import { join } from 'node:path';
import { program } from 'commander';
import { lint, execGitHooks } from '@dz-web/esboot-lint';

import cfg from '@/cfg';

import { processPrepare } from './prepare';
import { loadEnv } from './load-env';

import { prepare } from './prepare/index';
import { Environment } from '@dz-web/esboot-common';
import { logBrand } from '@/helpers';
import { preview } from './preview';
import { mockBridge } from './mock/bridge';

import { preparePlugins } from '@/plugin';
import {
  callPluginHookOfModifyConfig,
  callPluginHookOfRegisterCommands,
  pluginHooksDict,
} from '@/plugin';

const cwd = process.cwd();

const pkgPath = join(__dirname, '../../package.json');
const pkg = require(pkgPath);

function loadCfg() {
  cfg.load();
  preparePlugins(cfg.config);
  callPluginHookOfModifyConfig(cfg.config);
  callPluginHookOfRegisterCommands(cfg.config);
}

function createBundler(environment: Environment) {
  process.env.NODE_ENV = environment;
  loadCfg();
  const { config } = cfg;

  if (config.bundler) {
    const bundler = new config.bundler({
      configuration: cfg,
      pluginHooksDict,
    });
    logBrand(config);
    return bundler;
  }

  return null;
}

export const run = () => {
  processPrepare();
  loadEnv({ root: cwd });

  const cmd = process.argv[2];
  if (!['lint', 'exec_git_hooks', 'dev', 'build'].includes(cmd)) {
    loadCfg();
  }

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

  program
    .command('prepare')
    .description('Prepare esboot project')
    .action(() => {
      prepare();
    });

  program
    .command('preview')
    .description('Preview the distribution content')
    .allowUnknownOption(true)
    .action(async () => {
      preview(cfg.config);
    });

  program
    .command('mock:bridge')
    .description('Start bridge mock')
    .option('-f, --file <char>')
    .option('-s, --sampleFile <char>')
    .action(async (options) => {
      mockBridge(options, cfg.config);
    });

  program
    .command('lint')
    .description('Lint project files using ESLint and Stylelint')
    .allowUnknownOption(true)
    .action(async () => {
      lint({ cwd });
    });

  program
    .command('exec_git_hooks')
    .description('Execute git hooks')
    .option('-t, --type <type>', 'type of git hooks')
    .action(async (options) => {
      execGitHooks({ type: options.type, cwd });
    });

  program.version(pkg.version);
  program.parse(process.argv);
};
