import { describe, expect, it } from 'vitest';

describe('webpack customConfig helper', () => {
  it('applies the returned custom webpack config onto the current config object', async () => {
    const { customConfig } = await import('./custom-config');
    const webpackCfg = {
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
    } as any, webpackCfg as any);

    expect(webpackCfg).toMatchObject({
      mode: 'production',
      devtool: 'source-map',
      plugins: ['custom-plugin'],
    });
  });
});
