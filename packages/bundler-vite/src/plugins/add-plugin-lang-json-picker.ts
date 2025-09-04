import type { Plugin } from 'vite';
import type { AddFunc } from '@/cfg/types';
import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { pick } from '@dz-web/esboot-common/lodash';

export const addLangJsonPicker: AddFunc = async (cfg, viteCfg) => {
  const { useLangJsonPicker, rootPath, entry, isDev } = cfg.config;

  if (!useLangJsonPicker)
    return;

  const langFolder = resolve(rootPath, 'lang');
  const entryLangMapping = new Map<string, string[]>();
  let currentRequestEntryName: string | null = null;

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
  const languages = ['zh-CN', 'zh-TW', 'en-US'];
  const virtualLangModules = new Map<string, { language: string; langKeys: string[] }>();
  for (const [entryName, langKeys] of entryLangMapping) {
    for (const language of languages) {
      const virtualId = `virtual:lang-${language}-${entryName}`;
      virtualLangModules.set(virtualId, { language, langKeys });
    }
  }

  const langJsonPickerPlugin: Plugin = {
    name: 'vite-plugin-lang-json-picker',
    enforce: 'post', // run after built-in plugins
    resolveId(id) {
      if (id.startsWith('virtual:import-locales-') || id.startsWith('virtual:lang-')) {
        return id;
      }
      return null;
    },
    buildStart() {
      // emit all virtual language modules
      for (const virtualId of virtualLangModules.keys()) {
        this.emitFile({ type: 'chunk', id: virtualId, name: virtualId.replace(/[:/]/g, '_') });
      }
    },
    configureServer(server) {
      if (!isDev)
        return;

      // Intercept requests to detect current HTML/entry context
      server.middlewares.use((req, _res, next) => {
        if (req.url && req.url.includes('.html')) {
          const htmlMatch = req.url.match(/\/([^/]+?)\.html/);
          if (htmlMatch) {
            currentRequestEntryName = htmlMatch[1];
            console.log(`[lang-json-picker] Dev mode - Current entry context: ${currentRequestEntryName}`);
          }
        }

        const referer = req.headers.referer;
        if (referer && req.url && req.url.includes('/lang/')) {
          const refererMatch = referer.match(/\/([^/]+?)\.html/);
          if (refererMatch) {
            currentRequestEntryName = refererMatch[1];
            console.log(`[lang-json-picker] Dev mode - Entry context from referer: ${currentRequestEntryName}`);
          }
        }

        next();
      });
    },
    async transform(code: string, _id: string) {
      // Transform entry imports to virtual import-locales
      if (!isDev && code.includes('import-locales')) {
        for (const entryName of entryLangMapping.keys()) {
          const regex = /import\s+\{[^}]+\}\s+from\s+['"]@\/helpers\/import-locales['"]/g;
          code = code.replace(regex, (match: string) => `import ${match.slice(6)} from 'virtual:import-locales-${entryName}'`);
        }
        return { code, map: null };
      }
      // Only handle language JSON modules by load
      return null;
    },
    async load(id) {
      // virtual import-locales module
      if (!isDev && id.startsWith('virtual:import-locales-')) {
        const entryName = id.replace('virtual:import-locales-', '');
        const originalPath = resolve(rootPath, 'helpers/import-locales.ts');
        const originalCode = await fs.readFile(originalPath, 'utf-8');
        // rewrite dynamic import to virtual-lang
        const code = originalCode.replace(
          /import\(\s*`@\/lang\/\$\{(.+?)\}\.json`\s*\)/g,
          (_match: string, lang: string) => {
            return `import(\`virtual:lang-${lang}-${entryName}\`)`;
          },
        );
        return { code, map: null };
      }
      // virtual lang modules
      if (!isDev && id.startsWith('virtual:lang-')) {
        const info = virtualLangModules.get(id)!;
        const raw = await fs.readFile(resolve(langFolder, `${info.language}.json`), 'utf-8');
        const content = JSON.parse(raw);
        const filtered = pick(content, info.langKeys);
        return `export default ${JSON.stringify(filtered)};`;
      }
      return null;
    },
  };

  viteCfg.plugins!.push(langJsonPickerPlugin);
};
