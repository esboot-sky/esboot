export interface StyleImport {
  statement: string;
  prefixStatement: string;
  variable?: string;
  filepath: string;
  start: number;
  end: number;
}

const IMPORT_PATTERN
  = /(^|\n)[ \t]*import(?:[ \t]+([A-Z_$][\w$]*|\*[ \t]+as[ \t]+[A-Z_$][\w$]*)[ \t]+from)?[ \t]+(['"])([^'"\n]+\.scss(?:\?[^'"\n]*)?)\3;?/gi;
const NAMESPACE_IMPORT_RE = /\*\s+as\s+(\w+)/;

export function findStyleImports(source: string): {
  imports: StyleImport[];
  updatedSource: string;
} {
  let updatedSource = source;
  const imports: StyleImport[] = [];

  const matches = source.matchAll(IMPORT_PATTERN);

  for (const match of matches) {
    const [statement, prefixStatement, variable, , importPath] = match;
    const { index } = match;

    if (!importPath.includes('styles/') && index !== undefined) {
      const newStatement = statement.replace(importPath, importPath);
      updatedSource = updatedSource.replace(statement, newStatement);

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
        filepath: importPath,
        start: index,
        end: index + statement.length,
      });
    }
  }

  return { imports, updatedSource };
}

let nextId = 1;
export function makeVariableName(): string {
  return `__cls_${nextId++}`;
}
