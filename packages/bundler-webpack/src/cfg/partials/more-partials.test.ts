import { describe, expect, it } from 'vitest';

describe('webpack more partials', () => {
  it('enables filesystem cache in development to speed up repeated startups', async () => {
    const { addCache } = await import('./add-cache');
    const webpackCfg: Record<string, any> = {};

    await addCache({
      config: {
        cwd: '/repo/app',
        isDev: true,
        isCIBuild: false,
        bundlerOptions: {},
      },
    } as any, webpackCfg);

    expect(webpackCfg.optimization).toEqual({
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
    });
    expect(webpackCfg.cache.type).toBe('filesystem');
  });

  it('enables filesystem cache for prod builds outside CI or when build cache is enabled', async () => {
    const { addCache } = await import('./add-cache');
    const webpackCfg: Record<string, any> = {};

    await addCache({
      config: {
        cwd: '/repo/app',
        isDev: false,
        isCIBuild: false,
        bundlerOptions: {},
      },
    } as any, webpackCfg);

    expect(webpackCfg.optimization).toEqual({
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
    });
    expect(webpackCfg.cache.type).toBe('filesystem');
    expect(webpackCfg.cache.buildDependencies.config).toEqual([
      '/repo/app/.esbootrc.ts',
      '/repo/app/pnpm-lock.yaml',
      '/repo/app/package.json',
    ]);
  });

  it('assigns externals when provided', async () => {
    const { addExternals } = await import('./add-externals');
    const webpackCfg: Record<string, any> = {};

    await addExternals({
      config: {
        externals: {
          react: 'React',
        },
      },
    } as any, webpackCfg);

    expect(webpackCfg.externals).toEqual({ react: 'React' });
  });
});
