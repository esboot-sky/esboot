import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { getCacheDir } from '@dz-web/esboot-common/constants';
import { ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { error, info } from '@dz-web/esboot-common/helpers';
import { PluginHooks } from '@dz-web/esboot-common/plugin';

import stylelintCfg from '@dz-web/esboot-lint/stylelint';
import { cfg } from '@/cfg';
import { callPluginHookOfModifyLintConfig } from '@/plugin';

export function generateStylelintCfg(): void {
  const cacheDir = getCacheDir(cfg.config.cwd);
  const outoutPath = join(cacheDir, 'stylelint/index.js');

  callPluginHookOfModifyLintConfig(
    PluginHooks.modifyStylelintConfig,
    cfg.config,
    stylelintCfg,
  );

  ensureFileSync(outoutPath);
  writeFile(
    outoutPath,
    `export default ${JSON.stringify(stylelintCfg, null, 2)}`,
  )
    .then(() => {
      info(`Created Stylelint Config: ${outoutPath}.`);
    })
    .catch((err) => {
      error(err);
    });
}
