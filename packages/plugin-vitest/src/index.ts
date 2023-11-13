import type { Plugin } from '@dz-web/esboot';
import { resolve } from 'path';

import { runExec } from './helpers';

export const alias = {
  vitest: require.resolve('vitest'),
  '@testing-library/react': require.resolve('@testing-library/react'),
  '@testing-library/user-event': require.resolve('@testing-library/user-event'),
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
          runExec([
            'vitest',
            '-r',
            process.cwd(),
            '--dir',
            'src',
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
