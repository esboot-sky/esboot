import { beforeEach, describe, expect, it, vi } from 'vitest';

const calls: string[] = [];

const { huskySetup, error, callPluginHookOfOnlyExec } = vi.hoisted(() => ({
  huskySetup: vi.fn(),
  error: vi.fn(),
  callPluginHookOfOnlyExec: vi.fn(),
}));

vi.mock('@dz-web/esboot-common/helpers', () => ({
  error,
}));

vi.mock('@dz-web/esboot-lint', () => ({
  huskySetup,
}));

vi.mock('@/plugin', () => ({
  callPluginHookOfOnlyExec,
  pluginHooksDict: { hooks: true },
}));

vi.mock('./generate-typescript-cfg', () => ({
  generateTypeScriptCfg: () => {
    calls.push('tsconfig');
  },
}));

vi.mock('./generate-typescript-types', () => ({
  generateTypeScriptTypes: () => {
    calls.push('types');
  },
}));

vi.mock('./generate-stylelint-cfg', () => ({
  generateStylelintCfg: () => {
    calls.push('stylelint');
  },
}));

vi.mock('./generate-prettier-cfg', () => ({
  generatePrettierCfg: () => {
    calls.push('prettier');
  },
}));

vi.mock('./generate-commitlint-cfg', () => ({
  generateCommitlintCfg: () => {
    calls.push('commitlint');
  },
}));

vi.mock('./update-vscode-setting', () => ({
  updateVSCodeSetting: () => {
    calls.push('vscode');
  },
}));

describe('prepare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calls.length = 0;
  });

  it('runs full prepare flow and husky setup outside CI', async () => {
    vi.resetModules();
    vi.doMock('@/cfg', () => ({
      cfg: {
        config: {
          isCIBuild: false,
          configRootPath: '/repo/app/config',
        },
      },
    }));

    const { prepare } = await import('./index');

    prepare();

    expect(calls).toEqual(['tsconfig', 'types', 'stylelint', 'prettier', 'commitlint', 'vscode']);
    expect(huskySetup).toHaveBeenCalledWith({ configRootPath: '/repo/app/config' });
    expect(callPluginHookOfOnlyExec).toHaveBeenCalled();
  });

  it('skips nonessential local tooling generation in CI', async () => {
    vi.resetModules();
    vi.doMock('@/cfg', () => ({
      cfg: {
        config: {
          isCIBuild: true,
          configRootPath: '/repo/app/config',
        },
      },
    }));

    const { prepare } = await import('./index');

    prepare();

    expect(calls).toEqual(['tsconfig', 'types']);
    expect(huskySetup).not.toHaveBeenCalled();
    expect(callPluginHookOfOnlyExec).toHaveBeenCalled();
  });
});
