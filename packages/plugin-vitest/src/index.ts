import { resolve } from 'path';
import { PluginHooks, type Plugin } from '@dz-web/esboot';
import { getAbsolutePath as baseGetAbsolutePath } from '@dz-web/esboot-common/helpers';
import { exec } from '@dz-web/esboot-common/execa';

const getAbsolutePath = (p: string) => baseGetAbsolutePath(p, require.resolve);

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

      return [
        {
          name: 'vitest',
          description: 'Start vitest',
          allowUnknownOption: true,
          action: async (_, p) => {
            exec(
              `vitest -r ${cwd} -c ${resolve(__dirname, '../config/vitest.config.ts')} ${p.args.join(' ')}`
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
