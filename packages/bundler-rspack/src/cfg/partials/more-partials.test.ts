import { describe, expect, it } from 'vitest';

describe('rspack more partials', () => {
  it('enables runtime optimization cache settings for production builds', async () => {
    const { addCache } = await import('./add-cache');
    const rspackCfg: Record<string, any> = {};

    await addCache({
      config: {
        isDev: false,
        isCIBuild: false,
      },
    } as any, rspackCfg);

    expect(rspackCfg.optimization).toEqual({
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
    });
  });

  it('assigns externals when provided', async () => {
    const { addExternals } = await import('./add-externals');
    const rspackCfg: Record<string, any> = {};

    await addExternals({
      config: {
        externals: {
          react: 'React',
        },
      },
    } as any, rspackCfg);

    expect(rspackCfg.externals).toEqual({ react: 'React' });
  });
});
