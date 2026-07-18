import type { EnvProvider } from '@dz-web/esboot-common/environment';
import {
  createRecordEnvProvider,
  setShellEnvProvider,
} from '@dz-web/esboot-common/environment';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  cfgState,
  cfgLoad,
  processPrepare,
  loadEnv,
  createVitestViteConfig,
  viteGetCfg,
} = vi.hoisted(() => {
  const cfgState = {
    config: {} as Record<string, any>,
  };

  return {
    cfgState,
    cfgLoad: vi.fn(),
    processPrepare: vi.fn(),
    loadEnv: vi.fn(),
    createVitestViteConfig: vi.fn(),
    viteGetCfg: vi.fn(),
  };
});

vi.mock('@dz-web/esboot', () => ({
  cfg: {
    get config() {
      return cfgState.config;
    },
    load: cfgLoad,
  },
  processPrepare,
}));

vi.mock('@dz-web/esboot-common/cfg', () => ({
  loadEnv,
}));

vi.mock('./create-vitest-vite-config', () => ({
  createVitestViteConfig,
  createVitestTestConfig: vi.fn(() => ({
    test: {
      environment: 'jsdom',
    },
  })),
}));

vi.mock('../dist/options.js', () => ({
  getPluginVitestOptions: vi.fn((plugins: any[]) => plugins.find(
    plugin => plugin?.name === 'plugin-vitest',
  )?.__esbootPluginVitestOptions || {}),
}));

vi.mock('@dz-web/esboot-bundler-vite', () => ({
  getCfg: viteGetCfg,
}));

describe('plugin vitest config', () => {
  const originalVitestEnv = process.env.VITEST;
  let previousProvider: EnvProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    cfgState.config = {};
    process.env.VITEST = 'false';
    previousProvider = setShellEnvProvider(createRecordEnvProvider({
      VITEST: 'true',
    }));

    createVitestViteConfig.mockResolvedValue({
      resolve: {
        alias: {
          existing: '/existing',
        },
      },
      test: {
        environment: 'jsdom',
      },
    });
  });

  afterEach(() => {
    setShellEnvProvider(previousProvider);
    if (originalVitestEnv === undefined)
      delete process.env.VITEST;
    else
      process.env.VITEST = originalVitestEnv;
  });

  it('delegates to the standalone vitest builder for non-vite bundlers', async () => {
    cfgState.config = {
      bundler: class BundlerWebpack {},
      plugins: [
        {
          name: 'plugin-vitest',
          __esbootPluginVitestOptions: {
            customConfig: vi.fn(),
          },
        },
      ],
    };

    const vitestConfigFactory = (await import('./vitest.config')).default;

    const result = await vitestConfigFactory();

    expect(processPrepare).toHaveBeenCalled();
    expect(loadEnv).toHaveBeenCalledWith({ root: process.cwd() });
    expect(cfgLoad).toHaveBeenCalledWith({ cwd: process.cwd() });
    expect(createVitestViteConfig).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        customConfig: expect.any(Function),
      }),
    );
    expect(viteGetCfg).not.toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({
      resolve: {
        alias: {
          existing: '/existing',
        },
      },
      test: expect.objectContaining({
        environment: 'jsdom',
      }),
    }));
  });

  it('reuses vite bundler config when the current project uses BundlerVite', async () => {
    viteGetCfg.mockResolvedValue({
      resolve: {
        alias: {
          existing: '/existing',
        },
      },
    });
    const customConfig = vi.fn(async (config: Record<string, unknown>) => ({
      ...config,
      fromPluginOption: true,
    }));

    cfgState.config = {
      bundler: class BundlerVite {},
      plugins: [
        {
          name: 'plugin-vitest',
          __esbootPluginVitestOptions: {
            customConfig,
          },
        },
      ],
    };

    const vitestConfigFactory = (await import('./vitest.config')).default;
    const result = await vitestConfigFactory();

    expect(viteGetCfg).toHaveBeenCalledWith(expect.any(Object), 'test');
    expect(createVitestViteConfig).not.toHaveBeenCalled();
    expect(customConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        resolve: {
          alias: {
            existing: '/existing',
          },
        },
        test: {
          environment: 'jsdom',
        },
      }),
      expect.any(Object),
    );
    expect(result).toEqual(expect.objectContaining({
      fromPluginOption: true,
    }));
  });

  it('falls back to the standalone vitest vite config when vite bundler config generation fails on duplicate chunk names', async () => {
    const duplicateChunkError = new Error('Duplicate entry chunkName "index"');
    viteGetCfg.mockRejectedValue(duplicateChunkError);
    createVitestViteConfig.mockResolvedValue({
      resolve: {
        alias: {
          standalone: '/standalone',
        },
      },
      test: {
        environment: 'jsdom',
      },
    });

    cfgState.config = {
      bundler: class BundlerVite {},
      plugins: [
        {
          name: 'plugin-vitest',
          __esbootPluginVitestOptions: {},
        },
      ],
    };

    const vitestConfigFactory = (await import('./vitest.config')).default;
    const result = await vitestConfigFactory();

    expect(viteGetCfg).toHaveBeenCalledWith(expect.any(Object), 'test');
    expect(createVitestViteConfig).toHaveBeenCalledWith(expect.any(Object), {});
    expect(result).toEqual(expect.objectContaining({
      resolve: {
        alias: {
          standalone: '/standalone',
        },
      },
    }));
  });
});
