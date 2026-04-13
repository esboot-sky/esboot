import { beforeEach, describe, expect, it, vi } from 'vitest';

const react = vi.fn(() => ({ name: 'react' }));
const addDefine = vi.fn(() => ({ __DEV__: true }));
const addPostcssPluginESBoot = vi.fn(() => 'postcss-esboot');
const addPostcssPluginTailwindcss = vi.fn(() => 'postcss-tailwind');
const addPostcssPluginPx2rem = vi.fn(() => 'postcss-px2rem');
const addReactCompiler = vi.fn(() => 'react-compiler');
const addEntry = vi.fn();
const addDevServer = vi.fn();
const addResolve = vi.fn();
const addSvgrPlugin = vi.fn();
const addCopyPlugin = vi.fn();
const addLangJsonPicker = vi.fn();
const addStyle = vi.fn();
const addBuildCfg = vi.fn();
const tailwindcssVite = vi.fn(() => ({ name: '@tailwindcss/vite' }));

vi.mock('@vitejs/plugin-react', () => ({
  default: react,
}));

vi.mock('@dz-web/esboot-bundler-common', () => ({
  addDefine,
  addPostcssPluginESBoot,
  addPostcssPluginTailwindcss,
  addPostcssPluginPx2rem,
  addReactCompiler,
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

vi.mock('@tailwindcss/vite', () => ({
  default: tailwindcssVite,
}));

describe('getCfg tailwind integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses the Vite Tailwind plugin for next and skips the postcss tailwind plugin', async () => {
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

    expect(tailwindcssVite).toHaveBeenCalledTimes(1);
    expect(cfg.plugins).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: '@tailwindcss/vite',
        }),
      ]),
    );
    expect(cfg.css?.postcss?.plugins).toEqual(
      expect.arrayContaining([
        'postcss-esboot',
        'postcss-px2rem',
      ]),
    );
    expect(cfg.css?.postcss?.plugins).not.toContain('postcss-tailwind');
  });

  it('keeps the postcss tailwind plugin for version 3 and skips the Vite Tailwind plugin', async () => {
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

    expect(tailwindcssVite).not.toHaveBeenCalled();
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
});
