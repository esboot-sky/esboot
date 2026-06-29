import { beforeEach, describe, expect, it, vi } from 'vitest';

  react,
  vitePluginSvgr,
  addPostcssPluginESBoot,
  addPostcssPluginTailwindcss,
  addPostcssPluginPx2rem,
  addPostcssPluginFontZoom,
  addReactCompiler,
  resolveViteFrameworkPlugins,
  shouldUseReactStyleNamePlugin,
} = vi.hoisted(() => ({
  react: vi.fn(() => 'react-plugin'),
  vitePluginSvgr: vi.fn(() => 'svgr-plugin'),
  addPostcssPluginESBoot: vi.fn(async () => 'postcss-esboot'),
  addPostcssPluginTailwindcss: vi.fn(async () => 'postcss-tailwind'),
  addPostcssPluginPx2rem: vi.fn(async () => 'postcss-px2rem'),
  addPostcssPluginFontZoom: vi.fn(async (cfg: any) => cfg.config.css?.fontZoom?.enable ? 'postcss-font-zoom' : false),
  addReactCompiler: vi.fn(() => 'react-compiler'),
  resolveViteFrameworkPlugins: vi.fn(async (
    options?: {
      frameworkProvider?: {
        getPlugins: (context: { target: 'vite' | 'vitest'; isDev: boolean }) => unknown[];
      };
    },
    context?: { target: 'vite' | 'vitest'; isDev: boolean },
  ) => options?.frameworkProvider?.getPlugins(context!)),
  shouldUseReactStyleNamePlugin: vi.fn((options?: {
    frameworkProvider?: {
      useReactStyleNamePlugin?: boolean;
    };
  }) => options?.frameworkProvider?.useReactStyleNamePlugin !== false),
}));

vi.mock('@vitejs/plugin-react', () => ({
  default: react,
}));

vi.mock('vite-plugin-svgr', () => ({
  default: vitePluginSvgr,
}));

vi.mock('../dist/alias.js', () => ({
  alias: {
    'vitest': '/mocked/vitest',
    '@testing-library/react': '/mocked/testing-library-react',
    '@testing-library/user-event': '/mocked/testing-library-user-event',
  },
}));

vi.mock('@dz-web/esboot-bundler-common', () => ({
  addDefine: (cfg: any) => cfg.config.define,
  addPostcssPluginESBoot,
  addPostcssPluginTailwindcss,
  addPostcssPluginPx2rem,
  addPostcssPluginFontZoom,
  addReactCompiler,
  resolveViteFrameworkPlugins,
  shouldUseReactStyleNamePlugin,
  reactStyleNamePlugin: vi.fn(() => ['style-name-plugin']),
}));

describe('createVitestViteConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not execute bundlerOptions.customConfig for non-vitest config generation', async () => {
    const customConfig = vi.fn(() => {
      throw new Error('bundler customConfig must not run');
    });
    const vitestCustomConfig = vi.fn((config: Record<string, any>) => ({
      ...config,
      customApplied: true,
    }));

    const { createVitestViteConfig } = await import('./create-vitest-vite-config');
    const result = await createVitestViteConfig({
      config: {
        cwd: '/repo/app',
        publicPath: '/',
        sourceMap: false,
        isDev: false,
        rootPath: '/repo/app/src',
        isSP: true,
        alias: {
          '@': 'src',
        },
        define: {
          __DEV__: false,
        },
        css: {
          modules: {
            useStyleName: true,
            localsConvention: 'asIs',
          },
        },
        svgr: true,
        svgrOptions: {},
        bundlerOptions: {
          customConfig,
        },
      },
    } as any, {
      customConfig: vitestCustomConfig,
    });

    expect(customConfig).not.toHaveBeenCalled();
    expect(vitestCustomConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        plugins: expect.arrayContaining(['react-plugin', 'style-name-plugin', 'svgr-plugin']),
      }),
      expect.objectContaining({
        bundlerOptions: {
          customConfig,
        },
      }),
    );
    expect(result).toEqual(expect.objectContaining({
      customApplied: true,
      resolve: {
        alias: expect.objectContaining({
          '@': '/repo/app/src/',
        }),
      },
    }));
  });

  it('builds a standalone vite test config with default setup file and vitest aliases', async () => {
    const { createVitestViteConfig } = await import('./create-vitest-vite-config');
    const result = await createVitestViteConfig({
      config: {
        cwd: '/repo/app',
        publicPath: '/',
        sourceMap: false,
        isDev: true,
        rootPath: '/repo/app/src',
        isSP: true,
        alias: {
          '@': 'src',
        },
        define: {
          __DEV__: true,
        },
        css: {
          modules: {
            useStyleName: false,
            localsConvention: 'asIs',
          },
        },
        svgr: true,
        svgrOptions: {},
      },
    } as any);

    expect(react).toHaveBeenCalled();
    expect(addPostcssPluginESBoot).toHaveBeenCalled();
    expect(addPostcssPluginTailwindcss).toHaveBeenCalled();
    expect(addPostcssPluginPx2rem).toHaveBeenCalled();
    expect(vitePluginSvgr).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({
      mode: 'test',
      configFile: false,
      publicDir: false,
      resolve: {
        alias: expect.objectContaining({
          '@': '/repo/app/src/',
          'vitest': expect.any(String),
          '@testing-library/react': expect.any(String),
          '@testing-library/user-event': expect.any(String),
        }),
      },
      test: expect.objectContaining({
        environment: 'jsdom',
        setupFiles: [expect.stringContaining('/packages/plugin-vitest/config/setup.ts')],
      }),
    }));
  });

  it('uses a configured framework provider instead of the default react plugin', async () => {
    const { createVitestViteConfig } = await import('./create-vitest-vite-config');
    const getPlugins = vi.fn(() => ['vue-plugin', 'vue-jsx-plugin']);
    const result = await createVitestViteConfig({
      config: {
        cwd: '/repo/app',
        publicPath: '/',
        sourceMap: false,
        isDev: true,
        rootPath: '/repo/app/src',
        isSP: true,
        alias: {
          '@': 'src',
        },
        bundlerOptions: {
          frameworkProvider: {
            getPlugins,
            useReactStyleNamePlugin: false,
          },
        },
        define: {
          __DEV__: true,
        },
        css: {
          modules: {
            useStyleName: false,
            localsConvention: 'asIs',
          },
        },
        svgr: false,
        svgrOptions: {},
      },
    } as any);

    expect(react).not.toHaveBeenCalled();
    expect(getPlugins).toHaveBeenCalledWith({
      target: 'vitest',
      isDev: true,
    });
    expect(result.plugins).toEqual(expect.arrayContaining([
      'vue-plugin',
      'vue-jsx-plugin',
    ]));
    expect(result.plugins).not.toEqual(expect.arrayContaining([
      'style-name-plugin',
    ]));
  });
});
