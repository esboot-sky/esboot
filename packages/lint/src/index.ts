import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from '@dz-web/esboot-common/execa';
import { info, error, resolveLibPath } from '@dz-web/esboot-common/helpers';
import {
  copySync,
  pathExistsSync,
  ensureDirSync,
} from '@dz-web/esboot-common/fs-extra';

const resolvePath = (p: string) => fileURLToPath(import.meta.resolve(p));
const _resolveLibPath = (p: string, relativePath = '') => resolveLibPath(p, resolvePath, relativePath);

export async function lint({ cwd, args = [] }: { cwd: string; args: string[] }) {
  exec(`node ${_resolveLibPath('stylelint', 'bin/stylelint.mjs')} '**/*.scss' ${args.join(' ')}`, {
    onError: () => void 0,
  });
  // Special case for eslint
  // exec(`eslint --ext .jsx,.js,.ts,.tsx ${resolve(cwd, 'src')} ${args}`, {
  //   onError: () => void 0,
  // });
}

export function huskySetup({ configRootPath }: { configRootPath: string }) {
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

export async function execGitHooks(options: { type: string; cwd: string }) {
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
        }
      );
      info('Checking commit message done.');
      break;
    default:
      info('unknown execGitHooks type');
      process.exit(1);
  }
}
