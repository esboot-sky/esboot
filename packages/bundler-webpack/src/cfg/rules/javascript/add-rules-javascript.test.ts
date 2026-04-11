import { describe, expect, it, vi } from 'vitest';

vi.mock('./babelrc.config', () => ({
  env: {},
  presets: ['preset-a'],
  getPlugins: vi.fn(() => ['plugin-a']),
}));

describe('webpack javascript rules', () => {
  it('enables babel loader cache in development for ts and extra js transforms', async () => {
    const { addJavaScriptRules } = await import('./add-rules-javascript');
    const webpackCfg = {
      module: { rules: [] as any[] },
    };

    await addJavaScriptRules({
      config: {
        rootPath: '/repo/app/src',
        isDev: true,
        alias: {},
        legacy: false,
        cwd: '/repo/app',
        bundlerOptions: {
          extraBabelIncludes: ['/repo/external-lib'],
        },
      },
    } as any, webpackCfg as any, { mfsu: null } as any);

    expect(webpackCfg.module.rules).toHaveLength(2);
    expect(webpackCfg.module.rules[0].use[0]).toMatchObject({
      options: expect.objectContaining({
        cacheDirectory: true,
      }),
    });
    expect(webpackCfg.module.rules[1].use[0]).toMatchObject({
      options: expect.objectContaining({
        cacheDirectory: true,
      }),
    });
  });

  it('skips thread-loader in development to reduce cold-start overhead', async () => {
    const { addJavaScriptRules } = await import('./add-rules-javascript');
    const webpackCfg = {
      module: { rules: [] as any[] },
    };

    await addJavaScriptRules({
      config: {
        rootPath: '/repo/app/src',
        isDev: true,
        alias: {},
        legacy: false,
        cwd: '/repo/app',
        bundlerOptions: {},
      },
    } as any, webpackCfg as any, { mfsu: null } as any);

    expect(webpackCfg.module.rules[0].use.some((item: any) => item.loader.includes('thread-loader'))).toBe(false);
    expect(webpackCfg.module.rules[1].use.some((item: any) => item.loader.includes('thread-loader'))).toBe(false);
  });
});
