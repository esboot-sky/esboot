import { resolve, join } from 'node:path';
import { PluginHooks, type Plugin } from '@dz-web/esboot';
import {
  resolveLibPath as baseResolveLibPath,
  searchCommand,
} from '@dz-web/esboot-common/helpers';
import { exec } from '@dz-web/esboot-common/execa';

const resolveLibPath = (p: string) => baseResolveLibPath(p, import.meta.resolve);

export const alias = {
  vitest: resolveLibPath('vitest'),  
  '@testing-library/react': resolveLibPath('@testing-library/react'),
  '@testing-library/user-event': resolveLibPath('@testing-library/user-event'),
};

export default (): Plugin => {
  return {
    key: 'plugin-vitest',
    [PluginHooks.registerCommands]: (cfg) => {
      const { cwd } = cfg;

      console.log(
        `${searchCommand(join(__dirname, '../'), 'vitest')}`,
        'vitest'
      );
      return [
        {
          name: 'vitest',
          description: 'Start vitest',
          allowUnknownOption: true,
          action: async (_, p) => {
            exec(
              `${searchCommand(join(__dirname, '../'), 'vitest')} ${p.args.join(' ')} -r ${cwd} -c ${resolve(__dirname, '../config/vitest.config.ts')}`
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
