import { join } from 'path';

import { writeFileSync, ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info } from '@dz-web/esboot-common/helpers';

import commitlintCfg from '@dz-web/esboot-lint/commitlint';

export function generateCommitlintCfg() {
  const outoutPath = join(cacheDir, 'commitlint/index.js');

  ensureFileSync(outoutPath);
  writeFileSync(
    outoutPath,
    `module.exports=${JSON.stringify(commitlintCfg, null, 2)}`
  );
  info(`Created Commitlint Config: ${outoutPath}.`);
}
