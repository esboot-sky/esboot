import { join } from 'path';

import { writeJSONSync, ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info } from '@dz-web/esboot-common/helpers';

export function generatePrettierCfg(basePath: string) {
  const prettierConfigJson = require(
    join(basePath, 'prettier/index-sample.json')
  );

  const outputPath = join(cacheDir, 'prettier/index.json');
  ensureFileSync(outputPath);
  writeJSONSync(outputPath, prettierConfigJson, {
    spaces: 2,
  });

  info(`Created Prettier Config: ${outputPath}.`);
}
