import { join } from 'path';
import { program } from 'commander';

import { Environment } from '@@webpack/config/environment';
import getWebpackConfig from '@@webpack/config/config';

import esbootConfig from '@@/config';
import { invokeEachPlugin } from '@@/helpers/plugins';

import { registry } from './registry';
import { runDev } from './dev';
import { runBuild } from './build';
import { runPreview } from './preview';
import { runLint } from './lint';
import { runExec } from './exec';
import { runCommitLint } from './lint/commit';
import { runDocs } from './docs';
import { runMockBridge } from './mock/bridge';
import { generateAliasFiles } from './generate/alias';
import { runPostInstall } from './postinstall/postinstall';

import { writeMultiPlatform } from '../scripts/write-multi-platform';

const cwd = process.cwd();

const pkgPath = join(__dirname, '../../package.json');
const pkg = require(pkgPath);

export const run = () => {
  registry({ root: cwd });

  invokeEachPlugin((plugin) => plugin?.registerCommands?.(program));

  program
    .command('cc')
    .description('cc test')
    .allowUnknownOption(true)
    .action(async () => {
      process.env.NODE_ENV = Environment.dev;
      process.env.BABEL_ENV = Environment.dev;

      esbootConfig.init();
      writeMultiPlatform();
      const cfg = await getWebpackConfig({ env: Environment.dev });
    });

  program
    .command('dev')
    .description('Start development project')
    .allowUnknownOption(true)
    .action(async () => {
      process.env.NODE_ENV = Environment.dev;
      process.env.BABEL_ENV = Environment.dev;

      // TODO: Twice
      esbootConfig.init();
      writeMultiPlatform();
      runDev();
    });

  program
    .command('build')
    .description('build project')
    .allowUnknownOption(true)
    .action(async () => {
      process.env.NODE_ENV = Environment.prod;
      process.env.BABEL_ENV = Environment.prod;

      esbootConfig.init();
      writeMultiPlatform();
      runBuild();
    });

  program
    .command('preview')
    .description('Preview Projects')
    .option('-p, --port <char>')
    .option('-d, --directory <char>')
    .action(async (options) => {
      runPreview(options.port || 8900, options.directory);
    });

  program
    .command('lint')
    .description('Lint files')
    .allowUnknownOption(true)
    .action(async () => {
      runLint(process.argv.slice(3));
    });

  // program
  //   .command('commitlint')
  //   .description('Lint commit message')
  //   .allowUnknownOption(true)
  //   .action(async () => {
  //     runCommitLint(process.argv.slice(3));
  //   });

  program
    .command('docs')
    .description('docs')
    .allowUnknownOption(true)
    .action(async () => {
      runDocs(process.argv.slice(3));
    });

  program
    .command('exec')
    .description('exec commands')
    .allowUnknownOption(true)
    .action(async () => {
      runExec(process.argv.slice(3));
    });

  program
    .command('g-alias')
    .description('Generate alias')
    .allowUnknownOption(true)
    .action(async () => {
      generateAliasFiles();
    });

  program
    .command('mock:bridge')
    .description('Start bridge mock')
    .option('-f, --file <char>')
    .option('-s, --sampleFile <char>')
    .action(async (options) => {
      runMockBridge(options);
    });

  program
    .command('postinstall')
    .description('Post install actions')
    .action(async (options) => {
      runPostInstall(options);
    });

  program.version(pkg.version);
  program.parse(process.argv);
};
