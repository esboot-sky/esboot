import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { getCacheDir } from '@dz-web/esboot-common/constants';
import { ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { error, info } from '@dz-web/esboot-common/helpers';

import commitlintCfg from '@dz-web/esboot-lint/commitlint';
import { cfg } from '@/cfg';

export function generateCommitlintCfg(): void {
  const cacheDir = getCacheDir(cfg.config.cwd);
  const outoutPath = join(cacheDir, 'commitlint/index.js');

  ensureFileSync(outoutPath);
  writeFile(
    outoutPath,
    `module.exports=${JSON.stringify(commitlintCfg, null, 2)}`,
  )
    .then(() => {
      info(`Created Commitlint Config: ${outoutPath}.`);
    })
    .catch((err) => {
      error(err);
    });
}
