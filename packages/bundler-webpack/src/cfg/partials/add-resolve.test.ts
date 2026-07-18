import { describe, expect, it } from 'vitest';

describe('webpack addResolve partial', () => {
  it('resolves aliases from configured cwd and preserves mainFields/extensions', async () => {
    const { addResolve } = await import('./add-resolve');
    const webpackCfg: Record<string, any> = {};

    await addResolve({
      config: {
        cwd: '/repo/app',
        alias: {
          '@': 'src',
          '@shared': 'shared',
        },
      },
    } as any, webpackCfg);

    expect(webpackCfg.resolve.alias).toEqual({
      '@': '/repo/app/src/',
      '@shared': '/repo/app/shared/',
    });
    expect(webpackCfg.resolve.mainFields).toEqual(['module', 'browser', 'main']);
    expect(webpackCfg.resolve.extensions).toContain('.tsx');
  });
});
