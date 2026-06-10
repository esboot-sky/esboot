import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  react,
  vitePluginSvgr,
  addPostcssPluginESBoot,
  addPostcssPluginTailwindcss,
  addPostcssPluginPx2rem,
  addReactCompiler,
} = vi.hoisted(() => ({
  react: vi.fn(() => 'react-plugin'),
  vitePluginSvgr: vi.fn(() => 'svgr-plugin'),
  addPostcssPluginESBoot: vi.fn(async () => 'postcss-esboot'),
  addPostcssPluginTailwindcss: vi.fn(async () => 'postcss-tailwind'),
  addPostcssPluginPx2rem: vi.fn(async () => 'postcss-px2rem'),
  addReactCompiler: vi.fn(() => 'react-compiler'),
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
  addReactCompiler,
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
});
