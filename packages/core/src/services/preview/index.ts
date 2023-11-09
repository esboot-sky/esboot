import spawn from 'cross-spawn';
import { searchCommand } from '@@/helpers/path';
import esbootConfig from '@@/config';

export const runPreview = (port: number, directory: string) => {
  const { userOpts: { outputPath = '' } } = esbootConfig;

  spawn.sync(
    searchCommand('http-server'),
    [directory || outputPath, '-p', String(port), '-c', '1'],
    {
      stdio: 'inherit',
      shell: true,
    }
  );
};
