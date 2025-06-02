import { resolve, join } from 'node:path';
import { PluginHooks, type Plugin } from '@dz-web/esboot';
import {
  getAbsolutePath as baseGetAbsolutePath,
  searchCommand,
} from '@dz-web/esboot-common/helpers';
import { exec } from '@dz-web/esboot-common/execa';

const getAbsolutePath = (p: string) => baseGetAbsolutePath(p, import.meta.resolve);

export const alias = {
  vitest: getAbsolutePath('vitest'),
  '@testing-library/react': getAbsolutePath('@testing-library/react'),
  '@testing-library/user-event': getAbsolutePath('@testing-library/user-event'),
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
        include: [getAbsolutePath('@testing-library/jest-dom')],
      };
    },
  };
};
