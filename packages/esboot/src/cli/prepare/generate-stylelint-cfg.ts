import { join } from 'node:path';

import { writeFile, ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info, error } from '@dz-web/esboot-common/helpers';
import stylelintCfg from '@dz-web/esboot-lint/stylelint';

import cfg from '@/cfg';
import { callPluginHookOfModifyLintConfig, PluginHooks } from '@/plugin';

export function generateStylelintCfg() {
  const outoutPath = join(cacheDir, 'stylelint/index.js');

  callPluginHookOfModifyLintConfig(
    PluginHooks.modifyStylelintConfig,
    cfg.config,
    stylelintCfg
  );

  ensureFileSync(outoutPath);
  writeFile(
    outoutPath,
    `module.exports=${JSON.stringify(stylelintCfg, null, 2)}`
  )
    .then(() => {
      info(`Created Stylelint Config: ${outoutPath}.`);
    })
    .catch((err) => {
      error(err);
    });
}
