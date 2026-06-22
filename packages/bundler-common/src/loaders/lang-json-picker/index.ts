import { resolve } from 'node:path';
import fs from 'node:fs';

interface AnyObject {
  [key: string]: any;
}

function langPickFn(obj: AnyObject, paths: string[]): AnyObject {
  const result: AnyObject = {};

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

export default function (this: any, source: string): string {
  const params = new URLSearchParams(this.resourceQuery);
  const language = params.get('lang');
  const entryName = params.get('entry');

  const options = this.getOptions() || {};
  const { rootPath, entry } = options.config || {};

  if (!language || !entryName) {
    if (rootPath && this.resourcePath) {
      const langFolderNormalized = resolve(rootPath, 'lang').replace(/\\/g, '/');
      const resourcePathNormalized = this.resourcePath.replace(/\\/g, '/');
      if (resourcePathNormalized.startsWith(langFolderNormalized + '/') && resourcePathNormalized.endsWith('.json')) {
        const lang = resourcePathNormalized.split('/').pop()?.replace('.json', '');
        if (lang) {
          let content = {};
          try {
            content = JSON.parse(source);
          } catch (err) {
            try {
              content = JSON.parse(fs.readFileSync(this.resourcePath, 'utf-8'));
            } catch (e) {}
          }

          const entryConfigs: Record<string, string[]> = {};
          for (const [name, entryConfig] of Object.entries(entry || {})) {
            const config = entryConfig as any;
            if (config?.langJsonPicker) {
              entryConfigs[name] = config.langJsonPicker;
            }
          }

          const allKeys = new Set<string>();
          for (const keys of Object.values(entryConfigs)) {
            keys.forEach(k => allKeys.add(k));
          }

          const compiledFiltered = langPickFn(content, Array.from(allKeys));

          const inlineLangPickFn = `
function langPickFn(obj, paths) {
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
${inlineLangPickFn}
const rawData = ${JSON.stringify(compiledFiltered)};
const entryConfigs = ${JSON.stringify(entryConfigs)};
const entryName = (typeof window !== 'undefined' && window['__ESBOOT_ENTRY_NAME__']) || '';
const keys = entryConfigs[entryName];
export default keys ? langPickFn(rawData, keys) : rawData;
`;
        }
      }
    }
    return source;
  }

  const langFile = resolve(rootPath, 'lang', `${language}.json`);

  let jsonData = {};
  try {
    const raw = fs.readFileSync(langFile, 'utf-8');
    jsonData = JSON.parse(raw);
    const { langJsonPicker } = entry[entryName] || {};
    if (langJsonPicker) {
      jsonData = langPickFn(jsonData, langJsonPicker);
    }
  } catch (err) {}

  return `export default ${JSON.stringify(jsonData)}`;
}
