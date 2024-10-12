interface StyleImport {
  statement: string; // 引入了样式文件的语句
  prefixStatement: string; // 引入语句前面的修饰符（空格、换行符等）
  variable?: string; // 引入模块时指定的变量名
  filepath: string; // 引入的文件路径
}
const importPattern =
  /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.(?:css|scss)(?:\?[^'"]*?)?)(?:'|");?/g;

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