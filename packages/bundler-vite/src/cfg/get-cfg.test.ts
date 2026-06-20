import { beforeEach, describe, expect, it, vi } from 'vitest';

const react = vi.fn(() => ({ name: 'react' }));
const addDefine = vi.fn(() => ({ __DEV__: true }));
const addPostcssPluginESBoot = vi.fn(() => 'postcss-esboot');
const addPostcssPluginTailwindcss = vi.fn(() => 'postcss-tailwind');
const addPostcssPluginPx2rem = vi.fn(() => 'postcss-px2rem');
const addReactCompiler = vi.fn(() => 'react-compiler');
const resolveViteFrameworkPlugins = vi.fn(async (
  options?: {
    frameworkProvider?: {
      getPlugins: (context: { target: 'vite' | 'vitest'; isDev: boolean }) => unknown[];
    };
  },
  context?: { target: 'vite' | 'vitest'; isDev: boolean },
) => options?.frameworkProvider?.getPlugins(context!));
const addEntry = vi.fn();
const addDevServer = vi.fn();
const addResolve = vi.fn();
const addSvgrPlugin = vi.fn();
const addCopyPlugin = vi.fn();
const addLangJsonPicker = vi.fn();
const addStyle = vi.fn();
const addBuildCfg = vi.fn();

vi.mock('@vitejs/plugin-react', () => ({
  default: react,
}));

vi.mock('@dz-web/esboot-bundler-common', () => ({
  addDefine,
  addPostcssPluginESBoot,
  addPostcssPluginTailwindcss,
  addPostcssPluginPx2rem,
  addReactCompiler,
  resolveViteFrameworkPlugins,
}));

vi.mock('../plugins/add-plugin-copy', () => ({
  addCopyPlugin,
}));

vi.mock('../plugins/add-plugin-lang-json-picker', () => ({
  addLangJsonPicker,
}));

vi.mock('../plugins/add-plugin-svgr', () => ({
  addSvgrPlugin,
}));

vi.mock('./build/add-build-cfg', () => ({
  addBuildCfg,
}));

vi.mock('./partials/add-dev-server', () => ({
  addDevServer,
}));

vi.mock('./partials/add-entry', () => ({
  addEntry,
}));

vi.mock('./partials/add-resolve', () => ({
  addResolve,
}));

vi.mock('./partials/add-style', () => ({
  addStyle,
}));

describe('getCfg tailwind integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses the postcss Tailwind plugin for next and skips the Vite Tailwind plugin', async () => {
    const { getCfg } = await import('./get-cfg');

    const cfg = await getCfg({
      config: {
        cwd: '/repo/app',
        publicPath: '/',
        sourceMap: false,
        isDev: true,
        css: {
          tailwind: {
            enable: true,
            version: 'next',
            separateImports: false,
          },
        },
      },
    } as any, 'development');

    expect(cfg.plugins).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          name: '@tailwindcss/vite',
        }),
      ]),
    );
    expect(cfg.css?.postcss?.plugins).toEqual(
      expect.arrayContaining([
        'postcss-esboot',
        'postcss-tailwind',
        'postcss-px2rem',
      ]),
    );
  });

  it('keeps the postcss tailwind plugin for version 3', async () => {
    const { getCfg } = await import('./get-cfg');

    const cfg = await getCfg({
      config: {
        cwd: '/repo/app',
        publicPath: '/',
        sourceMap: false,
        isDev: true,
        css: {
          tailwind: {
            enable: true,
            version: '3',
            separateImports: false,
          },
        },
      },
    } as any, 'development');

    expect(cfg.css?.postcss?.plugins).toEqual(
      expect.arrayContaining([
        'postcss-esboot',
        'postcss-tailwind',
        'postcss-px2rem',
      ]),
    );
  });

  it('uses a configured framework provider instead of the default react plugin', async () => {
    const { getCfg } = await import('./get-cfg');
    const getPlugins = vi.fn(() => [{ name: 'vue' }, { name: 'vue-devtools' }, { name: 'vue-jsx' }]);

    const cfg = await getCfg({
      config: {
        cwd: '/repo/app',
        publicPath: '/',
        sourceMap: false,
        isDev: true,
        bundlerOptions: {
          frameworkProvider: {
            getPlugins,
          },
        },
        css: {
          tailwind: {
            enable: true,
            version: 'next',
            separateImports: false,
          },
        },
      },
    } as any, 'development');

    expect(react).not.toHaveBeenCalled();
    expect(getPlugins).toHaveBeenCalledWith({
      target: 'vite',
      isDev: true,
    });
    expect(cfg.plugins).toEqual(expect.arrayContaining([
      { name: 'vue' },
      { name: 'vue-devtools' },
      { name: 'vue-jsx' },
    ]));
  });
});
