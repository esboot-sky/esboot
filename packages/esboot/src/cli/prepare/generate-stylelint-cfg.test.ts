import { beforeEach, describe, expect, it, vi } from 'vitest';

const { writeFile, ensureFileSync, info, error, callPluginHookOfModifyLintConfig } = vi.hoisted(() => ({
  writeFile: vi.fn(() => Promise.resolve()),
  ensureFileSync: vi.fn(),
  info: vi.fn(),
  error: vi.fn(),
  callPluginHookOfModifyLintConfig: vi.fn(),
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

vi.mock('@/plugin', () => ({
  callPluginHookOfModifyLintConfig,
}));

describe('generateStylelintCfg', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs stylelint modify hooks and writes the config module', async () => {
    vi.resetModules();
    vi.doMock('@/cfg', () => ({
      cfg: {
        config: {
          cwd: '/repo/app',
        },
      },
    }));

    const { generateStylelintCfg } = await import('./generate-stylelint-cfg');

    generateStylelintCfg();
    await Promise.resolve();

    expect(callPluginHookOfModifyLintConfig).toHaveBeenCalled();
    expect(ensureFileSync).toHaveBeenCalledWith(expect.stringContaining('/stylelint/index.js'));
    expect(writeFile).toHaveBeenCalledWith(
      expect.stringContaining('/stylelint/index.js'),
      expect.stringContaining('export default'),
    );
    expect(error).not.toHaveBeenCalled();
  });
});
