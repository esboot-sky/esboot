import { beforeEach, describe, expect, it, vi } from 'vitest';

const { callPluginHookOfModifyBundlerConfig, callPluginHookOfOnlyExec } = vi.hoisted(() => ({
  callPluginHookOfModifyBundlerConfig: vi.fn(),
  callPluginHookOfOnlyExec: vi.fn(),
}));

vi.mock('@/plugin', () => ({
  callPluginHookOfModifyBundlerConfig,
  callPluginHookOfOnlyExec,
}));

class TestBundler extends (await import('./index')).Bundler {
  dev(): void {}
  build(): void {}
  getName(): string {
    return 'test-bundler';
  }
}

describe('Bundler base class', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates modifyBundlerConfig hooks and returns the same config object', () => {
    const config = { value: 1 };
    const bundler = new TestBundler({
      configuration: {
        config: {
          cwd: '/repo/app',
        },
      },
      pluginHooksDict: {
        hooks: true,
      },
    } as any);

    expect(bundler.onModifyBundlerConfig(config)).toBe(config);
    expect(callPluginHookOfModifyBundlerConfig).toHaveBeenCalledWith(
      { hooks: true },
      { cwd: '/repo/app' },
      config,
      'test-bundler',
    );
  });

  it('delegates afterCompile hooks', () => {
    const bundler = new TestBundler({
      configuration: {
        config: {
          cwd: '/repo/app',
        },
      },
      pluginHooksDict: {
        hooks: true,
      },
    } as any);

    bundler.onAfterCompile();

    expect(callPluginHookOfOnlyExec).toHaveBeenCalled();
  });
});
