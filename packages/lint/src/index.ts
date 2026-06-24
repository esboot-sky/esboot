import { writeFileSync } from 'node:fs';
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
const _resolveLibPath = (p: string, relativePath = ''): string => resolveLibPath(p, import.meta.resolve, relativePath);

const JS_TS_REGEX = /\.(?:js|jsx|ts|tsx)$/;
const CSS_SCSS_REGEX = /\.(?:css|scss)$/;

export async function lint({ cwd, args = [] }: { cwd: string; args: string[] }): Promise<void> {
  exec(`node ${_resolveLibPath('stylelint', 'bin/stylelint.mjs')} '**/*.scss' ${args.join(' ')}`, {
    onError: () => void 0,
  });

  exec(`node ${_resolveLibPath('eslint', '/bin/eslint.js')} --ext .jsx,.js,.ts,.tsx ${resolve(cwd, 'src')} ${args}`, {
    onError: () => void 0,
  });
}

export function huskySetup({ configRootPath }: { configRootPath: string }): void {
  if (!pathExistsSync(resolve(process.cwd(), '.git'))) {
    return;
  }

  const huskyCfgTarget = resolve(configRootPath, '.husky');

  if (!pathExistsSync(huskyCfgTarget)) {
    ensureDirSync(huskyCfgTarget);
    copySync(resolve(__dirname, '../config/.husky'), huskyCfgTarget);
  }

  exec(`node ${_resolveLibPath('husky', './lib/bin.js')} install config/.husky`, {
    onError: (err) => {
      error(err.message);
    },
  });
}

export async function execGitHooks(options: { type: string; cwd: string }): Promise<void> {
  const { type, cwd } = options;

  switch (type) {
    case 'pre-commit': {
      info('Start checking staged files...');

      let stagedFiles: string[] = [];
      try {
        const result = (await exec('git diff --cached --name-only --diff-filter=ACMR', {
          options: { stdio: 'pipe' },
        })) as any;
        if (result && result.stdout) {
          stagedFiles = (result.stdout as string)
            .split('\n')
            .map((f: string) => f.trim())
            .filter(Boolean);
        }
      }
      catch {
        // Fallback to checking both if git diff fails
      }

      const hasJsTs = stagedFiles.length === 0 || stagedFiles.some(f => JS_TS_REGEX.test(f));
      const hasCssScss = stagedFiles.length === 0 || stagedFiles.some(f => CSS_SCSS_REGEX.test(f));

      const cacheDir = resolve(cwd, 'node_modules/.cache/esboot');
      ensureDirSync(cacheDir);

      if (hasJsTs) {
        info('Start ESLint check...');
        const eslintConfigPath = resolve(cacheDir, '.lintstagedrc-eslint.json');
        writeFileSync(
          eslintConfigPath,
          JSON.stringify({
            '*.{js,jsx,ts,tsx}': 'eslint',
          }, null, 2),
          'utf-8',
        );

        await exec(`node ${resolvePath('lint-staged/bin')} --cwd ${cwd} --config ${eslintConfigPath}`, {
          onError: () => process.exit(1),
        });
        info('ESLint check passed.');
      }

      if (hasCssScss) {
        info('Start Stylelint check...');
        const stylelintConfigPath = resolve(cacheDir, '.lintstagedrc-stylelint.json');
        writeFileSync(
          stylelintConfigPath,
          JSON.stringify({
            '*.{scss,css}': 'stylelint',
          }, null, 2),
          'utf-8',
        );

        await exec(`node ${resolvePath('lint-staged/bin')} --cwd ${cwd} --config ${stylelintConfigPath}`, {
          onError: () => process.exit(1),
        });
        info('Stylelint check passed.');
      }

      info('Checking staged files done.');
      break;
    }
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
