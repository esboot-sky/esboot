import type { Plugin } from '@dz-web/esboot';
import { resolve, dirname } from 'path';

import { runExec } from './helpers';

const hyphen = process.platform === 'win32' ? '\\' : '/';
const modules = {
  vitest: require.resolve('vitest'),
  '@testing-library/react': require.resolve('@testing-library/react'),
  '@testing-library/user-event': require.resolve('@testing-library/user-event'),
};

// FIXME: 优化
const correctedModules: Record<string, string> = {};
for (const [moduleName, modulePath] of Object.entries(modules)) {
  let currentPath = modulePath;
  let isRootPath = false;
  const compatibleModuleName = moduleName.replace('/', hyphen);
  while (
    !currentPath.endsWith(`${hyphen}${compatibleModuleName}`) &&
    !isRootPath
  ) {
    const path = dirname(currentPath);

    if (currentPath !== path) {
      currentPath = path;
    } else {
      isRootPath = true;
    }
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
