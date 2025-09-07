import { join } from 'node:path';

import { cacheDir } from '@dz-web/esboot-common/constants';
import { ensureFileSync, writeJSON } from '@dz-web/esboot-common/fs-extra';
import { error, info } from '@dz-web/esboot-common/helpers';
import { PluginHooks } from '@dz-web/esboot-common/plugin';

import prettierConfig from '@dz-web/esboot-lint/prettier';
import { cfg } from '@/cfg';
import { callPluginHookOfModifyLintConfig } from '@/plugin';

export function generatePrettierCfg(): void {
  callPluginHookOfModifyLintConfig(
    PluginHooks.modifyPrettierConfig,
    cfg.config,
    prettierConfig,
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
