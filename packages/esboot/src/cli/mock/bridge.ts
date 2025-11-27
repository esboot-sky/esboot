import type { Configuration } from '@/cfg';
import { join, relative } from 'node:path';

import { fileURLToPath } from 'node:url';
import { exec } from '@dz-web/esboot-common/execa';
import { resolveLibPath as baseResolveLibPath } from '@dz-web/esboot-common/helpers';

export async function mockBridge(
  options: Record<string, string>,
  config: Configuration,
): Promise<void> {
  const { file, sampleFile } = options;
  const { configRootPath, MPConfiguration, isSP, cwd } = config;

  const rootPath = isSP
    ? configRootPath
    : MPConfiguration.configRootPathOfPlatfrom;

  const folderPath = join(rootPath, 'bridge');

  const filePath = file
    ? relative(cwd, file)
    : relative(cwd, join(folderPath, 'bridge-mock.js'));
  const samplePath = sampleFile
    ? relative(cwd, sampleFile)
    : join(folderPath, 'bridge-mock-sample.js');

  const bridgeMockBinPath = fileURLToPath(baseResolveLibPath('@dz-web/bridge-mock', import.meta.resolve));
  exec(`node ${bridgeMockBinPath} -f "${filePath}" -s "${samplePath}"`, {
    options: {
      cwd,
    },
  });
}
