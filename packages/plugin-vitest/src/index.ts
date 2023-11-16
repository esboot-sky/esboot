import type { Plugin } from '@dz-web/esboot';
import { resolve, dirname } from 'path';

import { runExec } from './helpers';

const modules = {
  vitest: require.resolve('vitest'),
  '@testing-library/react': require.resolve('@testing-library/react'),
  '@testing-library/user-event': require.resolve('@testing-library/user-event'),
};

// FIXME: 优化
const correctedModules: Record<string, string> = {};
for (const [moduleName, modulePath] of Object.entries(modules)) {
  let currentPath = modulePath;
  while (!currentPath.endsWith(`/${moduleName}`)) {
    currentPath = dirname(currentPath);
  }

  correctedModules[moduleName] = currentPath;
}
export const alias = correctedModules;

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
