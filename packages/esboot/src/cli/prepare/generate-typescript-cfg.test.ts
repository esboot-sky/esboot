import { beforeEach, describe, expect, it, vi } from 'vitest';

const { readFileSync, ensureDirSync, writeJSON, info, error, absListPath, callPluginHookOfModifyLintConfig } = vi.hoisted(() => ({
  readFileSync: vi.fn(() => JSON.stringify({
    compilerOptions: {
      baseUrl: '',
      paths: {},
    },
    exclude: ['node_modules'],
    include: ['src'],
  })),
  ensureDirSync: vi.fn(),
  writeJSON: vi.fn(() => Promise.resolve()),
  info: vi.fn(),
  error: vi.fn(),
  absListPath: vi.fn((_cfg: unknown, list: string[]) => list.map(item => `/repo/app/${item}`)),
  callPluginHookOfModifyLintConfig: vi.fn(),
}));

vi.mock('node:fs', () => ({
  readFileSync,
}));

vi.mock('@dz-web/esboot-common/fs-extra', () => ({
  ensureDirSync,
  writeJSON,
}));

vi.mock('@dz-web/esboot-common/helpers', () => ({
  info,
  error,
}));

vi.mock('@/helpers', () => ({
  absListPath,
}));

vi.mock('@/plugin', () => ({
  callPluginHookOfModifyLintConfig,
}));

describe('generateTypeScriptCfg', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('writes tsconfig with normalized alias paths and resolved include/exclude lists', async () => {
    vi.resetModules();
    vi.doMock('@/cfg', () => ({
      cfg: {
        config: {
          cwd: '/repo/app',
          alias: {
            '@': 'src',
            '@abs': '/shared/abs',
          },
        },
      },
    }));

    const { generateTypeScriptCfg } = await import('./generate-typescript-cfg');

    generateTypeScriptCfg();
    await Promise.resolve();

    expect(absListPath).toHaveBeenCalledTimes(2);
    expect(callPluginHookOfModifyLintConfig).toHaveBeenCalled();
    expect(ensureDirSync).toHaveBeenCalledWith(expect.stringContaining('/typescript'));
    expect(writeJSON).toHaveBeenCalledWith(
      expect.stringContaining('/typescript/tsconfig.json'),
      expect.objectContaining({
        compilerOptions: expect.objectContaining({
          baseUrl: '/repo/app',
          paths: {
            '@/*': ['src/*'],
            '@abs': ['/shared/abs'],
          },
        }),
        exclude: ['/repo/app/node_modules'],
        include: ['/repo/app/src'],
      }),
      { spaces: 2 },
    );
    expect(error).not.toHaveBeenCalled();
  });
});
