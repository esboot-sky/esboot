import { join } from 'node:path';

import prettierConfig from '@dz-web/esboot-lint/prettier';
import { writeJSON, ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info, error } from '@dz-web/esboot-common/helpers';

import cfg from '@/cfg';
import { callPluginHookOfModifyLintConfig, PluginHooks } from '@/plugin';

export function generatePrettierCfg() {
  callPluginHookOfModifyLintConfig(
    PluginHooks.modifyPrettierConfig,
    cfg.config,
    prettierConfig
  );

  const outputPath = join(cacheDir, 'prettier/index.json');
  ensureFileSync(outputPath);
  writeJSON(outputPath, prettierConfig, {
    spaces: 2,
  })
    .then(() => {
      info(`Created Prettier Config: ${outputPath}.`);
    })
    .catch((err) => {
      error(err);
    });
}
