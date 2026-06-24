import { beforeEach, describe, expect, it, vi } from 'vitest';

const exec = vi.fn();
const copySync = vi.fn();
const ensureDirSync = vi.fn();
const pathExistsSync = vi.fn();
const error = vi.fn();
const info = vi.fn();
const createResolvePath = vi.fn(() => (p: string) => `/resolved/${p}`);
const resolveLibPath = vi.fn((p: string, _resolver?: unknown, relativePath = '') => `/libs/${p}${relativePath}`);
const writeFileSync = vi.fn();

vi.mock('node:fs', () => ({
  writeFileSync,
}));

vi.mock('@dz-web/esboot-common/execa', () => ({
  exec,
}));

vi.mock('@dz-web/esboot-common/fs-extra', () => ({
  copySync,
  ensureDirSync,
  pathExistsSync,
}));

vi.mock('@dz-web/esboot-common/helpers', () => ({
  createResolvePath,
  error,
  info,
  resolveLibPath,
}));

describe('lint package runtime helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs stylelint and eslint for the project src directory', async () => {
    const { lint } = await import('./index');

    await lint({ cwd: '/repo/app', args: ['--fix'] });

    expect(exec).toHaveBeenNthCalledWith(1, expect.stringContaining(`node /libs/stylelintbin/stylelint.mjs '**/*.scss' --fix`), expect.any(Object));
    expect(exec).toHaveBeenNthCalledWith(2, expect.stringContaining('node /libs/eslint/bin/eslint.js --ext .jsx,.js,.ts,.tsx /repo/app/src --fix'), expect.any(Object));
  });

  it('creates husky config and installs hooks when git root exists and target is missing', async () => {
    pathExistsSync
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const { huskySetup } = await import('./index');

    huskySetup({ configRootPath: '/repo/config' });

    expect(ensureDirSync).toHaveBeenCalledWith('/repo/config/.husky');
    expect(copySync).toHaveBeenCalledWith(expect.stringContaining('/config/.husky'), '/repo/config/.husky');
    expect(exec).toHaveBeenCalledWith('node /libs/husky./lib/bin.js install config/.husky', expect.any(Object));
  });

  it('skips husky setup when no git directory exists', async () => {
    pathExistsSync.mockReturnValue(false);

    const { huskySetup } = await import('./index');

    huskySetup({ configRootPath: '/repo/config' });

    expect(ensureDirSync).not.toHaveBeenCalled();
    expect(exec).not.toHaveBeenCalled();
  });

  it('runs both eslint and stylelint when git diff returns empty (fallback)', async () => {
    const { execGitHooks } = await import('./index');
    exec.mockImplementation((cmd) => {
      if (cmd.includes('git diff')) {
        return Promise.resolve({ stdout: '' });
      }
      return Promise.resolve();
    });

    await execGitHooks({ type: 'pre-commit', cwd: '/repo/app' });

    expect(info).toHaveBeenCalledWith('Start checking staged files...');
    expect(info).toHaveBeenCalledWith('Start ESLint check...');
    expect(exec).toHaveBeenCalledWith('node /resolved/lint-staged/bin --cwd /repo/app --config /repo/app/node_modules/.cache/esboot/.lintstagedrc-eslint.json', expect.any(Object));
    expect(info).toHaveBeenCalledWith('ESLint check passed.');
    expect(info).toHaveBeenCalledWith('Start Stylelint check...');
    expect(exec).toHaveBeenCalledWith('node /resolved/lint-staged/bin --cwd /repo/app --config /repo/app/node_modules/.cache/esboot/.lintstagedrc-stylelint.json', expect.any(Object));
    expect(info).toHaveBeenCalledWith('Stylelint check passed.');
    expect(info).toHaveBeenCalledWith('Checking staged files done.');
  });

  it('runs only eslint when only js/ts files are staged', async () => {
    const { execGitHooks } = await import('./index');
    exec.mockImplementation((cmd) => {
      if (cmd.includes('git diff')) {
        return Promise.resolve({ stdout: 'src/index.ts\nsrc/utils.js' });
      }
      return Promise.resolve();
    });

    await execGitHooks({ type: 'pre-commit', cwd: '/repo/app' });

    expect(info).toHaveBeenCalledWith('Start ESLint check...');
    expect(exec).toHaveBeenCalledWith('node /resolved/lint-staged/bin --cwd /repo/app --config /repo/app/node_modules/.cache/esboot/.lintstagedrc-eslint.json', expect.any(Object));
    expect(info).not.toHaveBeenCalledWith('Start Stylelint check...');
  });

  it('runs only stylelint when only css/scss files are staged', async () => {
    const { execGitHooks } = await import('./index');
    exec.mockImplementation((cmd) => {
      if (cmd.includes('git diff')) {
        return Promise.resolve({ stdout: 'src/index.scss\nsrc/global.css' });
      }
      return Promise.resolve();
    });

    await execGitHooks({ type: 'pre-commit', cwd: '/repo/app' });

    expect(info).not.toHaveBeenCalledWith('Start ESLint check...');
    expect(info).toHaveBeenCalledWith('Start Stylelint check...');
    expect(exec).toHaveBeenCalledWith('node /resolved/lint-staged/bin --cwd /repo/app --config /repo/app/node_modules/.cache/esboot/.lintstagedrc-stylelint.json', expect.any(Object));
  });

  it('runs neither when no js/ts/css/scss files are staged', async () => {
    const { execGitHooks } = await import('./index');
    exec.mockImplementation((cmd) => {
      if (cmd.includes('git diff')) {
        return Promise.resolve({ stdout: 'README.md\npackage.json' });
      }
      return Promise.resolve();
    });

    await execGitHooks({ type: 'pre-commit', cwd: '/repo/app' });

    expect(info).not.toHaveBeenCalledWith('Start ESLint check...');
    expect(info).not.toHaveBeenCalledWith('Start Stylelint check...');
    expect(info).toHaveBeenCalledWith('Checking staged files done.');
  });

  it('pre-commit calls process.exit(1) on failure', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const { execGitHooks } = await import('./index');

    exec.mockImplementation((cmd, options) => {
      if (cmd.includes('git diff')) {
        return Promise.resolve({ stdout: 'src/index.ts' });
      }
      if (options && typeof options.onError === 'function') {
        options.onError(new Error('test error'));
      }
      return Promise.resolve();
    });

    await execGitHooks({ type: 'pre-commit', cwd: '/repo/app' });

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });
});
