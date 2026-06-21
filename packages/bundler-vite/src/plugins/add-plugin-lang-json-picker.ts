import type { Plugin } from 'vite';
import type { AddFunc } from '@/cfg/types';
import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { pick } from '@dz-web/esboot-common/lodash';

export const addLangJsonPicker: AddFunc = async (cfg, viteCfg) => {
  const { useLangJsonPicker, rootPath, entry } = cfg.config;

  if (!useLangJsonPicker)
    return;

  const langFolder = resolve(rootPath, 'lang');
  let languages: string[] = ['zh-CN', 'zh-TW', 'en-US'];
  try {
    const files = await fs.readdir(langFolder);
    languages = files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (err) {
    // fallback to defaults if folder is missing
  }

  const entryLangMapping = new Map<string, string[]>();

  // Create mapping of entries to their langJsonPicker configs
  for (const [entryName, entryConfig] of Object.entries(entry)) {
    if (entryConfig.langJsonPicker) {
      entryLangMapping.set(entryName, entryConfig.langJsonPicker);
    }
  }

  if (entryLangMapping.size === 0) {
    console.log('[lang-json-picker] No entries with langJsonPicker found');
    return;
  }

  // Prepare virtual modules for each entry-language combination
  const virtualLangModules = new Map<string, { language: string; entryName: string; langKeys: string[] }>();
  for (const [entryName, langKeys] of entryLangMapping) {
    for (const language of languages) {
      const virtualId = `lang-${language}-${entryName}`;
      virtualLangModules.set(virtualId, { language, entryName, langKeys });
    }
  }

  const langJsonPickerPlugin: Plugin = {
    name: 'vite-plugin-lang-json-picker',
    resolveId(id) {
      if (id.startsWith('lang-')) {
        return id;
      }
      return null;
    },
    async load(id) {
      if (id.startsWith('lang-')) {
        const info = virtualLangModules.get(id);
        if (!info) return null;
        const raw = await fs.readFile(resolve(langFolder, `${info.language}.json`), 'utf-8');
        const content = JSON.parse(raw);
        const filtered = pick(content, info.langKeys);
        return `export default ${JSON.stringify(filtered)};`;
      }
      return null;
    },
    transformIndexHtml(html, ctx) {
      const htmlPath = ctx?.path || '';
      const match = htmlPath.match(/\/([^/]+?)\.html/);
      const entryName = match ? match[1] : '';
      if (entryName) {
        return html.replace('<head>', `<head><script>window.__ESBOOT_ENTRY_NAME__ = "${entryName}";</script>`);
      }
      return html;
    },
    async transform(code: string, id: string) {
      const normalizedId = id.replace(/\\/g, '/');
      if (normalizedId.endsWith('helpers/import-locales.ts') || normalizedId.endsWith('helpers/import-locales.js')) {
        const langMapEntries = Array.from(virtualLangModules.entries()).map(([virtualId, info]) => {
          return `'${info.language}-${info.entryName}': () => import('${virtualId}')`;
        });
        
        for (const lang of languages) {
          langMapEntries.push(`'${lang}-fallback': () => import('@/lang/${lang}.json')`);
        }

        const langMapStr = `
const __langMap = {
  ${langMapEntries.join(',\n  ')}
};
`;

        const switchRegex = /switch\s*\(\s*currentLanguage\s*\)\s*\{[\s\S]+?\}/;
        const replacement = `
          const entryName = (typeof window !== 'undefined' && window['__ESBOOT_ENTRY_NAME__']) || '';
          const langKey = \`\${currentLanguage}-\${entryName}\`;
          const loadLang = __langMap[langKey] || __langMap[\`\${currentLanguage}-fallback\`];
          if (loadLang) {
            langData = await loadLang();
          }
        `;

        let newCode = code.replace(switchRegex, replacement);
        newCode = langMapStr + '\n' + newCode;

        return { code: newCode, map: null };
      }
      return null;
    },
  };

  viteCfg.plugins!.push(langJsonPickerPlugin);
};
