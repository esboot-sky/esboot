import { join } from 'node:path';

import { writeFile, ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info, error } from '@dz-web/esboot-common/helpers';

import commitlintCfg from '@dz-web/esboot-lint/commitlint';

export function generateCommitlintCfg() {
  const outoutPath = join(cacheDir, 'commitlint/index.js');

  ensureFileSync(outoutPath);
  writeFile(
    outoutPath,
    `module.exports=${JSON.stringify(commitlintCfg, null, 2)}`
  )
    .then(() => {
      info(`Created Commitlint Config: ${outoutPath}.`);
    })
    .catch((err) => {
      error(err);
    });
}
