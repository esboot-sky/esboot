import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
interface StyleImport {
  statement: string;
  prefixStatement: string;
  variable?: string;
  filepath: string;
}
// const importPattern =
//   /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.(?:css|scss)(?:\?[^'"]*?)?)(?:'|");?/g;
const importPattern =
  /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.(?:scss)(?:\?[^'"]*?)?)(?:'|");?/g;

export const findStyleImports = (
  source: string
): {
  imports: StyleImport[];
  updatedSource: string;
} => {
  let updatedSource = source;
  const imports: StyleImport[] = [];

  const matches = source.matchAll(importPattern);

  for (const match of matches) {
    const [statement, prefixStatement, variable, importPath] = match;

    if (!importPath.includes('styles/')) {
      const newImportPath = importPath;

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
let transformerSource: string;
export function importStyleNameTransformer(source: string, inline = true) {
  if (inline) {
    if (!transformerSource) {
      transformerSource = readFileSync(
        resolve(
          fileURLToPath(import.meta.url),
          '../plugins/react-style-name/transformStyleNameCreateElement.js'
        )
      ).toString();
    }

    return `${transformerSource} \n ${source}`;
  }

  return `import { TransformStyleNameCreateElement } from '@dz-web/esboot-bundler-vite/transformStyleNameCreateElement'; \n ${source}`;
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
