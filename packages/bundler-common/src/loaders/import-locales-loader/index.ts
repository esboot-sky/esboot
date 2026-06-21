export default function (this: any, source: string): string {
  const options = this.getOptions() || {};
  const { entry } = options.config;
  const languages = options.languages || ['zh-CN', 'zh-TW', 'en-US'];

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

  const switchRegex = /switch\s*\(\s*currentLanguage\s*\)\s*\{[\s\S]+?\}/;
  const replacement = `
    const entryName = (typeof window !== 'undefined' && window['__ESBOOT_ENTRY_NAME__']) || '';
    const langKey = \`\${currentLanguage}-\${entryName}\`;
    const loadLang = __langMap[langKey] || __langMap[\`\${currentLanguage}-fallback\`];
    if (loadLang) {
      langData = await loadLang();
    }
  `;

  let newCode = source.replace(switchRegex, replacement);
  newCode = langMapStr + '\n' + newCode;

  return newCode;
}
