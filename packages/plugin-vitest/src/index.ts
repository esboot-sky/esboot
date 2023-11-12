import type { Plugin } from '@dz-web/esboot';
import { resolve } from 'path';

import { runExec } from './helpers';

export default (): Plugin => {
  return {
    key: 'plugin-vitest',
    registerCommands: (program) => {
      program
        .command('vitest')
        .description('Start vitest')
        .allowUnknownOption(true)
        .action(async () => {
          runExec([
            'vitest',
            '-r',
            process.cwd(),
            '--dir',
            'src',
            '-c',
            resolve(__dirname, '../vitest.config.ts'),
          ]);
          console.log(2, '<-- vitest');
        });
    },
  };
};
