import type { Plugin } from '@dz-web/esboot';
import { runExec } from '@dz-web/esboot-utils';
import { resolve, join } from 'path';

export default (): Plugin => {
  return {
    key: 'plugin-storybook',
    registerCommands: (program) => {
      program
        .command('storybook')
        .description('Start storybook')
        .allowUnknownOption(true)
        .action(async (_, p) => {
          runExec(join(__dirname, '../'), [
            'storybook',
            'dev',
            '-c',
            resolve(__dirname, '../config/.storybook'),
            ...p.args,
          ]);
        });
    },
  };
};
