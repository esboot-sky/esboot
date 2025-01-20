import fs from 'node:fs/promises';
import { pick } from '@dz-web/esboot-common/lodash';
import type { AddFunc } from '@/cfg/types.mts';
import type { Plugin } from 'vite';
import { resolve } from 'node:path';

export const addLangJsonPicker: AddFunc = async (cfg, viteCfg) => {
  const { useLangJsonPicker, rootPath, entry } = cfg.config;

  if (!useLangJsonPicker) return;

  console.log(entry, 'entry');

  const langJsonKeys: Set<string> = new Set();

  for (const [_, value] of Object.entries(entry)) {
    const { langJsonPicker } = value;

    if (langJsonPicker) {
      for (const langJsonKey of langJsonPicker) {
        langJsonKeys.add(langJsonKey);
      }
    }
  }

  const langFolder = resolve(rootPath, 'lang');
  const langJsonPickerPlugin: Plugin = {
    name: 'vite-plugin-lang-json-picker',
    async load(id) {
      if (langJsonKeys.size === 0) return;
      if (!id.startsWith(langFolder) && !id.endsWith('.json')) return;
      const rawContent = await fs.readFile(id, 'utf-8');

      if (rawContent) {
        const content = JSON.parse(rawContent);
        const langJson = pick(content, [...langJsonKeys]);

        return JSON.stringify(langJson);
      }

      return null;
    },
  };

  viteCfg.plugins.push(langJsonPickerPlugin);
};
