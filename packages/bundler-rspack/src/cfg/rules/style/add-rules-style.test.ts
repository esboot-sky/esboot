import { describe, expect, it, vi } from 'vitest';

vi.mock('@dz-web/esboot-common/helpers', () => ({
  createResolvePath: () => (name: string) => `/resolved/${name}`,
}));

vi.mock('@dz-web/esboot-bundler-common', () => ({
  addPostcssPluginESBoot: vi.fn(() => 'postcss-esboot'),
  addPostcssPluginPx2rem: vi.fn(() => 'postcss-px2rem'),
  addPostcssPluginTailwindcss: vi.fn(() => 'postcss-tailwind'),
  addPostcssPluginFontZoom: vi.fn(() => 'postcss-font-zoom'),
}));

vi.mock('@rspack/core', () => ({
  CssExtractRspackPlugin: class MockCssExtractRspackPlugin {
    static loader = '/resolved/css-extract-loader';
  },
}));

function getScssModuleCssLoaderOptions(rspackCfg: Record<string, any>) {
  const scssRule = rspackCfg.module.rules.find((rule: any) => String(rule.test) === String(/\.scss$/));
  const moduleBranch = scssRule.oneOf[0];
  const cssLoader = moduleBranch.use.find((item: any) => item.loader === '/resolved/css-loader');

  return cssLoader.options;
}

describe('rspack style rules', () => {
  it('sets asIs as the default css modules locals convention', async () => {
    const { addStyleRules } = await import('./add-rules-style');
    const rspackCfg = {
      module: { rules: [] as unknown[] },
      plugins: [] as unknown[],
    };

    await addStyleRules({
      config: {
        isDev: true,
        isSP: true,
        rootPath: '/repo/app/src',
        publicPath: '/',
        css: {
          modules: {},
        },
      },
    } as any, rspackCfg as any);

    expect(getScssModuleCssLoaderOptions(rspackCfg).modules.exportLocalsConvention).toBe('asIs');
  });

  it('passes css modules localsConvention to css-loader', async () => {
    const { addStyleRules } = await import('./add-rules-style');
    const rspackCfg = {
      module: { rules: [] as unknown[] },
      plugins: [] as unknown[],
    };

    await addStyleRules({
      config: {
        isDev: true,
        isSP: true,
        rootPath: '/repo/app/src',
        publicPath: '/',
        css: {
          modules: {
            localsConvention: 'camelCase',
          },
        },
      },
    } as any, rspackCfg as any);

    expect(getScssModuleCssLoaderOptions(rspackCfg).modules.exportLocalsConvention).toBe('camelCase');
  });
});
