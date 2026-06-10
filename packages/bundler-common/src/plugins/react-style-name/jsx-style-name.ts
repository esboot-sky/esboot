import { getStyleNameHelperSource } from './runtime-helpers';

interface JSXAttribute {
  name: string;
  start: number;
  end: number;
  value?: string;
}

const JSX_TAG_NAME_START_RE = /[a-z]/i;
const ATTRIBUTE_NAME_END_RE = /[\s=/>]/;
const WHITESPACE_RE = /\s/;
const UNQUOTED_ATTRIBUTE_VALUE_END_RE = /[\s/>]/;

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
    s.prepend(`${getStyleNameHelperSource()}\n;\n`);
  }

  return transformed;
}
