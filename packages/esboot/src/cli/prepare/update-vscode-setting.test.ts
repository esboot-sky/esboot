import { beforeEach, describe, expect, it, vi } from 'vitest';

const { ensureFileSync, readJSON, writeJSON, merge, info, error } = vi.hoisted(() => ({
  ensureFileSync: vi.fn(),
  readJSON: vi.fn(),
  writeJSON: vi.fn(() => Promise.resolve()),
  merge: vi.fn((...objects: Record<string, unknown>[]) => Object.assign({}, ...objects)),
  info: vi.fn(),
  error: vi.fn(),
}));

vi.mock('@dz-web/esboot-common/fs-extra', () => ({
  ensureFileSync,
  readJSON,
  writeJSON,
}));

vi.mock('@dz-web/esboot-common/helpers', () => ({
  info,
  error,
}));

vi.mock('@dz-web/esboot-common/lodash', () => ({
  merge,
}));

describe('updateVSCodeSetting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates and updates vscode settings and extensions recommendations', async () => {
    vi.resetModules();
    readJSON
      .mockResolvedValueOnce({ existing: true })
      .mockResolvedValueOnce({ recommendations: ['existing.extension'] });
    vi.doMock('@/cfg', () => ({
      cfg: {
        config: {
          cwd: '/repo/app',
        },
      },
    }));

    const { updateVSCodeSetting } = await import('./update-vscode-setting');

    updateVSCodeSetting();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(ensureFileSync).toHaveBeenCalledWith('/repo/app/.vscode/settings.json');
    expect(ensureFileSync).toHaveBeenCalledWith('/repo/app/.vscode/extensions.json');
    expect(writeJSON).toHaveBeenNthCalledWith(
      1,
      '/repo/app/.vscode/settings.json',
      expect.objectContaining({
        existing: true,
        'i18n-ally.localesPaths': ['src/lang'],
      }),
      { spaces: 2 },
    );
    expect(writeJSON).toHaveBeenNthCalledWith(
      2,
      '/repo/app/.vscode/extensions.json',
      expect.objectContaining({
        recommendations: expect.arrayContaining(['moonlitusun.esboot']),
      }),
      { spaces: 2 },
    );
    expect(writeJSON).toHaveBeenCalledTimes(2);
    expect(error).not.toHaveBeenCalled();
  });
});
