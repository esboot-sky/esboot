import { describe, expect, it, vi } from 'vitest';

vi.mock('@dz-web/esboot-common/helpers', () => ({
  createResolvePath: () => (name: string) => `/resolved/${name}`,
}));

describe('rspack cfg rules', () => {
  it('adds json lang picker rules, aliases, and dynamic loaders when enabled', async () => {
    const { addJSONRules } = await import('./add-rules-json');
    const rspackCfg: any = {
      module: {
        rules: [] as unknown[],
      },
      resolve: {
        alias: {},
      },
    };

    await addJSONRules({
      config: {
        useLangJsonPicker: true,
        rootPath: '/repo/app',
        entry: {
          home: {
            chunkName: 'home',
            langJsonPicker: ['home.title'],
          },
        },
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.resolve.alias['lang-zh-CN-home']).toBeDefined();
    expect(rspackCfg.resolve.alias['lang-zh-CN-home']).toContain('placeholder.json?lang=zh-CN&entry=home');
    expect(rspackCfg.module.rules).toHaveLength(3); // placeholder.json rule, direct json rule, and import-locales rule
    expect((rspackCfg.module.rules[2] as any).enforce).toBe('pre');
  });

  it('adds svgr and asset rules when svgr is enabled', async () => {
    const { addAssetRules } = await import('./add-rules-assets');
    const rspackCfg = {
      module: {
        rules: [] as unknown[],
      },
    };

    await addAssetRules({
      config: {
        svgr: true,
        svgrOptions: { memo: true },
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.module.rules).toHaveLength(3);
    expect((rspackCfg.module.rules[0] as any).parser.dataUrlCondition.maxSize).toBe(8192);
    expect((rspackCfg.module.rules[2] as any).use[0].loader).toBe('/resolved/@svgr/webpack');
    expect((rspackCfg.module.rules[2] as any).use[0].options.icon).toBe(false);
  });
});
