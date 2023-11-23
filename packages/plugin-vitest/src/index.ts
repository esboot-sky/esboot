import { join, resolve } from 'path';
import type { Plugin } from '@dz-web/esboot';
import { runExec } from '@dz-web/esboot-utils';

import { getAbsolutePath } from '@@/helpers/path';

export const alias = {
  vitest: getAbsolutePath('vitest'),
  '@testing-library/react': getAbsolutePath('@testing-library/react'),
  '@testing-library/user-event': getAbsolutePath('@testing-library/user-event'),
};

export default (): Plugin => {
  return {
    key: 'plugin-vitest',
    registerCommands: (program) => {
      program
        .command('vitest')
        .description('Start vitest')
        .allowUnknownOption(true)
        .action(async (_, p) => {
          runExec(join(__dirname, '../../'), [
            'vitest',
            '-r',
            process.cwd(),
            // '--dir',
            // 'src',
            '-c',
            resolve(__dirname, '../config/vitest.config.ts'),
            ...p.args,
          ]);
        });
    },
    afterCommandOfGenerateAlias: () => ({
      alias,
    }),
  };
};
