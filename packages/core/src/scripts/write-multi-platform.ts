import { join } from 'path';
import fse from 'fs-extra';

import esbootConfig from '@@/config';

export function writeMultiPlatform() {
  const { rootPath, platform, pageType } = esbootConfig.compileTimeCfg;
  fse.outputFileSync(
    join(rootPath, './helpers/multi-platforms.ts'),
    `// 📢 Do not modify it manually, esboot is automatically generated。\nexport * from '@${platform}-${pageType}/helpers/multi-platforms';\n`
  );
}
