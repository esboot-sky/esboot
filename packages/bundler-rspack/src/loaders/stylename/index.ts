import { join, dirname } from 'node:path';
import { getCssHashRule } from '@/cfg/rules/style/utils';

const {
  generateScopedNameFactory,
} = require('@dz-web/babel-plugin-react-css-modules/utils');

import { findStyleImports } from './utils';

// FIXME: refactor by rust
const generateScopedName = generateScopedNameFactory(getCssHashRule());
export default function (this: any, source: string): string {
  let { imports, updatedSource } = findStyleImports(source);
  if (imports.length === 0) {
    return source;
  }

  if (imports.length > 1) {
    throw new Error(
      `Only support one style import, please check your code ${this.resourcePath}.`
    );
  }

  const { statement, prefixStatement, variable, filepath } = imports[0];
  const stylePath = join(dirname(this.resourcePath), filepath);

  console.log(stylePath, 'stylePath');

  // // console.log('resourcePath', resourcePath);
  // const className = source.match(/className:\s*"([^"]+)"/)?.[1];
  // console.log(className, 'className');
  const classNameList: string[] = [];

  console.log(source, 'source');
  updatedSource = source.replace(
    /styleName:\s*"([^"]+)"/g,
    (match, styleNames) => {
      const classNames = styleNames
        .split(/\s+/)
        .map((styleName: string) => {
          const value = generateScopedName(styleName, stylePath);

          classNameList.push(value);
          return value;
        })
        .join(' ');

      console.log(classNames, 'classNames');

      return '';
    }
  );

  updatedSource = source.replace(
    /className:\s*"([^"]+)"/g,
    (match, classNames) => {
      return `className: "${classNames} ${classNameList.join(' ')}"`;
    }
  );

  console.log(classNameList, 'classNameList');

  return updatedSource;
}
