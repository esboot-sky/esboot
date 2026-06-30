import type { ConfigurationInstance } from '@dz-web/esboot';
import { normalizeExclude } from './add-plugin-px2rem';

export function addPostcssPluginFontZoom(cfg: ConfigurationInstance): any | false {
  const fontZoom = cfg.config.css?.fontZoom;
  if (!fontZoom || !fontZoom.enable) {
    return false;
  }

  const offsetVar = fontZoom.offsetVar || '--font-offset';
  const zoomLineHeight = fontZoom.zoomLineHeight || false;
  const minPixelValue = fontZoom.minPixelValue || 0;
  const exclude = normalizeExclude(fontZoom.exclude);

  return {
    postcssPlugin: 'postcss-font-zoom',
    Declaration(decl: any) {
      if (decl.prop === 'font-size' || (zoomLineHeight && decl.prop === 'line-height')) {
        const val = decl.value;
        if (val.includes(offsetVar)) return;

        // Check exclude
        if (exclude && decl.source?.input?.file) {
          const filePath = decl.source.input.file;
          if (exclude instanceof RegExp && exclude.test(filePath)) return;
          if (typeof exclude === 'string' && filePath.includes(exclude)) return;
        }

        // 1. var(--...)
        if (val.includes('var(')) {
          decl.value = `calc(${val} + var(${offsetVar}, 0px))`;
        }
        // 2. px
        else if (val.includes('px')) {
          decl.value = val.replace(/(\d*\.?\d+)px/g, (match: string, p1: string) => {
            const num = parseFloat(p1);
            if (num < minPixelValue) return match;
            return `calc(${p1}px + var(${offsetVar}, 0px))`;
          });
        }
        // 3. rem/em
        else if (val.includes('rem') || val.includes('em')) {
          decl.value = val.replace(/(\d*\.?\d+)(r?em)/g, (match: string, p1: string, p2: string) => {
            const num = parseFloat(p1);
            const approxPx = num * 16; // Assume 1rem/em = 16px base for check
            if (approxPx < minPixelValue) return match;
            return `calc(${p1}${p2} + var(${offsetVar}, 0px))`;
          });
        }
      }
    },
  };
}
