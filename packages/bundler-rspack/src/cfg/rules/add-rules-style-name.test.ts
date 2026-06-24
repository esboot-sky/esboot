import { describe, expect, it } from 'vitest';

describe('rspack styleName rules', () => {
  it('adds a pre-loader for tsx files only when styleName support is enabled', async () => {
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
    const rule = rspackCfg.module.rules[0] as any;

    expect(rule.enforce).toBe('pre');
    expect(rule.type).toBe('javascript/auto');
    expect(rule.loader).toContain('style-name-loader');
    expect(rule.test.test('/repo/src/app.tsx')).toBe(true);
    expect(rule.test.test('/repo/src/utils.ts')).toBe(false);
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
