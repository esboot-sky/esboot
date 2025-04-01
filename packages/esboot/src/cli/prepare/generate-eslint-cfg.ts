import { join } from 'node:path';

import cfg from '@/cfg';

import { writeFile, ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info, error } from '@dz-web/esboot-common/helpers';

import eslintCfg from '@dz-web/esboot-lint/eslint';

import { callPluginHookOfModifyLintConfig, PluginHooks } from '@/plugin';
import { absPath } from '@/helpers';

export function generateESLintCfg() {
  const { alias } = cfg.config;
  const _alias: [string, string][] = [];

  for (const k in alias) {
    const value = `${absPath(cfg.config, alias[k])}/`;

    _alias.push([k, value]);
  }

  eslintCfg.settings['import/resolver'].alias.map = _alias;

  callPluginHookOfModifyLintConfig(
    PluginHooks.modifyEslintConfig,
    cfg.config,
    eslintCfg
  );

  const outputPath = join(cacheDir, 'eslint/index.js');
  ensureFileSync(outputPath);
  writeFile(
    outputPath,
    `module.exports = ${JSON.stringify(eslintCfg, null, 2)}`
  )
    .then(() => {
      info(`Created ESLint Config: ${outputPath}.`);
    })
    .catch((err) => {
      error(err);
    });
}
