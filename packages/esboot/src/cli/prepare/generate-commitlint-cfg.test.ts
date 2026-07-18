import { beforeEach, describe, expect, it, vi } from 'vitest';

const { writeFile, ensureFileSync, info, error } = vi.hoisted(() => ({
  writeFile: vi.fn(() => Promise.resolve()),
  ensureFileSync: vi.fn(),
  info: vi.fn(),
  error: vi.fn(),
}));

vi.mock('node:fs/promises', () => ({
  writeFile,
}));

vi.mock('@dz-web/esboot-common/fs-extra', () => ({
  ensureFileSync,
}));

vi.mock('@dz-web/esboot-common/helpers', () => ({
  info,
  error,
}));

describe('generateCommitlintCfg', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes commitlint config into the cache directory', async () => {
    vi.resetModules();
    vi.doMock('@/cfg', () => ({
      cfg: {
        config: {
          cwd: '/repo/app',
        },
      },
    }));

    const { generateCommitlintCfg } = await import('./generate-commitlint-cfg');

    generateCommitlintCfg();
    await Promise.resolve();

    expect(ensureFileSync).toHaveBeenCalledWith('/repo/app/node_modules/.cache/esboot/commitlint/index.js');
    expect(writeFile).toHaveBeenCalledWith(
      '/repo/app/node_modules/.cache/esboot/commitlint/index.js',
      expect.stringContaining('module.exports='),
    );
    expect(error).not.toHaveBeenCalled();
  });
});
