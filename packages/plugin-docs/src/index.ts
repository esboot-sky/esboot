import { join, dirname } from 'node:path';
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
            process.env.DUMI_THEME = dirname(
              require.resolve('dumi-theme-lobehub/package.json')
            );
            exec(
              `node ~/Code/fork-repos/dumi/bin/dumi.js dev --config ${join(
                '../node_modules/.cache/esboot/dumi/.dumirc.ts'
              )}`
            );

            // exec(
            //   `pnpm --package=@dz-web/dumi-only-for-esboot@latest dlx docs-dumi dev --config ${join(
            //     'node_modules/.cache/esboot/dumi/.dumirc.ts'
            //   )}`
            // );
          },
        },
      ];
    },
  };
};
