import { beforeEach, describe, expect, it, vi } from 'vitest';

const { patch, getListener, registerCommands, merge } = vi.hoisted(() => ({
  patch: vi.fn(),
  getListener: vi.fn(),
  registerCommands: vi.fn(),
  merge: vi.fn((target: Record<string, unknown>, source: Record<string, unknown>) => ({
    ...target,
    ...source,
  })),
}));

vi.mock('@/cfg', () => ({
  cfg: {
    patch,
  },
}));

vi.mock('./index', () => ({
  pluginHooksDict: {
    getListener,
  },
}));

vi.mock('./register-commands', () => ({
  registerCommands,
}));

vi.mock('@dz-web/esboot-common/lodash', () => ({
  merge,
}));

describe('plugin hook actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('patches config with each modifyConfig hook result', async () => {
    getListener.mockReturnValue([
      () => ({ alias: { '@': 'src' } }),
      () => ({ isSP: true }),
    ]);

    const { callPluginHookOfModifyConfig } = await import('./hooks-action');

    callPluginHookOfModifyConfig({ cwd: '/repo/app' } as any);

    expect(patch).toHaveBeenNthCalledWith(1, { alias: { '@': 'src' } });
    expect(patch).toHaveBeenNthCalledWith(2, { isSP: true });
  });

  it('collects registered commands and forwards them to registerCommands', async () => {
    getListener.mockReturnValue([
      () => [{ name: 'docs' }],
      () => [{ name: 'vitest' }],
    ]);

    const { callPluginHookOfRegisterCommands } = await import('./hooks-action');

    callPluginHookOfRegisterCommands({ cwd: '/repo/app' } as any);

    expect(registerCommands).toHaveBeenCalledWith([
      { name: 'docs' },
      { name: 'vitest' },
    ]);
  });

  it('calls bundler hooks and only-exec hooks with the provided config', async () => {
    const listener = vi.fn();
    getListener.mockReturnValue([listener]);
    const dict = {
      getListener: vi.fn(() => [listener]),
    };

    const {
      callPluginHookOfModifyBundlerConfig,
      callPluginHookOfOnlyExec,
    } = await import('./hooks-action');

    callPluginHookOfModifyBundlerConfig(dict as any, { cwd: '/repo/app' } as any, { plugins: [] }, 'vite');
    callPluginHookOfOnlyExec('afterCompile' as any, dict as any, { cwd: '/repo/app' } as any);

    expect(listener).toHaveBeenCalledWith({ cwd: '/repo/app' }, { plugins: [] }, 'vite');
    expect(listener).toHaveBeenCalledWith({ cwd: '/repo/app' });
  });
});
