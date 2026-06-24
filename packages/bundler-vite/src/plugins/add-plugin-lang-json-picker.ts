import type { Plugin } from 'vite';
import type { AddFunc } from '@/cfg/types';
import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { pick } from '@dz-web/esboot-common/lodash';

const BACKSLASH_REGEX = /\\/g;
const JSON_SUFFIX_REGEX = /\.json$/;
const JS_SUFFIX_REGEX = /\.js$/;
const HTML_ENTRY_REGEX = /\/([^/]+?)\.html/;
const LANG_FILE_NAME_REGEX = /\/([^/]+)\.json$/;
const SWITCH_REGEX = /switch\s*\(\s*currentLanguage\s*\)\s*\{[\s\S]+?\}/;

export const addLangJsonPicker: AddFunc = async (cfg, viteCfg) => {
  const { useLangJsonPicker, rootPath, entry } = cfg.config;

  if (!useLangJsonPicker)
    return;

  const langFolder = resolve(rootPath, 'lang');
  const getLanguages = async (): Promise<string[]> => {
    try {
      const files = await fs.readdir(langFolder);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    }
    catch {
      return ['zh-CN', 'zh-TW', 'en-US'];
    }
  };

  const hasLangJsonPicker = Object.values(entry).some(
    entryConfig => entryConfig.langJsonPicker,
  );

  if (!hasLangJsonPicker) {
    console.warn('[lang-json-picker] No entries with langJsonPicker found');
    return;
  }

  const langJsonPickerPlugin: Plugin = {
    name: 'vite-plugin-lang-json-picker',
    enforce: 'pre',
    async resolveId(id, importer) {
      const [baseId] = id.split('?');
      const cleanId = baseId.split('#')[0];

      if (cleanId.startsWith('lang-')) {
        return id;
      }
      if (cleanId.startsWith('virtual:lang-json-picker:')) {
        return id;
      }

      if (cleanId.endsWith('.json') && importer) {
        const resolved = await this.resolve(id, importer, { skipSelf: true });
        if (resolved) {
          const resolvedPath = resolved.id.replace(BACKSLASH_REGEX, '/');
          const [resolvedCleanPath, resolvedQuery] = resolvedPath.split('?');
          const resolvedClean = resolvedCleanPath.split('#')[0];
          const decodedResolvedClean = decodeURIComponent(resolvedClean);

          const langFolderNormalized = langFolder.replace(BACKSLASH_REGEX, '/');
          const decodedLangFolderNormalized = decodeURIComponent(langFolderNormalized);

          if (decodedResolvedClean.startsWith(`${decodedLangFolderNormalized}/`) && decodedResolvedClean.endsWith('.json')) {
            const virtualId = `virtual:lang-json-picker:${decodedResolvedClean.replace(JSON_SUFFIX_REGEX, '')}.js`;
            return resolvedQuery ? `${virtualId}?${resolvedQuery}` : virtualId;
          }
        }
      }

      return null;
    },
    async load(id) {
      const [baseId] = id.split('?');
      const cleanId = baseId.split('#')[0];

      if (cleanId.startsWith('lang-')) {
        let matchedEntryName = '';
        let matchedLanguage = '';
        for (const entryName of Object.keys(entry)) {
          if (cleanId.endsWith(`-${entryName}`)) {
            matchedEntryName = entryName;
            matchedLanguage = cleanId.slice('lang-'.length, -(`-${entryName}`.length));
            break;
          }
        }
        if (!matchedEntryName)
          return null;

        const entryConfig = entry[matchedEntryName];
        const langKeys = entryConfig?.langJsonPicker || [];
        const filePath = resolve(langFolder, `${matchedLanguage}.json`);
        if (this?.addWatchFile) {
          this.addWatchFile(filePath);
        }
        const raw = await fs.readFile(filePath, 'utf-8');
        const content = JSON.parse(raw);
        const filtered = pick(content, langKeys);
        return `export default ${JSON.stringify(filtered)};`;
      }

      if (cleanId.startsWith('virtual:lang-json-picker:')) {
        const decodedId = decodeURIComponent(cleanId);
        const filePath = decodedId
          .replace('virtual:lang-json-picker:', '')
          .replace(JS_SUFFIX_REGEX, '.json');
        if (this?.addWatchFile) {
          this.addWatchFile(filePath);
        }
        const raw = await fs.readFile(filePath, 'utf-8');
        const content = JSON.parse(raw);

        const entryConfigs: Record<string, string[]> = {};
        for (const [name, entryConfig] of Object.entries(entry)) {
          if (entryConfig.langJsonPicker) {
            entryConfigs[name] = entryConfig.langJsonPicker;
          }
        }

        const allKeys = new Set<string>();
        for (const keys of Object.values(entryConfigs)) {
          keys.forEach(k => allKeys.add(k));
        }

        const compiledFiltered = pick(content, Array.from(allKeys));

        const inlinePickFn = `
function pick(obj, paths) {
  const result = {};
  for (const path of paths) {
    const keys = path.split('.');
    let current = obj;
    let temp = result;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        if (current && current[key] !== undefined) {
          temp[key] = current[key];
        }
      } else {
        if (!temp[key]) {
          temp[key] = {};
        }
        temp = temp[key];
        current = current ? current[key] : undefined;
      }
    });
  }
  return result;
}
`.trim();

        return `
${inlinePickFn}
const rawData = ${JSON.stringify(compiledFiltered)};
const entryConfigs = ${JSON.stringify(entryConfigs)};
const entryName = (typeof window !== 'undefined' && window['__ESBOOT_ENTRY_NAME__']) || '';
const keys = entryConfigs[entryName];
export default keys ? pick(rawData, keys) : rawData;
`;
      }

      return null;
    },
    transformIndexHtml(html, ctx) {
      const htmlPath = ctx?.path || '';
      const match = htmlPath.match(HTML_ENTRY_REGEX);
      const entryName = match ? match[1] : '';
      if (entryName) {
        return html.replace('<head>', `<head><script>window.__ESBOOT_ENTRY_NAME__ = "${entryName}";</script>`);
      }
      return html;
    },
    configureServer(server) {
      server.watcher.add(langFolder);

      const handleFileChange = (filePath: string): void => {
        const normalizedPath = filePath.replace(BACKSLASH_REGEX, '/');
        const langFolderNormalized = langFolder.replace(BACKSLASH_REGEX, '/');
        const decodedPath = decodeURIComponent(normalizedPath);
        const decodedLangFolder = decodeURIComponent(langFolderNormalized);

        if (decodedPath.startsWith(`${decodedLangFolder}/`) && decodedPath.endsWith('.json')) {
          const match = decodedPath.match(LANG_FILE_NAME_REGEX);
          const changedLang = match ? match[1] : '';

          for (const mod of server.moduleGraph.idToModuleMap.values()) {
            if (mod.id) {
              const [baseId] = mod.id.split('?');
              const cleanId = baseId.split('#')[0].replace(BACKSLASH_REGEX, '/');
              const decodedCleanId = decodeURIComponent(cleanId);

              const isImportLocales = decodedCleanId.endsWith('helpers/import-locales.ts') || decodedCleanId.endsWith('helpers/import-locales.js');

              let shouldInvalidate = isImportLocales;
              if (changedLang) {
                const isVirtualPickerForLang = decodedCleanId.includes('virtual:lang-json-picker:') && decodedCleanId.endsWith(`/${changedLang}.js`);
                const isLangModuleForLang = mod.id.startsWith(`lang-${changedLang}-`);
                if (isVirtualPickerForLang || isLangModuleForLang) {
                  shouldInvalidate = true;
                }
              }

              if (shouldInvalidate) {
                server.moduleGraph.invalidateModule(mod);
              }
            }
          }
          server.ws.send({ type: 'full-reload' });
        }
      };

      server.watcher.on('add', handleFileChange);
      server.watcher.on('unlink', handleFileChange);
      server.watcher.on('change', handleFileChange);
    },
    async transform(code: string, id: string) {
      const [baseId] = id.split('?');
      const cleanId = baseId.split('#')[0].replace(BACKSLASH_REGEX, '/');
      if (cleanId.endsWith('helpers/import-locales.ts') || cleanId.endsWith('helpers/import-locales.js')) {
        const latestLanguages = await getLanguages();

        const langMapEntries: string[] = [];
        for (const [entryName, entryConfig] of Object.entries(entry)) {
          if (entryConfig.langJsonPicker) {
            for (const language of latestLanguages) {
              langMapEntries.push(`'${language}-${entryName}': () => import('lang-${language}-${entryName}')`);
            }
          }
        }

        for (const lang of latestLanguages) {
          langMapEntries.push(`'${lang}-fallback': () => import('@/lang/${lang}.json')`);
        }

        const langMapStr = `
const __langMap = {
  ${langMapEntries.join(',\n  ')}
};
`;

        const replacement = `
          const entryName = (typeof window !== 'undefined' && window['__ESBOOT_ENTRY_NAME__']) || '';
          const langKey = \`\${currentLanguage}-\${entryName}\`;
          const loadLang = __langMap[langKey] || __langMap[\`\${currentLanguage}-fallback\`];
          if (loadLang) {
            langData = await loadLang();
          }
        `;

        let newCode = code;
        const lastImportIndex = code.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const insertIndex = code.indexOf('\n', lastImportIndex);
          newCode = `${code.slice(0, insertIndex)}\n${langMapStr}\n${code.slice(insertIndex)}`;
        }
        else {
          newCode = `${langMapStr}\n${code}`;
        }
        newCode = newCode.replace(SWITCH_REGEX, replacement);

        return { code: newCode, map: null };
      }
      return null;
    },
  };

  viteCfg.plugins!.push(langJsonPickerPlugin);
};
