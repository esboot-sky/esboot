import type { Plugin } from '@dz-web/esboot';
import { dirname, join, relative } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { PluginHooks } from '@dz-web/esboot';
import { getCacheDir } from '@dz-web/esboot-common';
import { exec } from '@dz-web/esboot-common/execa';
import { copySync, ensureFileSync } from '@dz-web/esboot-common/fs-extra';
import { info, resolveLibPath } from '@dz-web/esboot-common/helpers';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cfgPath = join(__dirname, '../config/.dumirc.ts');
const APP_ROOT = './docs';

function getTargetPath(cwd: string): string {
  return join(getCacheDir(cwd), 'dumi/.dumirc.ts');
}

export default (): Plugin => {
  return {
    name: 'plugin-docs',
    enforce: 'post',
    [PluginHooks.registerCommands]: (cfg) => {
      const targetPath = getTargetPath(cfg.cwd);

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
            const relativePath = relative(join(cfg.cwd, APP_ROOT), targetPath);
            let cmd = `node ${dumiPath}/bin/dumi.js ${subCommand} --config ${relativePath}`;
            if (port) {
              process.env.port = port;
              cmd += ` --port ${port}`;
            }

            exec(cmd, {
              options: {
                cwd: cfg.cwd,
              },
            });
          },
        },
      ];
    },
    [PluginHooks.prepare]: (cfg) => {
      const targetPath = getTargetPath(cfg.cwd);
      ensureFileSync(targetPath);
      copySync(cfgPath, targetPath);

      info(`Created Doc Config: ${targetPath}.`);
    },
  };
};
