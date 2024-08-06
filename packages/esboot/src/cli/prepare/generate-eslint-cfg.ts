import { join } from 'path';

import cfg from '@/cfg';

import { writeFileSync, ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info } from '@dz-web/esboot-common/helpers';

import eslintCfg from '@dz-web/esboot-eslint';

export function generateESLintCfg() {
  const { alias } = cfg.config;
  const _alias: [string, string][] = [];

  for (let k in alias) {
    const value = `${alias[k]}/`;

    _alias.push([k, value]);
  }

  eslintCfg.settings['import/resolver'].alias.map = _alias;
  const outputPath = join(cacheDir, 'eslint/index.js');
  ensureFileSync(outputPath);
  writeFileSync(
    outputPath,
    `module.exports = ${JSON.stringify(eslintCfg, null, 2)}`
  );

  info(`Created ESLint Config: ${outputPath}.`);
}
