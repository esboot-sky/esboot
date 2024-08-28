import { exec } from '@dz-web/esboot-common/execa';
import { DEFAULT_PREVIEW_PORT } from '@dz-web/esboot-common';
import type { Configuration } from '@/cfg/types';

export const preview = async (config: Configuration) => {
  const { cwd, outputPath } = config;

  exec(`pnpx http-server ${outputPath} -p ${DEFAULT_PREVIEW_PORT} -c-1 -g -b`, {
    options: {
      cwd,
    },
  });
};
