import type { Plugin } from '@dz-web/esboot';
import { dirname, join, relative } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { PluginHooks } from '@dz-web/esboot';
import { cacheDir } from '@dz-web/esboot-common';
import { exec } from '@dz-web/esboot-common/execa';
import { copySync, ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { info, resolveLibPath } from '@dz-web/esboot-common/helpers';

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
              fileURLToPath(
                import.meta.resolve('dumi-theme-lobehub/package.json'),
              ),
            );

            const dumiPath = resolveLibPath('dumi', import.meta.resolve);
            const relativePath = relative(APP_ROOT, targetPath);
            let cmd = `node ${dumiPath}/bin/dumi.js ${subCommand} --config ${relativePath}`;
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
