import type { Plugin } from '@dz-web/esboot';

export default (): Plugin => {
  return {
    key: 'plugin-vitest',
    registerCommands: (program) => {
      program
        .command('vitest')
        .description('Start development project')
        .allowUnknownOption(true)
        .action(async () => {
          console.log(1, '<-- vitest');
        });
    },
  };
};
