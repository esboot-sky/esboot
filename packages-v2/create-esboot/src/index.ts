import {
  BaseGenerator,
  chalk,
  clackPrompts,
  execa,
  fsExtra,
  getGitInfo,
  installWithNpmClient,
  logger,
  pkgUp,
  tryPaths,
  yParser,
  lodash,
} from '@umijs/utils';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { ERegistry, unpackTemplate, type UmiTemplate } from './template';

interface ITemplateArgs {
  template?: UmiTemplate;
}

interface IArgs extends yParser.Arguments, ITemplateArgs {
  default?: boolean;
  git?: boolean;
  install?: boolean;
}

interface IContext {
  projectRoot: string;
  inMonorepo: boolean;
  target: string;
}

interface ITemplatePluginParams {
  pluginName?: string;
}

interface ITemplateParams extends ITemplatePluginParams {
  version: string;
  npmClient: ENpmClient;
  registry: string;
  author: string;
  email: string;
  withHusky: boolean;
  extraNpmrc: string;
}

enum ENpmClient {
  npm = 'npm',
  cnpm = 'cnpm',
  tnpm = 'tnpm',
  yarn = 'yarn',
  pnpm = 'pnpm',
}

enum ETemplate {
  'mp' = 'mp',
  'sp' = 'sp',
  // app = 'app',
  // max = 'max',
  // vueApp = 'vue-app',
  // plugin = 'plugin',
}

export interface IDefaultData extends ITemplateParams {
  appTemplate?: ETemplate;
}

const getRepoName = (url: string) => {
  const projectNameMatch = url.match(/\/([^\/]+)\.git$/);

  if (projectNameMatch && projectNameMatch.length > 1) {
    const projectName = projectNameMatch[1];
    return projectName;
  } else {
    return 'esboot-react-mp';
  }
};

const pkg = require('../package');
const DEFAULT_DATA = {
  pluginName: 'umi-plugin-demo',
  email: 'i@domain.com',
  author: 'esboot',
  version: pkg.version,
  npmClient: ENpmClient.pnpm,
  registry: ERegistry.npm,
  withHusky: false,
  extraNpmrc: '',
  appTemplate: ETemplate.mp,
} satisfies IDefaultData;

interface IGeneratorOpts {
  cwd: string;
  args: IArgs;
  defaultData?: IDefaultData;
}

