import { resolve } from 'path';
import { exec } from '@dz-web/esboot-common/execa';
import { info, error } from '@dz-web/esboot-common/helpers';
import {
  copySync,
  existsSync,
  ensureDirSync,
} from '@dz-web/esboot-common/fs-extra';

export async function lint({ cwd }: { cwd: string }) {
  const args = process.argv.slice(3);
  exec(`node ${require.resolve('stylelint/bin/stylelint')} **/*.scss ${args}`, {
    onError: () => void 0,
  });
  // Special case for eslint
  exec(`eslint --ext .jsx,.js,.ts,.tsx ${resolve(cwd, 'src')} ${args}`, {
    onError: () => void 0,
  });
}

export function huskySetup({ configRootPath }: { configRootPath: string }) {
  const huskyCfgTarget = resolve(configRootPath, '.husky');
  if (!existsSync(huskyCfgTarget)) {
    ensureDirSync(huskyCfgTarget);
    copySync(resolve(__dirname, '../config/.husky'), huskyCfgTarget);
  }
  exec(`node ${require.resolve('husky/lib/bin')} install config/.husky`, {
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

      await exec(`node ${require.resolve('lint-staged/bin')} --cwd ${cwd}`, {
        onError: () => process.exit(1),
      });
      info('Checking staged files done.');
      break;
    case 'commit-msg':
      info('Start checking commit message...');
      await exec(
        `node ${require.resolve('@commitlint/cli')} --from HEAD~1 --to HEAD --edit $1`,
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
