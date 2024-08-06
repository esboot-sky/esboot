import { join } from 'path';

import { writeFileSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info } from '@dz-web/esboot-common/helpers';

import cfg from '@dz-web/esboot-stylelint';

export function generateStylelintCfg() {
  const outoutPath = join(cacheDir, 'stylelint.js');

  writeFileSync(outoutPath, `module.exports=${JSON.stringify(cfg, null, 2)}`);
  info(`Created Stylelint Config: ${outoutPath}.`);
}
