import type { Configuration } from '@/cfg';
import { DEFAULT_PREVIEW_PORT } from '@dz-web/esboot-common';
import { exec } from '@dz-web/esboot-common/execa';

export async function preview(config: Configuration): Promise<void> {
  const { cwd, outputPath } = config;

  exec(`pnpx http-server ${outputPath} -p ${DEFAULT_PREVIEW_PORT} -c-1 -g -b`, {
    options: {
      cwd,
    },
  });
}
