import { readFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getCacheDir } from '@dz-web/esboot-common/constants';
import { ensureDirSync, writeJSON } from '@dz-web/esboot-common/fs-extra';
import { error, info } from '@dz-web/esboot-common/helpers';
import { PluginHooks } from '@dz-web/esboot-common/plugin';

import { cfg } from '@/cfg';
import { absListPath } from '@/helpers';
import { callPluginHookOfModifyLintConfig } from '@/plugin';

// Load tsconfig.json using readFileSync to avoid Node.js v22 import attribute issues
const tsconfigPath = fileURLToPath(import.meta.resolve('@dz-web/esboot-lint/tsconfig.json'));
const tsconfigJson = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));

export function generateTypeScriptCfg(): void {
  const { cwd, alias } = cfg.config;
  const cacheDir = getCacheDir(cwd);
  const _alias: Record<string, string[]> = {};

  for (const k in alias) {
    const rawValue = alias[k];
    const isAbsoluteValue = isAbsolute(rawValue);
    const key = isAbsoluteValue ? k : `${k}/*`;
    const value = isAbsoluteValue ? rawValue : `${rawValue}/*`;

    _alias[key] = [value];
  }

  tsconfigJson.compilerOptions.baseUrl = cwd;
  tsconfigJson.compilerOptions.paths = _alias;
  tsconfigJson.exclude = absListPath(cfg.config, tsconfigJson.exclude);
  tsconfigJson.include = absListPath(cfg.config, tsconfigJson.include);

  callPluginHookOfModifyLintConfig(
    PluginHooks.modifyTypescriptConfig,
    cfg.config,
    tsconfigJson,
  );
  const folderPath = join(cacheDir, 'typescript');
  const outoutPath = join(folderPath, 'tsconfig.json');

  ensureDirSync(folderPath);

  writeJSON(outoutPath, tsconfigJson, {
    spaces: 2,
  })
    .then(() => {
      info(`Created Typescript Config: ${outoutPath}.`);
    })
    .catch((err) => {
      error(err);
    });
}
