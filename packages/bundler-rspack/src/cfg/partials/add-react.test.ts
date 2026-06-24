import { describe, expect, it, vi } from 'vitest';

const ReactRefreshPlugin = vi.fn(function MockReactRefreshPlugin(this: Record<string, unknown>) {});

vi.mock('@rspack/plugin-react-refresh', () => ({
  ReactRefreshRspackPlugin: ReactRefreshPlugin,
}));

describe('rspack addReact partial', () => {
  it('adds tsx swc rule and react refresh plugin in development', async () => {
    const { addReact } = await import('./add-react');
    const rspackCfg = {
      module: { rules: [] as unknown[] },
      plugins: [] as unknown[],
    };

    await addReact({
      config: {
        isDev: true,
        rootPath: '/repo/app',
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.module.rules).toHaveLength(1);
    expect((rspackCfg.module.rules[0] as any).use[0].loader).toBe('builtin:swc-loader');
    expect((rspackCfg.module.rules[0] as any).use[0].options.jsc.parser).toEqual({
      syntax: 'typescript',
      tsx: true,
    });
    expect((rspackCfg.module.rules[0] as any).use[0].options.jsc.experimental).toBeUndefined();
    expect(ReactRefreshPlugin).toHaveBeenCalled();
    expect(rspackCfg.plugins).toHaveLength(1);
  });
});
