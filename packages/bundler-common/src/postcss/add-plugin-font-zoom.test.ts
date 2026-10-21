import { describe, expect, it } from 'vitest';
import postcss from 'postcss';
import { addPostcssPluginFontZoom } from './add-plugin-font-zoom';

describe('addPostcssPluginFontZoom', () => {
  it('returns false when disabled', () => {
    const result = addPostcssPluginFontZoom({
      config: {
        css: {
          fontZoom: { enable: false }
        }
      }
    } as any);
    expect(result).toBe(false);
  });

  it('transforms px and rem/em values correctly when enabled', async () => {
    const plugin = addPostcssPluginFontZoom({
      config: {
        css: {
          fontZoom: {
            enable: true,
            offsetVar: '--custom-offset'
          }
        }
      }
    } as any);

    expect(plugin).not.toBe(false);

    const inputCss = `
      .title { font-size: 14px; }
      .text { font-size: 1rem; }
      .btn { font-size: 1.2em; }
      .var-text { font-size: var(--basis-font-size); }
      .important-px { font-size: 14px !important; }
      .important-var { font-size: var(--basis-font-size) !important; }
      .ignore { font-size: calc(14px + var(--custom-offset, 0px)); }
    `;

    const result = await postcss([plugin as any]).process(inputCss, { from: undefined });
    expect(result.css).toContain('.title { font-size: calc(14px + var(--custom-offset, 0px)); }');
    expect(result.css).toContain('.text { font-size: calc(1rem + var(--custom-offset, 0px)); }');
    expect(result.css).toContain('.btn { font-size: calc(1.2em + var(--custom-offset, 0px)); }');
    expect(result.css).toContain('.var-text { font-size: calc(var(--basis-font-size) + var(--custom-offset, 0px)); }');
    expect(result.css).toContain('.important-px { font-size: calc(14px + var(--custom-offset, 0px)) !important; }');
    expect(result.css).toContain('.important-var { font-size: calc(var(--basis-font-size) + var(--custom-offset, 0px)) !important; }');
    expect(result.css).toContain('.ignore { font-size: calc(14px + var(--custom-offset, 0px)); }');
  });

  it('handles zoomLineHeight correctly', async () => {
    const pluginWithLineHeight = addPostcssPluginFontZoom({
      config: {
        css: {
          fontZoom: {
            enable: true,
            zoomLineHeight: true
          }
        }
      }
    } as any);

    const pluginWithoutLineHeight = addPostcssPluginFontZoom({
      config: {
        css: {
          fontZoom: {
            enable: true,
            zoomLineHeight: false
          }
        }
      }
    } as any);

    const inputCss = `
      .title { font-size: 14px; line-height: 20px; }
      .relative { line-height: 1.5; }
    `;

    const resWith = await postcss([pluginWithLineHeight as any]).process(inputCss, { from: undefined });
    expect(resWith.css).toContain('.title { font-size: calc(14px + var(--font-offset, 0px)); line-height: calc(20px + var(--font-offset, 0px)); }');
    expect(resWith.css).toContain('.relative { line-height: 1.5; }');

    const resWithout = await postcss([pluginWithoutLineHeight as any]).process(inputCss, { from: undefined });
    expect(resWithout.css).toContain('.title { font-size: calc(14px + var(--font-offset, 0px)); line-height: 20px; }');
  });

  it('respects minPixelValue threshold', async () => {
    const plugin = addPostcssPluginFontZoom({
      config: {
        css: {
          fontZoom: {
            enable: true,
            minPixelValue: 14
          }
        }
      }
    } as any);

    const inputCss = `
      .small { font-size: 12px; }
      .small-rem { font-size: 0.75rem; }
      .large { font-size: 14px; }
      .large-rem { font-size: 1rem; }
    `;

    const result = await postcss([plugin as any]).process(inputCss, { from: undefined });
    expect(result.css).toContain('.small { font-size: 12px; }');
    expect(result.css).toContain('.small-rem { font-size: 0.75rem; }');
    expect(result.css).toContain('.large { font-size: calc(14px + var(--font-offset, 0px)); }');
    expect(result.css).toContain('.large-rem { font-size: calc(1rem + var(--font-offset, 0px)); }');
  });

  it('respects exclude filters', async () => {
    const plugin = addPostcssPluginFontZoom({
      config: {
        css: {
          fontZoom: {
            enable: true,
            exclude: [/node_modules/, 'custom-skip']
          }
        }
      }
    } as any);

    const inputCss = `.test { font-size: 14px; }`;

    // 1. Should convert in normal file
    const resNormal = await postcss([plugin as any]).process(inputCss, { from: 'src/app.css' });
    expect(resNormal.css).toContain('.test { font-size: calc(14px + var(--font-offset, 0px)); }');

    // 2. Should skip in node_modules
    const resNodeModules = await postcss([plugin as any]).process(inputCss, { from: 'node_modules/antd/index.css' });
    expect(resNodeModules.css).toContain('.test { font-size: 14px; }');

    // 3. Should skip matching string
    const resSkip = await postcss([plugin as any]).process(inputCss, { from: 'src/custom-skip/app.css' });
    expect(resSkip.css).toContain('.test { font-size: 14px; }');
  });
});

describe('font zoom scale mode', () => {
  it.each([undefined, '--custom-offset'])('scales lengths and variables using %s', async (offsetVar) => {
    const plugin = addPostcssPluginFontZoom({
      config: { css: { fontZoom: { enable: true, mode: 'scale', offsetVar, zoomLineHeight: true, minPixelValue: 14 } } },
    } as any);
    const variable = offsetVar || '--font-offset';
    const input = '.a { font-size: 14px !important; line-height: 20px; } .b { font-size: 1rem; } .c { font-size: 1.2em; } .d { font-size: var(--base); } .small { font-size: 12px; } .relative { line-height: 1.5; }';
    const result = await postcss([plugin]).process(input, { from: undefined });
    expect(result.css).toContain(`font-size: calc(14px * var(${variable}, 1)) !important`);
    expect(result.css).toContain(`line-height: calc(20px * var(${variable}, 1))`);
    expect(result.css).toContain(`font-size: calc(1rem * var(${variable}, 1))`);
    expect(result.css).toContain(`font-size: calc(1.2em * var(${variable}, 1))`);
    expect(result.css).toContain(`font-size: calc(var(--base) * var(${variable}, 1))`);
    expect(result.css).toContain('font-size: 12px');
    expect(result.css).toContain('line-height: 1.5');
    const second = await postcss([plugin]).process(result.css, { from: undefined });
    expect(second.css).toBe(result.css);
  });
});
