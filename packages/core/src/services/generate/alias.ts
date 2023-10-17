import { join } from 'path';
import fs from 'fs-extra';
import esbootConfig from '@@/config';

const eslintConfig = require('../../../config/eslint/index-sample');
const tsconfigJson = require('../../../config/typescript/tsconfig-sample.json');

export function generateAliasFiles() {
  const { alias, svgr } = esbootConfig.userOpts;

  // Eslint
  const customEslintAlias: [string, string][] = [];

  for (let k in alias) {
    const value = `${alias[k]}/`;

    customEslintAlias.push([k, value]);
  }

  eslintConfig.settings['import/resolver'].alias.map = customEslintAlias;
  fs.writeFileSync(
    join(__dirname, '../../../config/eslint/index.js'),
    `module.exports = ${JSON.stringify(eslintConfig, null, 2)}`
  );

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

  fs.writeFileSync(
    join(__dirname, '../../../config/typescript/esboot.d.ts'),
    svgrTypes
  );

  // tsconfig
  const customTSConfigAlias: Record<string, string[]> = {};

  for (let k in alias) {
    const key = `${k}/*`;
    const value = join(process.cwd(), `./${alias[k]}/*`);

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

  fs.writeJSONSync(
    join(__dirname, '../../../config/typescript/tsconfig.json'),
    tsconfigJson,
    { spaces: 2 }
  );
  console.log('Done!');
}