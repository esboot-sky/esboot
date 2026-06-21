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

  if (!language || !entryName) {
    return source;
  }

  const options = this.getOptions() || {};
  const { rootPath, entry } = options.config;
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
