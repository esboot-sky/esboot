import { readFileSync } from 'node:fs';
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface StyleImport {
  statement: string;
  prefixStatement: string;
  variable?: string;
  filepath: string;
  start: number;
  end: number;
}
// const importPattern =
//   /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.(?:css|scss)(?:\?[^'"]*?)?)(?:'|");?/g;
const importPattern
  = /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.scss(?:\?[^'"]*)?)(?:'|");?/g;

export function findStyleImports(source: string): {
  imports: StyleImport[];
  updatedSource: string;
} {
  let updatedSource = source;
  const imports: StyleImport[] = [];

  const matches = source.matchAll(importPattern);

  for (const match of matches) {
    const [statement, prefixStatement, variable, importPath] = match;
    const { index } = match;

    if (!importPath.includes('styles/') && index !== undefined) {
      const newImportPath = importPath;

      const newStatement = statement.replace(importPath, newImportPath);
      updatedSource = updatedSource.replace(statement, newStatement);

      // Handle import * as variableName syntax
      let extractedVariable = variable;
      if (variable && variable.includes('* as ')) {
        const asMatch = variable.match(/\*\s+as\s+(\w+)/);
        if (asMatch) {
          extractedVariable = asMatch[1];
        }
      }

      imports.push({
        statement: newStatement,
        prefixStatement,
        variable: extractedVariable,
        filepath: newImportPath,
        start: index,
        end: index + statement.length,
      });
    }
  }

  const result = { imports, updatedSource };
  return result;
}

// ... existing formatVariableForStyleImports (can be used but we might rewrite usage) ...

export function REACT_CREATE_ELEMENT_REGEX_GENERATOR(reactVariableName: string): RegExp {
  return new RegExp(
    `(${reactVariableName}\\.createElement|_?jsx|_?jsxs|_?jsxDEV)\\(`,
    'g',
  );
}

// ... keep existing functions for now but maybe unused ...
export function formatVariableForStyleImports(
  source: string,
  imports: StyleImport[],
): {
  variables: string[];
  source: string;
} {
  for (const info of imports) {
    if (!info.variable) {
      const variable = makeVariableName();
      info.variable = variable;
      source = source.replace(
        info.statement,
        `${info.prefixStatement}import ${variable} from '${info.filepath}';`,
      );
    }
  }

  return {
    variables: imports.map(info => info.variable) as string[],
    source,
  };
}

let nextId = 1;
export function makeVariableName(): string {
  return `__cls_${nextId++}`;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let transformerSource: string;
export function getTransformerSource(): string {
  if (!transformerSource) {
    transformerSource = readFileSync(
      resolve(
        __dirname,
        // './plugins/react-style-name/transformStyleNameCreateElement.js',
        '../static/transformStyleNameCreateElement.js',
      ),
    ).toString();
  }
  return transformerSource;
}

export function importStyleNameTransformer(source: string, inline = true): string {
  if (inline) {
    return `${getTransformerSource()} \n ${source}`;
  }

  return `import { TransformStyleNameCreateElement } from '@dz-web/esboot-bundler-vite/transformStyleNameCreateElement'; \n ${source}`;
}

export function applyStyleNameTransformer(
  source: string,
  classVariables: string[],
  reactVariableName: string,
): string {
  source = source.replace(
    REACT_CREATE_ELEMENT_REGEX_GENERATOR(reactVariableName),
    `TransformStyleNameCreateElement($1, [${classVariables.join(',')}], `,
  );
  return source;
}
