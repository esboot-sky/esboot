import { describe, expect, it } from 'vitest';

import { addCache } from './add-cache';

describe('addCache', () => {
  it('resolves the filesystem cache from the configured cwd', async () => {
    const webpackConfig: Record<string, any> = {};

    await addCache({
      config: {
        cwd: '/repo/app',
        isDev: true,
        isCIBuild: false,
        bundlerOptions: {},
      },
    } as any, webpackConfig as any);

    expect(webpackConfig.cache).toEqual(expect.objectContaining({
      type: 'filesystem',
      cacheDirectory: '/repo/app/node_modules/.cache/esboot/webpack-cache',
    }));
    expect(webpackConfig.cache.buildDependencies.config).toEqual([
      '/repo/app/.esbootrc.ts',
      '/repo/app/pnpm-lock.yaml',
      '/repo/app/package.json',
    ]);
  });
});
