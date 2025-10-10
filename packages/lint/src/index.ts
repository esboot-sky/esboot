import { resolve } from 'node:path';
import process from 'node:process';
import { exec } from '@dz-web/esboot-common/execa';
import {
  copySync,
  ensureDirSync,
  pathExistsSync,
} from '@dz-web/esboot-common/fs-extra';
import { createResolvePath, error, info, resolveLibPath } from '@dz-web/esboot-common/helpers';

const resolvePath = createResolvePath(import.meta.resolve);
const _resolveLibPath = (p: string, relativePath = ''): string => resolveLibPath(p, resolvePath, relativePath);

export async function lint({ cwd, args = [] }: { cwd: string; args: string[] }): Promise<void> {
  exec(`node ${_resolveLibPath('stylelint', 'bin/stylelint.mjs')} '**/*.scss' ${args.join(' ')}`, {
    onError: () => void 0,
  });

  exec(`node ${_resolveLibPath('eslint', '/bin/eslint.js')} --ext .jsx,.js,.ts,.tsx ${resolve(cwd, 'src')} ${args}`, {
    onError: () => void 0,
  });
}

export function huskySetup({ configRootPath }: { configRootPath: string }): void {
  const huskyCfgTarget = resolve(configRootPath, '.husky');
  if (!pathExistsSync(huskyCfgTarget)) {
    ensureDirSync(huskyCfgTarget);
    copySync(resolve(__dirname, '../config/.husky'), huskyCfgTarget);
  }
  exec(`node ${resolvePath('husky/lib/bin')} install config/.husky`, {
    onError: (err) => {
      error(err.message);
    },
  });
}

export async function execGitHooks(options: { type: string; cwd: string }): Promise<void> {
  const { type, cwd } = options;

  switch (type) {
    case 'pre-commit':
      info('Start checking staged files...');

      await exec(`node ${resolvePath('lint-staged/bin')} --cwd ${cwd}`, {
        onError: () => process.exit(1),
      });
      info('Checking staged files done.');
      break;
    case 'commit-msg':
      info('Start checking commit message...');
      await exec(
        `node ${resolvePath('@commitlint/cli')} --from HEAD~1 --to HEAD --edit $1`,
        {
          onError: () => process.exit(1),
        },
      );
      info('Checking commit message done.');
      break;
    default:
      info('unknown execGitHooks type');
      process.exit(1);
  }
}
