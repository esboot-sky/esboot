import { describe, expect, it, vi } from 'vitest';

vi.mock('@dz-web/esboot-common/helpers', () => ({
  resolvePathFromUrl: vi.fn(() => '/resolved/@svgr/webpack'),
}));

describe('webpack cfg rules', () => {
  it('adds json lang picker rules, aliases, and dynamic loaders when enabled', async () => {
    const { addJSONRules } = await import('./add-rules-json');
    const webpackCfg: any = {
      module: {
        rules: [] as unknown[],
      },
      resolve: {
        alias: {},
      },
      experiments: {},
    };

    await addJSONRules({
      config: {
        rootPath: '/repo/app',
        entry: {
          home: {
            chunkName: 'home',
            langJsonPicker: ['home.title'],
          },
        },
      },
    } as any, webpackCfg as any, { enableLangJsonPicker: true } as any);

    expect(webpackCfg.experiments.layers).toBeUndefined();
    expect(webpackCfg.resolve.alias['lang-zh-CN-home']).toBeDefined();
    expect(webpackCfg.resolve.alias['lang-zh-CN-home']).toContain('placeholder.json?lang=zh-CN&entry=home');
    expect(webpackCfg.module.rules).toHaveLength(2); // placeholder.json rule and import-locales rule
    expect((webpackCfg.module.rules[1] as any).enforce).toBe('pre');
  });

  it('adds svgr and asset rules when svgr is enabled', async () => {
    const { addAssetRules } = await import('./add-rules-asset');
    const webpackCfg = {
      module: {
        rules: [] as unknown[],
      },
    };

    await addAssetRules({
      config: {
        svgr: true,
        svgrOptions: { memo: true },
        assetsInlineLimit: 4096,
      },
    } as any, webpackCfg as any);

    expect(webpackCfg.module.rules).toHaveLength(3);
    expect((webpackCfg.module.rules[0] as any).parser.dataUrlCondition.maxSize).toBe(4096);
    expect((webpackCfg.module.rules[2] as any).use[0].loader).toBe('/resolved/@svgr/webpack');
    expect((webpackCfg.module.rules[2] as any).use[0].options.memo).toBe(true);
  });
});
