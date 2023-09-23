import { join } from 'path';
import esbootConfig from '@@/config';

import { runExec } from '../exec';

export function runMockBridge(options: Record<string, string>) {
  const { file, sampleFile } = options;
  const { platform } = esbootConfig.compileTimeConfig;
  const folderPath = `./config/${platform}`;

  const filePath = file || join(folderPath, 'bridge/bridge-mock.js');
  const samplePath =
    sampleFile || join(folderPath, 'bridge/bridge-mock-sample.js');

  runExec(['bridge-mock', '-f', filePath, '-s', samplePath]);
}