export default async ({
  cwd,
  args,
  defaultData = DEFAULT_DATA,
}: IGeneratorOpts) => {
  let [name] = args._;
  let npmClient = ENpmClient.pnpm;
  let registry = ERegistry.npm;
  let appTemplate = defaultData?.appTemplate || ETemplate.mp;
  const { username, email } = await getGitInfo();
  const author = email && username ? `${username} <${email}>` : '';

  // plugin params
  let pluginName = `umi-plugin-${name || 'demo'}`;

  const target = name ? join(cwd, name) : cwd;

  const { isCancel, text, select, intro, outro } = clackPrompts;
  const exitPrompt = () => {
    outro(chalk.red('Exit create-esboot'));
    process.exit(1);
  };
  const selectAppTemplate = async () => {
    appTemplate = (await select({
      message: 'Pick ESBoot App Template',
      options: [
        { label: 'React Multiple Platforms App', value: ETemplate.mp },
        { label: 'React Single Platform App', value: ETemplate.sp },
      ],
      initialValue: ETemplate.mp,
    })) as ETemplate;
  };
  const selectNpmClient = async () => {
    npmClient = (await select({
      message: 'Pick Npm Client',
      options: [
        { label: ENpmClient.npm, value: ENpmClient.npm },
        { label: ENpmClient.cnpm, value: ENpmClient.cnpm },
        { label: ENpmClient.tnpm, value: ENpmClient.tnpm },
        { label: ENpmClient.yarn, value: ENpmClient.yarn },
        { label: ENpmClient.pnpm, value: ENpmClient.pnpm, hint: 'recommended' },
      ],
      initialValue: ENpmClient.pnpm,
    })) as ENpmClient;
  };
  const selectRegistry = async () => {
    registry = (await select({
      message: 'Pick Npm Registry',
      options: [
        {
          label: 'npm',
          value: ERegistry.npm,
        },
        {
          label: 'taobao',
          value: ERegistry.taobao,
          hint: 'recommended for China',
        },
        {
          label: 'DZ-internal',
          value: ERegistry.dz,
          hint: 'recommended for internal',
        },
      ],
      initialValue: ERegistry.dz,
    })) as ERegistry;
  };
  const internalTemplatePrompts = async () => {
    intro(chalk.bgHex('#19BDD2')(' create-esboot '));

    await selectAppTemplate();
    if (isCancel(appTemplate)) {
      exitPrompt();
    }

    await selectNpmClient();
    if (isCancel(npmClient)) {
      exitPrompt();
    }

    await selectRegistry();
    if (isCancel(registry)) {
      exitPrompt();
    }

    // plugin extra questions
    outro(chalk.green(`You're all set!`));
  };

  // --default
  const useDefaultData = !!args.default;
  // --template
  const useExternalTemplate = !!args.template;
  // --upstream
  const useUpstreamTemplate = !!args.upstream;

  switch (true) {
    case useUpstreamTemplate:
      const { url } = args;
      const { isString } = lodash;

      if (!isString(url)) {
        logger.error(`Missing URL field`);
        exitPrompt();
      }

      const upstream = isString(args.upstream)
        ? args.upstream
        : 'http://git.web.dz/WebTeam/common-library/esboot/esboot-react-mp.git';
      const branch = isString(args.branch) ? args.branch : 'main';
      const name = isString(args.name) ? args.name : getRepoName(url);

      try {
        logger.info('Clone project');
        await execa.execa('git', [
          'clone',
          '-b',
          branch,
          '--single-branch',
          upstream,
          name,
        ]);
        process.chdir(name);
        logger.info('Set branch');
        await execa.execa('git', ['checkout', '-b', 'upstream']);
        await execa.execa('git', ['checkout', '-b', 'dev']);
        logger.info('Set remote');
        await execa.execa('git', ['remote', 'set-url', 'origin', url]);
        await execa.execa('git', ['remote', 'add', 'upstream', upstream]);
        logger.info('Track upstream');
        await execa.execa('git', ['fetch', 'upstream', 'main']);
        await execa.execa('git', ['branch', '-u', 'upstream/main', 'upstream']);
        logger.info('Initial commit');
        await execa.execa('git', ['push', '-u', 'origin', '--all']);
        logger.info('Done!');
      } catch (error) {
        logger.error('Error:', error);
      }
      return;
    case useExternalTemplate:
      await selectNpmClient();
      if (isCancel(npmClient)) {
        exitPrompt();
      }
      await selectRegistry();
      if (isCancel(registry)) {
        exitPrompt();
      }
      await unpackTemplate({
        template: args.template!,
        dest: target,
        registry,
      });
      break;
    // TODO: init template from git
    // case: useGitTemplate
    default:
      if (!useDefaultData) {
        await internalTemplatePrompts();
      }
  }

  const version = pkg.version;

  // detect monorepo
  const monorepoRoot = await detectMonorepoRoot({ target });
  const inMonorepo = !!monorepoRoot;
  const projectRoot = inMonorepo ? monorepoRoot : target;

  // git
  const shouldInitGit = args.git !== false;
  // now husky is not supported in monorepo
  const withHusky = shouldInitGit && !inMonorepo;

  // pnpm
  let pnpmExtraNpmrc: string = '';
  const isPnpm = npmClient === ENpmClient.pnpm;
  let pnpmMajorVersion: number | undefined;
  if (isPnpm) {
    pnpmMajorVersion = await getPnpmMajorVersion();
    if (pnpmMajorVersion === 7) {
      // suppress pnpm v7 warning ( 7.0.0 < pnpm < 7.13.5 )
      // https://pnpm.io/npmrc#strict-peer-dependencies
      pnpmExtraNpmrc = `strict-peer-dependencies=false`;
    }
  }

  const injectInternalTemplateFiles = async () => {
    const generator = new BaseGenerator({
      path: join(__dirname, '..', 'templates', appTemplate),
      target,
      slient: false,
      data: useDefaultData
        ? defaultData
        : ({
            version: version.includes('-canary.') ? version : `^${version}`,
            npmClient,
            registry,
            author,
            email,
            withHusky,
            extraNpmrc: isPnpm ? pnpmExtraNpmrc : '',
            pluginName,
          } satisfies ITemplateParams),
    });
    await generator.run();
  };
  if (!useExternalTemplate) {
    await injectInternalTemplateFiles();
  }

  const context: IContext = {
    inMonorepo,
    target,
    projectRoot,
  };

  if (!withHusky) {
    await removeHusky(context);
  }

  if (inMonorepo) {
    // monorepo should move .npmrc to root
    await moveNpmrc(context);
  }

  // init git
  if (shouldInitGit) {
    await initGit(context);
  } else {
    logger.info(`Skip Git init`);
  }

  // install deps
  const isPnpm8 = pnpmMajorVersion === 8;
  if (!useDefaultData && args.install !== false) {
    if (isPnpm8) {
      await installWithPnpm8(target);
    } else {
      installWithNpmClient({ npmClient, cwd: target });
    }
  } else {
    logger.info(`Skip install deps`);
    if (isPnpm8) {
      logger.warn(
        chalk.yellow(
          `You current using pnpm v8, it will install minimal version of dependencies`
        )
      );
      logger.warn(
        chalk.green(
          `Recommended that you run ${chalk.bold.cyan(
            'pnpm up -L'
          )} to install latest version of dependencies`
        )
      );
    }
  }
};

