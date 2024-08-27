import { exec } from '@dz-web/esboot-common/execa';

import type { Configuration } from '@/cfg/types';

export const preview = async (config: Configuration) => {
  const {
    cwd,
    outputPath,
  } = config;

  exec(`pnpx http-server ${outputPath} -p 9000 -c-1 -g -b`, {
    options: {
      cwd,
    },
  });
};
