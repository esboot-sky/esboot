import { join, dirname } from 'node:path';
import { getCssHashRule } from '@/cfg/rules/style/utils';

const {
  generateScopedNameFactory,
} = require('@dz-web/babel-plugin-react-css-modules/utils');

import { findStyleImports } from './utils';

// FIXME: refactor by rust
const generateScopedName = generateScopedNameFactory(getCssHashRule());
const jsxPattern =
  /(_jsxDEV|_jsx)\([^,]+,\s*({[^}]*styleName:\s*"[^"]*"[^}]*})/g;

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

  const { filepath } = imports[0];
  const stylePath = join(dirname(this.resourcePath), filepath);

  const classNameList: string[] = [];

  console.log(source, 'source');

  updatedSource = source.replace(jsxPattern, (match, jsxFunc, objStr) => {
    // console.log(match, jsxFunc, objStr, '< 000 ');
    
    return jsxFunc;
    // const updatedObjStr = objStr.replace(
    //   /styleName:\s*"([^"]+)"/g,
    //   (styleNameMatch, styleNames) => {
    //     const classNames = styleNames
    //       .split(/\s+/)
    //       .map((styleName: string) => generateScopedName(styleName, stylePath))
    //       .join(' ');

    //     // 更新 className
    //     if (objStr.includes('className:')) {
    //       objStr = objStr.replace(
    //         /className:\s*"([^"]*)"/,
    //         (classNameMatch, existingClassNames) => {
    //           const combinedClassNames = existingClassNames
    //             ? `${existingClassNames} ${classNames}`
    //             : classNames;
    //           return `className: "${combinedClassNames}"`;
    //         }
    //       );
    //     } else {
    //       // 如果没有 className，添加一个
    //       objStr = objStr.replace('}', `, className: "${classNames}"}`);
    //     }

    //     // 移除 styleName
    //     return '';
    //   }
    // );

    // 返回更新后的 _jsxDEV 或 _jsx 调用
    // return `${jsxFunc}(${match.split(',')[1]}, ${updatedObjStr}`;
  });

  // updatedSource = source.replace(
  //   /styleName:\s*"([^"]+)"/g,
  //   (match, styleNames) => {
  //     const classNames = styleNames
  //       .split(/\s+/)
  //       .map((styleName: string) => {
  //         const value = generateScopedName(styleName, stylePath);

  //         classNameList.push(value);
  //         return value;
  //       })
  //       .join(' ');

  //     console.log(classNames, 'classNames');

  //     return '';
  //   }
  // );

  // updatedSource = source.replace(
  //   /className:\s*"([^"]+)"/g,
  //   (match, classNames) => {
  //     return `className: "${classNames} ${classNameList.join(' ')}"`;
  //   }
  // );

  // console.log(classNameList, 'classNameList');

  return source;
}
