import { describe, expect, it } from 'vitest';

describe('rspack cfg partials', () => {
  it('uses source-map when sourceMap is enabled', async () => {
    const { addDevtool } = await import('./add-devtool');
    const rspackCfg: Record<string, unknown> = {};

    await addDevtool({ config: { isDev: true, sourceMap: true } } as any, rspackCfg as any);

    expect(rspackCfg.devtool).toBe('source-map');
  });

  it('writes output config with plain filenames in development', async () => {
    const { addOutput } = await import('./add-output');
    const rspackCfg: Record<string, any> = {};

    await addOutput({
      config: {
        cwd: '/repo/app',
        isDev: true,
        publicPath: '/',
        outputPath: 'dist',
      },
    } as any, rspackCfg);

    expect(rspackCfg.output).toEqual({
      publicPath: '/',
      clean: false,
      path: '/repo/app/dist',
      filename: 'js/[name].js',
    });
  });

  it('adds dev-only logging overrides only in development', async () => {
    const { addOnlyDev } = await import('./add-only-dev');
    const rspackCfg: Record<string, unknown> = {};

    await addOnlyDev({ config: { isDev: true } } as any, rspackCfg as any);

    expect(rspackCfg).toMatchObject({
      stats: 'errors-only',
      infrastructureLogging: {
        level: 'error',
      },
    });
  });

  it('resolves aliases from process cwd', async () => {
    const { addResolve } = await import('./add-resolve');
    const rspackCfg: Record<string, any> = {};

    await addResolve({
      config: {
        alias: {
          '@': 'src',
          '@shared': 'shared',
        },
      },
    } as any, rspackCfg);

    expect(rspackCfg.resolve.alias['@']).toContain('/src/');
    expect(rspackCfg.resolve.alias['@shared']).toContain('/shared/');
    expect(rspackCfg.resolve.extensions).toContain('.tsx');
  });
});
