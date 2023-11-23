import { join, isAbsolute } from 'path';
import fs from 'fs-extra';
import { merge } from 'lodash';
import { cacheDir } from '@@/constants';
import esbootConfig from '@@/config';
import { info } from '@@/helpers/logger';
import { invokeEachPlugin } from '@@/helpers/plugins';

const eslintConfig = require('../../../config/eslint/index-sample');
const tsconfigJson = require('../../../config/typescript/tsconfig-sample.json');

export function generateAliasFiles() {
  const { alias, svgr } = esbootConfig.userOpts;

  const pluginAlias = {};
  invokeEachPlugin((plugin) => {
    merge(pluginAlias, plugin.afterCommandOfGenerateAlias?.()?.alias);
  });

  merge(alias, pluginAlias);

  // Eslint
  const customEslintAlias: [string, string][] = [];

  for (let k in alias) {
    const value = `${alias[k]}/`;

    customEslintAlias.push([k, value]);
  }

  eslintConfig.settings['import/resolver'].alias.map = customEslintAlias;
  const eslintOutputPath = join(cacheDir, 'eslint/index.js');
  fs.ensureFileSync(eslintOutputPath);
  fs.writeFileSync(
    eslintOutputPath,
    `module.exports = ${JSON.stringify(eslintConfig, null, 2)}`
  );
  info(`Created File: ${eslintOutputPath}.`);

  // esboot.d.ts
  let svgrTypes = '';
  if (svgr) {
    svgrTypes = `declare module '*.svg?url' {
      const value: string;
    
      export default value;
    }
    
    declare module '*.svg' {
      import * as React from 'react';
    
      const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
      >;
    
      export default ReactComponent;
    }`;
  }

  const typeOutputPath = join(cacheDir, 'typescript/esboot.d.ts');
  fs.ensureFileSync(typeOutputPath);
  fs.writeFileSync(typeOutputPath, svgrTypes);
  info(`Created File: ${typeOutputPath}.`);

  // tsconfig
  const customTSConfigAlias: Record<string, string[]> = {};

  for (let k in alias) {
    const rawValue = alias[k];
    const isAbsoluteValue = isAbsolute(rawValue);
    // FIX: Use Options
    const key = isAbsoluteValue ? k : `${k}/*`;
    const value = isAbsoluteValue
      ? rawValue
      : join(process.cwd(), `./${rawValue}/*`);

    customTSConfigAlias[key] = [value];
  }

  tsconfigJson.compilerOptions.paths = customTSConfigAlias;
  tsconfigJson.exclude = tsconfigJson.exclude.map((v: string) => {
    return join(process.cwd(), v);
  });
  tsconfigJson.include = tsconfigJson.include.map((v: string) => {
    return join(process.cwd(), v);
  });
  tsconfigJson.files = tsconfigJson.files.map((v: string) => {
    return join(process.cwd(), v);
  });

  const tsOutoutPath = join(cacheDir, 'typescript/tsconfig.json');
  fs.writeJSONSync(tsOutoutPath, tsconfigJson, {
    spaces: 2,
  });
  info(`Created File: ${tsOutoutPath}.`);

  console.log('Done!');
}
