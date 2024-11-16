import { join } from 'node:path';
import type { ConfigurationInstance } from '@dz-web/esboot';
import { isFunction } from '@dz-web/esboot-common/lodash';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { writeFile } from '@dz-web/esboot-common/fs-extra';
import type { Config } from 'tailwindcss';

const defaultTailwindCSSOpts: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export function addTailwindCSS(cfg: ConfigurationInstance): Config | false {
  const { useTailwindcss, tailwindcssOptions } = cfg.config;

  if (!useTailwindcss) return false;

  const tailwindcssConfig = isFunction(tailwindcssOptions)
    ? tailwindcssOptions(defaultTailwindCSSOpts)
    : defaultTailwindCSSOpts;

  const postcssConfig = require('tailwindcss')(tailwindcssConfig);
  const outputPath = join(cacheDir, 'tailwindcss.config.js');

  // Only for vscode intellisense
  writeFile(
    outputPath,
    `module.exports = ${JSON.stringify(tailwindcssConfig, null, 2)}`
  );

  return postcssConfig;
}
