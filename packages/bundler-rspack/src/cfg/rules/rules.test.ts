import { describe, expect, it, vi } from 'vitest';

vi.mock('@dz-web/esboot-common/helpers', () => ({
  createResolvePath: () => (name: string) => `/resolved/${name}`,
}));

describe('rspack cfg rules', () => {
  it('adds json lang picker rules when enabled in config', async () => {
    const { addJSONRules } = await import('./add-rules-json');
    const rspackCfg = {
      module: {
        rules: [] as unknown[],
      },
    };

    await addJSONRules({
      config: {
        useLangJsonPicker: true,
        entry: {
          home: {
            chunkName: 'home',
          },
        },
      },
    } as any, rspackCfg as any);

    expect(rspackCfg.module.rules).toHaveLength(1);
    expect((rspackCfg.module.rules[0] as any).oneOf[0].issuerLayer).toBe('home');
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
    expect((rspackCfg.module.rules[2] as any).use[0].options.memo).toBe(true);
  });
});