async function detectMonorepoRoot(opts: {
  target: string;
}): Promise<string | null> {
  const { target } = opts;
  const rootPkg = await pkgUp.pkgUp({ cwd: dirname(target) });
  if (!rootPkg) {
    return null;
  }
  const rootDir = dirname(rootPkg);
  if (
    tryPaths([
      join(rootDir, 'lerna.json'),
      join(rootDir, 'pnpm-workspace.yaml'),
    ])
  ) {
    return rootDir;
  }
  return null;
}

async function moveNpmrc(opts: IContext) {
  const { target, projectRoot } = opts;
  const sourceNpmrc = join(target, './.npmrc');
  const targetNpmrc = join(projectRoot, './.npmrc');
  if (!existsSync(targetNpmrc)) {
    await fsExtra.copyFile(sourceNpmrc, targetNpmrc);
  }
  await fsExtra.remove(sourceNpmrc);
}

async function initGit(opts: IContext) {
  const { projectRoot } = opts;
  const isGit = existsSync(join(projectRoot, '.git'));
  if (isGit) return;
  try {
    await execa.execa('git', ['init'], { cwd: projectRoot });
  } catch {
    logger.error(`Initial the git repo failed`);
  }
}

async function removeHusky(opts: IContext) {
  const dir = join(opts.target, './.husky');
  if (existsSync(dir)) {
    await fsExtra.remove(dir);
  }
}

// pnpm v8 will install minimal version of the dependencies
// so we upgrade all deps to the latest version
// https://pnpm.io/npmrc#resolution-mode
async function installWithPnpm8(cwd: string) {
  await execa.execa('pnpm', ['up', '-L'], { cwd, stdio: 'inherit' });
}

async function getPnpmMajorVersion() {
  try {
    const { stdout } = await execa.execa('pnpm', ['--version']);
    return parseInt(stdout.trim().split('.')[0], 10);
  } catch (e) {
    throw new Error('Please install pnpm first', { cause: e });
  }
}
