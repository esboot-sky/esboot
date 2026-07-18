import { beforeEach, describe, expect, it, vi } from 'vitest';

const { ensureFileSync, writeJSON, info, error, callPluginHookOfModifyLintConfig } = vi.hoisted(() => ({
  ensureFileSync: vi.fn(),
  writeJSON: vi.fn(() => Promise.resolve()),
  info: vi.fn(),
  error: vi.fn(),
  callPluginHookOfModifyLintConfig: vi.fn(),
}));

vi.mock('@dz-web/esboot-common/fs-extra', () => ({
  ensureFileSync,
  writeJSON,
}));

vi.mock('@dz-web/esboot-common/helpers', () => ({
  info,
  error,
}));

vi.mock('@/plugin', () => ({
  callPluginHookOfModifyLintConfig,
}));

describe('generatePrettierCfg', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs prettier modify hooks and writes the merged config', async () => {
    vi.resetModules();
    vi.doMock('@/cfg', () => ({
      cfg: {
        config: {
          cwd: '/repo/app',
        },
      },
    }));

    const { generatePrettierCfg } = await import('./generate-prettier-cfg');

    generatePrettierCfg();
    await Promise.resolve();

    expect(callPluginHookOfModifyLintConfig).toHaveBeenCalled();
    expect(ensureFileSync).toHaveBeenCalledWith('/repo/app/node_modules/.cache/esboot/prettier/index.json');
    expect(writeJSON).toHaveBeenCalledWith(
      '/repo/app/node_modules/.cache/esboot/prettier/index.json',
      expect.any(Object),
      { spaces: 2 },
    );
    expect(error).not.toHaveBeenCalled();
  });
});
