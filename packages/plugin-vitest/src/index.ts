import type { Plugin } from '@dz-web/esboot';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PluginHooks } from '@dz-web/esboot';
import { exec } from '@dz-web/esboot-common/execa';
import {
  resolveLibPath as baseResolveLibPath,
  searchCommand,
} from '@dz-web/esboot-common/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function resolveLibPath(p: string): string {
  return baseResolveLibPath(p, import.meta.resolve);
}

export const alias = {
  'vitest': resolveLibPath('vitest'),
  '@testing-library/react': resolveLibPath('@testing-library/react'),
  '@testing-library/user-event': resolveLibPath('@testing-library/user-event'),
};

export default (): Plugin => {
  return {
    name: 'plugin-vitest',
    [PluginHooks.registerCommands]: (cfg) => {
      const { cwd } = cfg;

      return [
        {
          name: 'vitest',
          description: 'Start vitest',
          arguments: [{ name: '[subCommand]', description: 'the sub command' }],
          options: ['-p, --passThrough <passThrough>'],
          allowUnknownOption: true,
          action: async (_, options) => {
            const { passThrough = '' } = options;
            exec(
              `${searchCommand(join(__dirname, '../'), 'vitest')} ${passThrough} -r ${cwd} -c ${resolve(__dirname, '../config/vitest.config.ts')}`,
            );
          },
        },
      ];
    },
    [PluginHooks.modifyConfig]: () => {
      return {
        alias,
      };
    },
    [PluginHooks.modifyTypescriptConfig]: () => {
      return {
        include: [resolveLibPath('@testing-library/jest-dom')],
      };
    },
  };
};
