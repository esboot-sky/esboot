import { describe, expect, it } from 'vitest';

describe('rspack styleName rules', () => {
  it('adds a pre-loader for tsx files when styleName support is enabled', async () => {
    const { addStyleNameRules } = await import('./add-rules-style-name');
    const rspackCfg = {
      module: {
        rules: [] as unknown[],
      },
    };

    await addStyleNameRules({
      config: {
        css: {
          modules: {},
        },
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.module.rules).toHaveLength(1);
    expect((rspackCfg.module.rules[0] as any)).toMatchObject({
      test: /\.tsx?$/,
      enforce: 'pre',
      type: 'javascript/auto',
    });
    expect((rspackCfg.module.rules[0] as any).loader).toContain('style-name-loader');
  });

  it('skips the pre-loader when styleName support is disabled', async () => {
    const { addStyleNameRules } = await import('./add-rules-style-name');
    const rspackCfg = {
      module: {
        rules: [] as unknown[],
      },
    };

    await addStyleNameRules({
      config: {
        css: {
          modules: {
            useStyleName: false,
          },
        },
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.module.rules).toHaveLength(0);
  });
});
