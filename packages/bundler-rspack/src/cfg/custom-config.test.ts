import { describe, expect, it } from 'vitest';

describe('rspack customConfig helper', () => {
  it('applies the returned custom rspack config onto the current config object', async () => {
    const { customConfig } = await import('./custom-config');
    const rspackCfg = {
      mode: 'production',
      plugins: [],
    };

    await customConfig({
      config: {
        bundlerOptions: {
          customConfig: (current: Record<string, unknown>) => ({
            ...current,
            devtool: 'source-map',
            plugins: ['custom-plugin'],
          }),
        },
      },
    } as any, rspackCfg as any);

    expect(rspackCfg).toMatchObject({
      mode: 'production',
      devtool: 'source-map',
      plugins: ['custom-plugin'],
    });
  });
});
