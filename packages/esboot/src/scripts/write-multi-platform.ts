import { join } from 'node:path';
import { outputFileSync } from '@dz-web/esboot-common/fs-extra';

import type { Configuration } from '../cfg/types';

export function writeMultiPlatform(cfg: Configuration) {
  const { rootPath, isSP } = cfg;

  if (isSP) return;

  const { platform, pageType } = cfg.MPConfiguration!;

  outputFileSync(
    join(rootPath, './helpers/multi-platforms.ts'),
    `// 📢 Do not manually modify, automatically generated by ESBoot.\nexport * from '@${platform}-${pageType}/helpers/multi-platforms';\n`
  );
}
