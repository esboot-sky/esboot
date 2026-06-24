import fs from 'node:fs';
import { resolve } from 'node:path';

const switchRegex = /switch\s*\(\s*currentLanguage\s*\)\s*\{[\s\S]+?\}/;

export default function (this: any, source: string): string {
  const options = this.getOptions() || {};
  const { entry, rootPath } = options.config || {};
  let languages = options.languages || ['zh-CN', 'zh-TW', 'en-US'];

  if (rootPath) {
    const langFolder = resolve(rootPath, 'lang');
    try {
      if (fs.existsSync(langFolder)) {
        if (typeof this.addContextDependency === 'function') {
          this.addContextDependency(langFolder);
        }
        const files = fs.readdirSync(langFolder);
        languages = files
          .filter((file: string) => file.endsWith('.json'))
          .map((file: string) => file.replace('.json', ''));
      }
    }
    catch {}
  }

  const entryLangMapping = new Map<string, string[]>();
  for (const [entryName, entryConfig] of Object.entries(entry as any)) {
    const config = entryConfig as any;
    if (config.langJsonPicker) {
      entryLangMapping.set(entryName, config.langJsonPicker);
    }
  }

  if (entryLangMapping.size === 0) {
    return source;
  }

  const langMapEntries: string[] = [];
  for (const [entryName] of entryLangMapping) {
    for (const language of languages) {
      langMapEntries.push(`'${language}-${entryName}': () => import('lang-${language}-${entryName}')`);
    }
  }

  for (const lang of languages) {
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

  let newCode = source;
  const lastImportIndex = source.lastIndexOf('import ');
  if (lastImportIndex !== -1) {
    const insertIndex = source.indexOf('\n', lastImportIndex);
    newCode = `${source.slice(0, insertIndex)}\n${langMapStr}\n${source.slice(insertIndex)}`;
  }
  else {
    newCode = `${langMapStr}\n${source}`;
  }
  newCode = newCode.replace(switchRegex, replacement);

  return newCode;
}
