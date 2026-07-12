import { describe, expect, it, vi } from 'vitest';

const ReactRefreshPlugin = vi.fn();

vi.mock('@rspack/plugin-react-refresh', () => ({
  ReactRefreshRspackPlugin: class MockReactRefreshPlugin {
    constructor() {
      ReactRefreshPlugin();
    }
  },
}));

describe('rspack addReact partial', () => {
  it('adds tsx swc rule with React Compiler and react refresh plugin in development', async () => {
    const { addReact } = await import('./add-react');
    const rspackCfg = {
      module: { rules: [] as unknown[] },
      plugins: [] as unknown[],
    };

    await addReact({
      config: {
        isDev: true,
        rootPath: '/repo/app',
        cwd: '/repo/app',
        experimental: {
          reactCompiler: {
            enable: true,
            target: '19',
          },
        },
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.module.rules).toHaveLength(1);
    expect((rspackCfg.module.rules[0] as any).use[0].loader).toBe('builtin:swc-loader');
    expect((rspackCfg.module.rules[0] as any).use[0].options.jsc.parser).toEqual({
      syntax: 'typescript',
      tsx: true,
    });
    expect((rspackCfg.module.rules[0] as any).use[0].options.jsc.transform.reactCompiler).toBe(true);
    expect(ReactRefreshPlugin).toHaveBeenCalled();
    expect(rspackCfg.plugins).toHaveLength(1);
  });

  it('passes React 18 target to React Compiler when configured', async () => {
    const { addReact } = await import('./add-react');
    const rspackCfg = {
      module: { rules: [] as unknown[] },
      plugins: [] as unknown[],
    };

    await addReact({
      config: {
        isDev: false,
        rootPath: '/repo/app',
        cwd: '/repo/app',
        experimental: {
          reactCompiler: {
            enable: true,
            target: '18',
          },
        },
      },
    } as any, rspackCfg as any);

    expect((rspackCfg.module.rules[0] as any).use[0].options.jsc.transform.reactCompiler).toEqual({
      target: '18',
    });
  });

  it('does not enable React Compiler when disabled', async () => {
    const { addReact } = await import('./add-react');
    const rspackCfg = {
      module: { rules: [] as unknown[] },
      plugins: [] as unknown[],
    };

    await addReact({
      config: {
        isDev: false,
        rootPath: '/repo/app',
        cwd: '/repo/app',
        experimental: {
          reactCompiler: {
            enable: false,
            target: '19',
          },
        },
      },
    } as any, rspackCfg as any);

    expect((rspackCfg.module.rules[0] as any).use[0].options.jsc.transform.reactCompiler).toBeUndefined();
  });
});
