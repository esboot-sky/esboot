import type { Plugin } from '@dz-web/esboot';
import type { PluginVitestOptions } from './options';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { PluginHooks } from '@dz-web/esboot';
import { exec } from '@dz-web/esboot-common/execa';
import {
  resolveLibPath as baseResolveLibPath,
  searchCommand,
} from '@dz-web/esboot-common/helpers';
import { alias } from './alias';
import { VITEST_PLUGIN_OPTIONS_FIELD } from './options';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function resolveLibPath(p: string): string {
  return baseResolveLibPath(p, import.meta.resolve);
}

export default (options: PluginVitestOptions = {}): Plugin => {
  const plugin: Plugin = {
    name: 'plugin-vitest',
    [PluginHooks.registerCommands]: (cfg: any) => {
      const { cwd } = cfg;

      return [
        {
          name: 'vitest',
          description: 'Start vitest',
          arguments: [{ name: '[subCommand]', description: 'the sub command' }],
          options: ['-p, --passThrough <passThrough>'],
          allowUnknownOption: true,
          helpOption: false,
          action: async (_: any, options: any, cmd: any) => {
            const { passThrough = '' } = options;
            const extraArgs = cmd?.args || [];
            const passThroughParts = [
              passThrough,
              ...extraArgs,
            ].filter(Boolean);
            const passThroughStr = passThroughParts.join(' ');

            await exec(
              `${searchCommand(join(__dirname, '../'), 'vitest')} ${passThroughStr} -r ${cwd} -c ${resolve(__dirname, '../config/vitest.config.ts')}`,
              {
                onError: (error: any) => {
                  const exitCode = error?.exitCode || 1;
                  console.error(`Vitest run failed with exit code ${exitCode}`);
                  process.exit(error?.exitCode || 1);
                },
              },
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

  (plugin as Record<string, unknown>)[VITEST_PLUGIN_OPTIONS_FIELD] = options;

  return plugin;
};

export { getPluginVitestOptions, VITEST_PLUGIN_OPTIONS_FIELD } from './options';
export type { PluginVitestOptions };
export { alias };
