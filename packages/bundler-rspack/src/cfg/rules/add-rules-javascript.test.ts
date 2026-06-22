import { describe, expect, it } from 'vitest';

describe('rspack javascript rules', () => {
  it('adds the swc loader rule with react automatic runtime settings', async () => {
    const { addJavaScriptRules } = await import('./add-rules-javascript');
    const rspackCfg = {
      module: { rules: [] as unknown[] },
    };

    await addJavaScriptRules({
      config: {
        isDev: true,
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.module.rules).toHaveLength(1);
    expect(rspackCfg.module.rules[0]).toMatchObject({
      loader: 'builtin:swc-loader',
      type: 'javascript/auto',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
          },
          transform: {
            react: {
              runtime: 'automatic',
              development: true,
              refresh: true,
            },
          },
        },
      },
    });
  });

  it('adds an extra swc rule when extraBabelIncludes is defined', async () => {
    const { addJavaScriptRules } = await import('./add-rules-javascript');
    const rspackCfg = {
      module: { rules: [] as unknown[] },
    };

    await addJavaScriptRules({
      config: {
        rootPath: '/repo/app/src',
        isDev: true,
        cwd: '/repo/app',
        bundlerOptions: {
          extraBabelIncludes: ['/repo/external-lib', /another-lib/],
        },
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.module.rules).toHaveLength(2);
    expect(rspackCfg.module.rules[1]).toMatchObject({
      loader: 'builtin:swc-loader',
      type: 'javascript/auto',
      include: ['/repo/external-lib', /another-lib/],
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    });
  });
});
