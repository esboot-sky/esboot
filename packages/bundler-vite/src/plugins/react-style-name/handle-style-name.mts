import { resolve } from 'path';
import { readFileSync } from 'fs';

/**
 * 找出代码中引入的样式文件
 */
interface StyleImport {
  statement: string; // 引入了样式文件的语句
  prefixStatement: string; // 引入语句前面的修饰符（空格、换行符等）
  variable?: string; // 引入模块时指定的变量名
  filepath: string; // 引入的文件路径
}
const importPattern =
  /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.(?:css|scss)(?:\?[^'"]*?)?)(?:'|");?/g;

export const findStyleImports = function (source: string): {
  imports: StyleImport[];
  updatedSource: string;
} {
  let updatedSource = source;
  const imports: StyleImport[] = [];

  const matches = source.matchAll(importPattern);

  for (const match of matches) {
    const [statement, prefixStatement, variable, importPath] = match;

    console.log(importPath, 'importPath');
    
    if (!importPath.includes('styles/')) {
      let newImportPath = importPath;
      // if (!importPath.includes('?module')) {
      //   newImportPath = importPath.includes('?')
      //     ? importPath.replace('?', '?module&')
      //     : `${importPath}?module`;
      // }

      const newStatement = statement.replace(importPath, newImportPath);
      updatedSource = updatedSource.replace(statement, newStatement);

      imports.push({
        statement: newStatement,
        prefixStatement,
        variable,
        filepath: newImportPath,
      });
    }
  }

  const result = { imports, updatedSource };
  return result;
};

/**
 * 给没指定变量名的样式引入补充上变量名
 */
export function formatVariableForStyleImports(
  source: string,
  imports: StyleImport[]
) {
  for (const info of imports) {
    if (!info.variable) {
      const variable = makeVariableName();
      info.variable = variable;
      source = source.replace(
        info.statement,
        `${info.prefixStatement}import ${variable} from '${info.filepath}';`
      );
    }
  }

  return {
    variables: imports.map((info) => info.variable) as string[],
    source,
  };
}

let nextId = 1;
function makeVariableName() {
  return `__cls_${nextId++}`;
}

/**
 * 将 styleName 转换函数引入代码
 *
 * inline:
 *  为 true 则将 TransformStyleNameCreateElement 的代码直接插入 source
 *  为 false 则用 import 的形式引入
 * (Vite 下用 inline 的形式性能更好)
 */
let transformerSource: string | null = null;
export function importStyleNameTransformer(source: string, inline = false) {
  if (inline) {
    if (!transformerSource) {
      const bareSource = readFileSync(
        resolve(
          __dirname,
          'plugins/react-style-name/transformStyleNameCreateElement.mjs'
        )
      );
      // transformerSource = `var TransformStyleNameCreateElement = (function() {
      //   var exports = {};
      //   ${bareSource};
      //   return exports.default;
      // })();`;
      return bareSource + '\n' + source;
    }
    return transformerSource + '\n' + source;
  } else {
    return (
      "import TransformStyleNameCreateElement from 'react-inline-css-module/dist/TransformStyleNameCreateElement';\n" +
      source
    );
  }
}

/**
 * 用 styleName 转换函数包裹原 React.createElement() 调用
 */
export function applyStyleNameTransformer(
  source: string,
  classVariables: string[],
  reactVariableName: string
) {
  source = source.replace(
    // 另两种包裹函数名的由来见：https://www.typescriptlang.org/docs/handbook/jsx.html
    new RegExp(
      `(${reactVariableName}\\.createElement|_?jsx|_?jsxs|_?jsxDEV)\\(`,
      'g'
    ),
    `TransformStyleNameCreateElement($1, [${classVariables.join(',')}], `
  );
  return source;
}
