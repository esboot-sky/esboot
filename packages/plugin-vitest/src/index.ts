import type { Plugin } from '@dz-web/esboot';

export default (): Plugin => {
  return {
    key: 'plugin-vitest',
    registerCommands: (program) => {
      program
        .command('vitest')
        .description('Start vitest')
        .allowUnknownOption(true)
        .action(async () => {
          // runExec(['vitest']);
          console.log(1, '<-- vitest');
        });
    },
  };
};
