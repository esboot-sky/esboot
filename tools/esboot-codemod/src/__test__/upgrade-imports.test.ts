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
        return Promise.resolve({ stdout: '' });
      }

      return Promise.resolve({ stdout: '' });
    });
  });

  afterEach(() => {
    fs.removeSync(testDir);
  });

  it('prints a migration summary checklist after a successful upgrade', async () => {
    const { upgradeV4 } = await import('../upgrade-v4.js');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    let output = '';

    try {
      await upgradeV4({ cwd: testDir, keepTailwind3: false });
      output = logSpy.mock.calls.flat().join('\n');
    }
    finally {
      logSpy.mockRestore();
    }

    expect(output).toContain('Migration summary');
    expect(output).toContain('- upgraded @dz-web/esboot to workspace:*');
    expect(output).toContain('- upgraded eslint to ^10.4.1');
    expect(output).toContain('- upgraded stylelint to ^17.13.0');
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

  it('removes legacy local normalize styles that are now built in', async () => {
    const { upgradeV4 } = await import('../upgrade-v4.js');

    fs.writeFileSync(
      join(testDir, 'src/styles/index.scss'),
      `@use './normalize';

.root {}
`,
      'utf-8',
    );
    fs.writeFileSync(
      join(testDir, 'src/styles/_normalize.scss'),
      'html { line-height: 1.15; }\n',
      'utf-8',
    );

    await upgradeV4({ cwd: testDir, keepTailwind3: false });

    expect(fs.readFileSync(join(testDir, 'src/styles/index.scss'), 'utf-8')).not.toContain(`@use './normalize';`);
    expect(fs.existsSync(join(testDir, 'src/styles/_normalize.scss'))).toBe(false);
  });

  it('verifies only the production build and does not start the dev server', async () => {
    const { upgradeV4 } = await import('../upgrade-v4.js');

    execaMock.mockImplementation((command: string, args: string[] = []) => {
      if (command === 'git' && args[0] === 'status') {
        return Promise.resolve({ stdout: '' });
      }

      if (command === 'npm' && args[0] === 'view') {
        return Promise.resolve({ stdout: '4.3.6' });
      }

      return Promise.resolve({ stdout: '' });
    });

    await upgradeV4({ cwd: testDir, keepTailwind3: false });

    expect(execaMock).toHaveBeenCalledWith('pnpm', ['exec', 'esboot', 'build'], expect.any(Object));
    expect(execaMock).not.toHaveBeenCalledWith('pnpm', ['exec', 'esboot', 'dev'], expect.any(Object));
  });

  it('fixes common esbootrc lint issues for process imports and inline regex arrays', async () => {
    const { upgradeV4 } = await import('../upgrade-v4.js');

    fs.writeFileSync(
      join(testDir, '.esbootrc.ts'),
      `import type { UserOptions } from '@dz-web/esboot';
import type { BundlerWebpackOptions } from '@dz-web/esboot-bundler-webpack';
import { defineConfig } from '@dz-web/esboot';

export default defineConfig<BundlerWebpackOptions>((cfg) => {
  const bundler = process.env.ESBOOT_BUNDLER;

  return {
    bundlerOptions: {
      extraBabelIncludes: [
        /immer/i,
        /zustand/i,
      ],
    },
    px2rem: {
      enable: true,
      exclude: [/node_modules/],
    },
    define: {
      'process.env.BUNDLER': bundler as any,
    },
  } as UserOptions<BundlerWebpackOptions>;
});
`,
      'utf-8',
    );

    await upgradeV4({ cwd: testDir, keepTailwind3: false });

    const esbootrcContent = fs.readFileSync(join(testDir, '.esbootrc.ts'), 'utf-8');
    expect(esbootrcContent).toMatch(/import process from ['"]node:process['"];/);
    expect(esbootrcContent).toContain('const EXTRA_BABEL_INCLUDES = [');
    expect(esbootrcContent).toContain('const PX2REM_EXCLUDE = [');
    expect(esbootrcContent).toContain('extraBabelIncludes: EXTRA_BABEL_INCLUDES');
    expect(esbootrcContent).toContain('exclude: PX2REM_EXCLUDE');
  });

  it('exits early with a prompt when the project is not an esboot project', async () => {
    const { upgradeV4 } = await import('../upgrade-v4.js');
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    fs.writeJsonSync(join(testDir, 'package.json'), {
      name: 'non-esboot-app',
      version: '1.0.0',
      devDependencies: {
        eslint: '^9.0.0',
      },
    }, { spaces: 2 });

    try {
      const result = await upgradeV4({ cwd: testDir, keepTailwind3: false });
      expect(result).toBe('not-esboot-project');
      expect(logSpy.mock.calls.flat().join('\n')).toContain('This directory does not appear to be an ESBoot project');
      expect(execaMock).not.toHaveBeenCalledWith('pnpm', ['install', '--filter', '.'], expect.any(Object));
    }
    finally {
      logSpy.mockRestore();
    }
  });
});
