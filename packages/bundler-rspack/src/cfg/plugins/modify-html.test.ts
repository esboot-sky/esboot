import { describe, expect, it, vi } from 'vitest';

const beforeEmitTap = vi.fn();
const getCompilationHooks = vi.fn(() => ({
  beforeEmit: {
    tap: beforeEmitTap,
  },
}));
const injectHtml = vi.fn((html: string, _cfg: unknown, title: string) => `${html}::${title}`);

vi.mock('@dz-web/esboot-bundler-common', () => ({
  injectHtml,
}));

vi.mock('@rspack/core', () => ({
  HtmlRspackPlugin: {
    getCompilationHooks,
  },
}));

describe('rspack html modify plugin', () => {
  it('registers a beforeEmit hook that injects html content', async () => {
    const { addPluginModifyHtml } = await import('./add-plugin-modify-html');
    const rspackCfg = { plugins: [] as unknown[] };

    await addPluginModifyHtml({ config: {} } as any, rspackCfg as any);

    const plugin = rspackCfg.plugins[0] as { apply: (compiler: any) => void };
    const compilationTap = vi.fn();

    plugin.apply({
      hooks: {
        compilation: {
          tap: (_name: string, callback: (compilation: unknown) => void) => {
            compilationTap();
            callback({});
          },
        },
      },
    });

    expect(compilationTap).toHaveBeenCalled();
    expect(getCompilationHooks).toHaveBeenCalled();
    expect(beforeEmitTap).toHaveBeenCalled();

    const hook = beforeEmitTap.mock.calls[0][1];
    expect(hook({
      html: '<html />',
      plugin: {
        options: {
          title: 'Home',
        },
      },
    })).toEqual({
      html: '<html />::Home',
      plugin: {
        options: {
          title: 'Home',
        },
      },
    });
  });
});
