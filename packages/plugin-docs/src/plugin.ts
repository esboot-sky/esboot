import { join, dirname, relative } from 'node:path';
import { PluginHooks, type Plugin } from '@dz-web/esboot';
import { exec } from '@dz-web/esboot-common/execa';
import { ensureFileSync, copySync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common';
import { info } from '@dz-web/esboot-common/helpers';

const cfgPath = join(__dirname, '../config/.dumirc.ts');
const targetPath = join(cacheDir, 'dumi/.dumirc.ts');
const APP_ROOT = './docs';

export default (): Plugin => {
  return {
    key: 'plugin-docs',
    [PluginHooks.registerCommands]: () => {
      return [
        {
          name: 'docs',
          description: 'Start docs',
          arguments: [
            {
              name: '[subCommand]',
              description: 'the sub command',
              defaultValue: 'dev',
            },
          ],
          allowUnknownOption: true,
          action: async (subCommand, options) => {
            const { port } = options;
            process.env.APP_ROOT = APP_ROOT;
            process.env.DUMI_THEME = dirname(
              require.resolve('dumi-theme-lobehub/package.json')
            );

            const relativePath = relative(APP_ROOT, targetPath);
            // pnpm --package=@dz-web/dumi-only-for-esboot@latest dlx docs-dumi
            let cmd = `node ~/Code/fork-repos/dumi/bin/dumi.js ${subCommand} --config ${relativePath}`;
            if (port) {
              process.env.port = port;
              cmd += ` --port ${port}`;
            }

            exec(cmd);
          },
        },
      ];
    },
    [PluginHooks.prepare]: () => {
      ensureFileSync(targetPath);
      copySync(cfgPath, targetPath);

      info(`Created Doc Config: ${targetPath}.`);
    },
  };
};
