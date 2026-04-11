import { describe, expect, it, vi } from 'vitest';

vi.mock('@dz-web/esboot-common/helpers', () => ({
  resolvePathFromUrl: vi.fn(() => '/resolved/@svgr/webpack'),
}));

describe('webpack cfg rules', () => {
  it('adds json lang picker rules and enables layers when requested', async () => {
    const { addJSONRules } = await import('./add-rules-json');
    const webpackCfg = {
      module: {
        rules: [] as unknown[],
      },
      experiments: {},
    };

    await addJSONRules({
      config: {
        entry: {
          home: {
            chunkName: 'home',
          },
        },
      },
    } as any, webpackCfg as any, { enableLangJsonPicker: true } as any);

    expect(webpackCfg.experiments.layers).toBe(true);
    expect(webpackCfg.module.rules).toHaveLength(1);
    expect((webpackCfg.module.rules[0] as any).oneOf[0].issuerLayer).toBe('home');
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
