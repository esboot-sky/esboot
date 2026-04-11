import { describe, expect, it } from 'vitest';

describe('webpack addResolve partial', () => {
  it('resolves aliases from process cwd and preserves mainFields/extensions', async () => {
    const { addResolve } = await import('./add-resolve');
    const webpackCfg: Record<string, any> = {};

    await addResolve({
      config: {
        alias: {
          '@': 'src',
          '@shared': 'shared',
        },
      },
    } as any, webpackCfg);

    expect(webpackCfg.resolve.alias['@']).toContain('/src/');
    expect(webpackCfg.resolve.alias['@shared']).toContain('/shared/');
    expect(webpackCfg.resolve.mainFields).toEqual(['module', 'browser', 'main']);
    expect(webpackCfg.resolve.extensions).toContain('.tsx');
  });
});
