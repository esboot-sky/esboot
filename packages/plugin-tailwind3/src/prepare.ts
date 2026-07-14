import type { Configuration } from '@dz-web/esboot-common/cfg';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { error, info } from '@dz-web/esboot-common/helpers';
import { merge } from '@dz-web/esboot-common/lodash';

import type { PluginTailwind3Options } from './index';

export const tailwind3Config = {
  darkMode: ['selector', '.dz-theme-dark'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

function writeTailwind3Artifacts(
  options?: PluginTailwind3Options | ((config: any) => Record<string, any>),
): void {
  const tailwind3ConfigPath = join(cacheDir, 'tailwindcss.config.js');

  mkdirSync(cacheDir, { recursive: true });

  let finalConfig: Record<string, any> = { ...tailwind3Config };

  if (options) {
    if (typeof options === 'function') {
      finalConfig = options(finalConfig);
    } else if (typeof options === 'object') {
      const tailwindcssOptions = options.tailwindcssOptions;
      if (typeof tailwindcssOptions === 'function') {
        finalConfig = tailwindcssOptions(finalConfig);
      } else if (typeof tailwindcssOptions === 'object' && tailwindcssOptions !== null) {
        finalConfig = merge({}, finalConfig, tailwindcssOptions);
      }
    }
  }

  try {
    writeFileSync(
      tailwind3ConfigPath,
      `module.exports = ${JSON.stringify(finalConfig, null, 2)};\n`,
    );
    info(`Created Tailwind CSS Config: ${tailwind3ConfigPath}.`);
  }
  catch (err) {
    error(`Failed to create Tailwind CSS Config: ${(err as Error).message}`);
  }
}

function updateTailwind3VSCodeSetting(cfg: Configuration): void {
  const vscodeConfigPath = join(cfg.cwd, '.vscode', 'settings.json');
  mkdirSync(join(cfg.cwd, '.vscode'), { recursive: true });
  let currentSetting: Record<string, unknown> = {};

  try {
    currentSetting = JSON.parse(
      readFileSync(vscodeConfigPath, 'utf8'),
    ) as Record<string, unknown>;
  }
  catch {}

  try {
    writeFileSync(
      vscodeConfigPath,
      `${JSON.stringify(
        merge({}, currentSetting, {
          'tailwindCSS.experimental.configFile':
            'node_modules/.cache/esboot/tailwindcss.config.js',
        }),
        null,
        2,
      )}\n`,
    );
    info('Updated Tailwind CSS VSCode Setting Successfully .');
  }
  catch (err) {
    error(
      `Failed to update Tailwind CSS VSCode Setting: ${(err as Error).message}`,
    );
  }
}

export function prepareTailwind3(
  cfg: Configuration,
  options?: PluginTailwind3Options | ((config: any) => Record<string, any>),
): void {
  process.once('exit', () => {
    writeTailwind3Artifacts(options);
    updateTailwind3VSCodeSetting(cfg);
  });
}
