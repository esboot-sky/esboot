import type { Bundler } from '@/bundler';
import process from 'node:process';
import { Environment } from '@dz-web/esboot-common';

import { loadEnv } from '@dz-web/esboot-common/cfg';
import { program } from 'commander';

import { cfg } from '@/cfg';
import { logBrand } from '@/helpers';
import { callPluginHookOfModifyConfig, callPluginHookOfRegisterCommands, pluginHooksDict, preparePlugins } from '@/plugin';
import { writeMultiPlatform } from '@/scripts/write-multi-platform';

import pkg from '../../package.json' with { type: 'json' };

import { mockBridge } from './mock/bridge';
import { processPrepare } from './prepare';

import { prepare } from './prepare/index';
import { preview } from './preview';

const cwd = process.cwd();

async function loadCfg(): Promise<void> {
  await cfg.load();
  preparePlugins(cfg.config);
  callPluginHookOfModifyConfig(cfg.config);
  callPluginHookOfRegisterCommands(cfg.config);
}

async function createBundler(environment: Environment): Promise<Bundler | null> {
  process.env.NODE_ENV = environment;
  await loadCfg();
  const { config } = cfg;

  if (config.bundler) {
    const Bundler = config.bundler;
    const bundler = new Bundler({
      configuration: cfg,
      pluginHooksDict,
    });
    logBrand(config);
    writeMultiPlatform(cfg.config);
    return bundler;
  }

  return null;
}

export async function run(): Promise<void> {
  processPrepare();
  loadEnv({ root: cwd });

  const cmd = process.argv[2];
  if (!['lint', 'exec_git_hooks', 'dev', 'build'].includes(cmd)) {
    await loadCfg();
  }

  program
    .command('dev')
    .description('Start to develop project')
    .allowUnknownOption(true)
    .action(async () => {
      const bundler = await createBundler(Environment.dev);
      if (bundler)
        bundler.dev();
    });

  program
    .command('build')
    .description('Build project')
    .allowUnknownOption(true)
    .action(async () => {
      const bundler = await createBundler(Environment.prod);
      if (bundler)
        bundler.build();
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
    .argument('[args...]')
    .description('Lint project files using ESLint and Stylelint')
    .allowUnknownOption(true)
    .action(async (args) => {
      const { lint } = await import('@dz-web/esboot-lint');
      lint({ cwd, args: args || [] });
    });

  program
    .command('exec_git_hooks')
    .description('Execute git hooks')
    .option('-t, --type <type>', 'type of git hooks')
    .action(async (options) => {
      const { execGitHooks } = await import('@dz-web/esboot-lint');
      execGitHooks({ type: options.type, cwd });
    });

  program.version(pkg.version);
  program.parse(process.argv);
}
