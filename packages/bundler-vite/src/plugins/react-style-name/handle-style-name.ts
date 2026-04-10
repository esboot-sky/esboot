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

interface JSXAttribute {
  name: string;
  start: number;
  end: number;
  value?: string;
}

const STYLE_NAME_HELPER = `function __styleName(classVariables, styleName, className) {
  const classNames = [];
  if (className)
    classNames.push(className);
  if (typeof styleName === 'string') {
    for (const item of styleName.split(' ').filter(Boolean)) {
      for (const variable of classVariables) {
        classNames.push(
          variable[item]
          || variable[item.replace(new RegExp('-(\\\\w)', 'g'), (_, c) => (c ? c.toUpperCase() : ''))],
        );
      }
    }
  }
  return classNames.filter(Boolean).join(' ');
}`;
// const importPattern =
//   /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.(?:css|scss)(?:\?[^'"]*?)?)(?:'|");?/g;
const importPattern
  = /(^|\n)[ \t]*import(?:[ \t]+([A-Z_$][\w$]*|\*[ \t]+as[ \t]+[A-Z_$][\w$]*)[ \t]+from)?[ \t]+(['"])([^'"\n]+\.scss(?:\?[^'"\n]*)?)\3;?/gi;

const JSX_TAG_NAME_START_RE = /[a-z]/i;
const ATTRIBUTE_NAME_END_RE = /[\s=/>]/;
const WHITESPACE_RE = /\s/;
const UNQUOTED_ATTRIBUTE_VALUE_END_RE = /[\s/>]/;
const NAMESPACE_IMPORT_RE = /\*\s+as\s+(\w+)/;

export function findStyleImports(source: string): {
  imports: StyleImport[];
  updatedSource: string;
} {
  let updatedSource = source;
  const imports: StyleImport[] = [];

  const matches = source.matchAll(importPattern);

  for (const match of matches) {
    const [statement, prefixStatement, variable, , importPath] = match;
    const { index } = match;

    if (!importPath.includes('styles/') && index !== undefined) {
      const newImportPath = importPath;

      const newStatement = statement.replace(importPath, newImportPath);
      updatedSource = updatedSource.replace(statement, newStatement);

      // Handle import * as variableName syntax
      let extractedVariable = variable;
      if (variable && variable.includes('* as ')) {
        const asMatch = variable.match(NAMESPACE_IMPORT_RE);
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

function isJSXTagNameStart(char: string | undefined): boolean {
  return !!char && JSX_TAG_NAME_START_RE.test(char);
}

function isAttributeNameChar(char: string | undefined): boolean {
  return !!char && !ATTRIBUTE_NAME_END_RE.test(char);
}

function findJSXOpeningTagEnd(source: string, start: number): number {
  let quote: string | undefined;
  let braceDepth = 0;

  for (let i = start + 1; i < source.length; i++) {
    const char = source[i];

    if (quote) {
      if (char === '\\') {
        i++;
      }
      else if (char === quote) {
        quote = undefined;
      }
      continue;
    }

    if (char === '"' || char === '\'' || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{') {
      braceDepth++;
      continue;
    }

    if (char === '}') {
      braceDepth--;
      continue;
    }

    if (char === '>' && braceDepth === 0) {
      return i + 1;
    }
  }

  return -1;
}

function readExpression(source: string, start: number): { value: string; end: number } | undefined {
  let quote: string | undefined;
  let depth = 0;

  for (let i = start; i < source.length; i++) {
    const char = source[i];

    if (quote) {
      if (char === '\\') {
        i++;
      }
      else if (char === quote) {
        quote = undefined;
      }
      continue;
    }

    if (char === '"' || char === '\'' || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{') {
      depth++;
      continue;
    }

    if (char === '}') {
      depth--;
      if (depth === 0) {
        return {
          value: source.slice(start + 1, i),
          end: i + 1,
        };
      }
    }
  }
}

function parseJSXAttributes(source: string, tagStart: number, tagEnd: number): JSXAttribute[] {
  const attributes: JSXAttribute[] = [];
  let i = tagStart + 1;

  while (i < tagEnd && isAttributeNameChar(source[i])) {
    i++;
  }

  while (i < tagEnd - 1) {
    while (i < tagEnd && WHITESPACE_RE.test(source[i])) {
      i++;
    }

    if (source[i] === '/' || source[i] === '>') {
      break;
    }

    const attrStart = i;
    while (i < tagEnd && isAttributeNameChar(source[i])) {
      i++;
    }

    const name = source.slice(attrStart, i);
    while (i < tagEnd && WHITESPACE_RE.test(source[i])) {
      i++;
    }

    if (source[i] !== '=') {
      attributes.push({ name, start: attrStart, end: i });
      continue;
    }

    i++;
    while (i < tagEnd && WHITESPACE_RE.test(source[i])) {
      i++;
    }

    if (source[i] === '"' || source[i] === '\'') {
      const quote = source[i];
      const valueStart = i;
      i++;
      while (i < tagEnd && source[i] !== quote) {
        if (source[i] === '\\') {
          i++;
        }
        i++;
      }
      i++;
      attributes.push({
        name,
        start: attrStart,
        end: i,
        value: source.slice(valueStart, i),
      });
      continue;
    }

    if (source[i] === '{') {
      const expression = readExpression(source, i);
      if (!expression) {
        break;
      }
      attributes.push({
        name,
        start: attrStart,
        end: expression.end,
        value: expression.value,
      });
      i = expression.end;
      continue;
    }

    const valueStart = i;
    while (i < tagEnd && !UNQUOTED_ATTRIBUTE_VALUE_END_RE.test(source[i])) {
      i++;
    }
    attributes.push({
      name,
      start: attrStart,
      end: i,
      value: JSON.stringify(source.slice(valueStart, i)),
    });
  }

  return attributes;
}

export function transformJSXStyleName(
  s: { overwrite: (start: number, end: number, content: string) => unknown; prepend: (content: string) => unknown },
  source: string,
  variables: string[],
): boolean {
  let transformed = false;

  for (let i = 0; i < source.length; i++) {
    if (
      source[i] !== '<'
      || source[i + 1] === '/'
      || source[i + 1] === '!'
      || source[i + 1] === '?'
      || !isJSXTagNameStart(source[i + 1])
    ) {
      continue;
    }

    const tagEnd = findJSXOpeningTagEnd(source, i);
    if (tagEnd === -1) {
      break;
    }

    const attributes = parseJSXAttributes(source, i, tagEnd);
    const styleName = attributes.find(attr => attr.name === 'styleName');
    if (!styleName?.value) {
      i = tagEnd - 1;
      continue;
    }

    const className = attributes.find(attr => attr.name === 'className');
    const classVariables = `[${variables.join(',')}]`;

    if (className?.value) {
      s.overwrite(
        className.start,
        className.end,
        `className={__styleName(${classVariables}, ${styleName.value}, ${className.value})}`,
      );
      s.overwrite(styleName.start, styleName.end, '');
    }
    else {
      s.overwrite(
        styleName.start,
        styleName.end,
        `className={__styleName(${classVariables}, ${styleName.value})}`,
      );
    }

    transformed = true;
    i = tagEnd - 1;
  }

  if (transformed) {
    s.prepend(`${STYLE_NAME_HELPER}\n;\n`);
  }

  return transformed;
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
        '../../../static/transformStyleNameCreateElement.js',
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
