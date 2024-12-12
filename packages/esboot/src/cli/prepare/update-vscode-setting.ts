import { join } from 'node:path';

import {
  writeJSON,
  ensureFileSync,
  readJSON,
} from '@dz-web/esboot-common/fs-extra';
import { merge } from '@dz-web/esboot-common/lodash';
import { info, error } from '@dz-web/esboot-common/helpers';
import cfg from '@/cfg';

export function updateVSCodeSetting() {
  const { cwd } = cfg.config;

  const vscodeConfigFolder = join(cwd, '.vscode');
  const outputPath = join(vscodeConfigFolder, 'settings.json');
  ensureFileSync(outputPath);

  readJSON(outputPath)
    .catch(() => ({}))
    .then((currentSetting = {}) => {
      return writeJSON(
        outputPath,
        merge({}, currentSetting, {
          // i18n-ally
          'i18n-ally.localesPaths': ['src/lang'],

          // Tailwind IntelliSense
          'tailwindCSS.experimental.configFile':
            'node_modules/.cache/esboot/tailwindcss.config.js',
          'tailwindCSS.classAttributes': [
            'className',
            'class',
            '.*cls*',
            '.*cls: .*',
          ],
          'tailwindCSS.experimental.classRegex': [
            ['clsx\\(([^)]*)\\)', '["\'`]([^"\'`]*)["\'`]'],
            ['classnames\\(([^)]*)\\)', '["\'`]([^"\'`]*)["\'`]'],
            ['cn\\(([^)]*)\\)', '["\'`]([^"\'`]*)["\'`]'],
            ['cva\\(([^)]*)\\)', '["\'`]([^"\'`]*).*?["\'`]'],
          ],

          // Stylelint
          'stylelint.snippet': ['css', 'less', 'postcss', 'scss'],
          'stylelint.validate': ['css', 'less', 'postcss', 'scss'],
        }),
        {
          spaces: 2,
        }
      );
    })
    .then(() => {
      info('Updated VSCode Setting Successfully .');
    })
    .catch((err) => {
      error(`Failed to update VSCode Setting: ${err.message}`);
    });

  const extensionsPath = join(vscodeConfigFolder, 'extensions.json');
  ensureFileSync(extensionsPath);
  readJSON(extensionsPath)
    .catch(() => ({}))
    .then((currentSetting = {}) => {
      return writeJSON(
        extensionsPath,
        merge({}, currentSetting, {
          recommendations: [
            'editorconfig.editorconfig',
            'bradlc.vscode-tailwindcss',
            'stylelint.vscode-stylelint',
            'rvest.vs-code-prettier-eslint',
            'esbenp.prettier-vscode',
            'moonlitusun.esboot',
          ],
        }),
        {
          spaces: 2,
        }
      );
    })
    .then(() => {
      info('Updated VSCode Extensions Setting Successfully .');
    })
    .catch((err) => {
      error(`Failed to update VSCode Extensions Setting: ${err.message}`);
    });
}
