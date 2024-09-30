import { join } from 'path';
import { PluginHooks, type Plugin } from '@dz-web/esboot';
import { exec } from '@dz-web/esboot-common/execa';

export default (): Plugin => {
  return {
    key: 'plugin-dumi',
    [PluginHooks.registerCommands]: () => {
      // const { cwd } = cfg;

      return [
        {
          name: 'docs',
          description: 'Start docs',
          allowUnknownOption: true,
          action: async () => {
            process.env.APP_ROOT = './docs';
            exec(
              `pnpm --package=@dz-web/dumi@latest dlx docs-dumi dev --config ${join(
                'node_modules/.cache/esboot/dumi/.dumirc.ts'
              )}`
            );
          },
        },
      ];
    },
  };
};
