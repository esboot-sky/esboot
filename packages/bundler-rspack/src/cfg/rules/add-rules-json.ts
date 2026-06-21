import type { AddFunc } from '@/cfg/types';
import { resolve } from 'node:path';
import fs from 'node:fs';

export const addJSONRules: AddFunc = async (cfg, rspack) => {
  const { useLangJsonPicker, entry, rootPath } = cfg.config;

  if (!useLangJsonPicker)
    return;

  const placeholderPath = resolve(__dirname, 'placeholder.json');
  if (!fs.existsSync(placeholderPath)) {
    try {
      fs.writeFileSync(placeholderPath, '{}');
    } catch (err) {}
  }

  if (!rspack.resolve) {
    rspack.resolve = {};
  }
  if (!rspack.resolve.alias) {
    rspack.resolve.alias = {};
  }

  const langFolder = resolve(rootPath, 'lang');
  let languages = ['zh-CN', 'zh-TW', 'en-US'];
  try {
    const files = fs.readdirSync(langFolder);
    languages = files
      .filter((file: string) => file.endsWith('.json'))
      .map((file: string) => file.replace('.json', ''));
  } catch (err) {}

  for (const item of Object.values(entry)) {
    if (item.langJsonPicker) {
      for (const lang of languages) {
        const aliasKey = `lang-${lang}-${item.chunkName}`;
        rspack.resolve.alias[aliasKey] = `${placeholderPath}?lang=${lang}&entry=${item.chunkName}`;
      }
    }
  }

  // Register loader rule for placeholder.json
  rspack.module.rules.push({
    test: /placeholder\.json$/,
    type: 'javascript/auto',
    use: [
      {
        loader: resolve(__dirname, 'loaders/lang-json-picker/index.js'),
        options: {
          config: cfg.config,
        },
      },
    ],
  });

  // Register loader for import-locales.ts
  rspack.module.rules.push({
    test: /helpers\/import-locales\.(ts|js)$/,
    enforce: 'pre',
    use: [
      {
        loader: resolve(__dirname, 'loaders/import-locales-loader/index.js'),
        options: {
          config: cfg.config,
          languages,
        },
      },
    ],
  });
};
