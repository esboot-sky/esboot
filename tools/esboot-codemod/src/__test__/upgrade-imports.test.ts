import { Buffer } from 'node:buffer';
import { join, resolve } from 'node:path';
import fs from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const execaMock = vi.fn();

vi.mock('execa', () => ({
  execa: execaMock,
}));

describe('upgrade-v4 migration', () => {
  const testDir = resolve(process.cwd(), 'tmp/esboot-codemod-imports-test');

  beforeEach(() => {
    fs.removeSync(testDir);
    fs.ensureDirSync(join(testDir, 'src/styles'));

    fs.writeJsonSync(join(testDir, 'package.json'), {
      name: 'test-app',
      version: '1.0.0',
      devDependencies: {
        '@dz-web/esboot': '^3.0.0',
        '@dz-web/esboot-bundler-webpack': '^3.0.0',
        'eslint': '^9.0.0',
        'stylelint': '^16.0.0',
      },
    }, { spaces: 2 });

    fs.writeFileSync(join(testDir, '.esbootrc.ts'), `import { defineConfig } from '@dz-web/esboot';
import type { BabelPlugin, BundlerWebpackOptions } from '@dz-web/esboot-bundler-webpack';

const webpackOptions: BundlerWebpackOptions = {
  extraBabelPlugins: [] as BabelPlugin[],
};

export default defineConfig({
  bundlerOptions: webpackOptions,
});
`, 'utf-8');

    fs.writeFileSync(join(testDir, 'src/styles/index.scss'), '.root {}', 'utf-8');

    execaMock.mockReset();
    execaMock.mockImplementation((command: string, args: string[] = []) => {
      if (command === 'git' && args[0] === 'status') {
        return Promise.resolve({ stdout: '' });
      }

      if (command === 'npm' && args[0] === 'view') {
        return Promise.resolve({ stdout: '4.3.6' });
      }

      if (command === 'pnpm') {
        if (args[0] === 'exec' && args[2] === 'dev') {
          return Object.assign(Promise.resolve({ stdout: '' }), {
            kill() {},
            stdout: {
              on(_event: string, callback: (data: Buffer) => void) {
                callback(Buffer.from('ready - started server'));
              },
            },
          });
        }

        return Promise.resolve({ stdout: '' });
      }

      return Promise.resolve({ stdout: '' });
    });
  });

  afterEach(() => {
    fs.removeSync(testDir);
  });

  it('moves BabelPlugin imports from webpack package to esboot', async () => {
    const { upgradeV4 } = await import('../upgrade-v4.js');

    await upgradeV4({ cwd: testDir, keepTailwind3: false });

    const pkg = fs.readJsonSync(join(testDir, 'package.json'));
    const esbootrcContent = fs.readFileSync(join(testDir, '.esbootrc.ts'), 'utf-8');
    expect(pkg.devDependencies.eslint).toBe('^10.4.1');
    expect(pkg.devDependencies.stylelint).toBe('^17.13.0');
    expect(esbootrcContent).toMatch(/import type \{ BabelPlugin \} from ['"]@dz-web\/esboot['"];/);
    expect(esbootrcContent).toMatch(/import type \{ BundlerWebpackOptions \} from ['"]@dz-web\/esboot-bundler-webpack['"];/);
    expect(esbootrcContent).not.toMatch(/import type \{ BabelPlugin,\s*BundlerWebpackOptions \} from ['"]@dz-web\/esboot-bundler-webpack['"];/);
  });

  it('removes the legacy root husky directory', async () => {
    const { upgradeV4 } = await import('../upgrade-v4.js');

    fs.ensureDirSync(join(testDir, '.husky'));
    fs.ensureDirSync(join(testDir, 'config/.husky'));
    fs.writeFileSync(join(testDir, '.husky/pre-commit'), 'npm test\n', 'utf-8');
    fs.writeFileSync(join(testDir, 'config/.husky/pre-commit'), 'node hook.js\n', 'utf-8');

    await upgradeV4({ cwd: testDir, keepTailwind3: false });

    expect(fs.existsSync(join(testDir, '.husky'))).toBe(false);
    expect(fs.readFileSync(join(testDir, 'config/.husky/pre-commit'), 'utf-8')).toBe('node hook.js\n');
  });

  it('makes config husky hooks executable', async () => {
    const { upgradeV4 } = await import('../upgrade-v4.js');

    fs.ensureDirSync(join(testDir, 'config/.husky'));
    fs.writeFileSync(join(testDir, 'config/.husky/pre-commit'), 'node pre-commit.js\n', 'utf-8');
    fs.writeFileSync(join(testDir, 'config/.husky/commit-msg'), 'node commit-msg.js\n', 'utf-8');
    fs.chmodSync(join(testDir, 'config/.husky/pre-commit'), 0o644);
    fs.chmodSync(join(testDir, 'config/.husky/commit-msg'), 0o644);

    await upgradeV4({ cwd: testDir, keepTailwind3: false });

    expect(fs.statSync(join(testDir, 'config/.husky/pre-commit')).mode & 0o111).toBeGreaterThan(0);
    expect(fs.statSync(join(testDir, 'config/.husky/commit-msg')).mode & 0o111).toBeGreaterThan(0);
  });
});
