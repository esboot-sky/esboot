import path from 'node:path';
import { createFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';
import {
  getGlobalScssPathList,
  isGlobalStyleFile,
} from '@dz-web/esboot-bundler-common';
import {
  importStyleNameTransformer,
} from './handle-style-name.mts';

interface Options {
  reactVariableName?: string;
  rootPath?: string;
  isSP?: boolean;
}

function matchId(id: string) {
  return id.endsWith('tsx');
}

const filterStyleFiles = createFilter(['**/*.scss']);
const KEEP_STATEMENT = 'console.log(TransformStyleNameCreateElement)'; // 用来保证前一个插件引入的 TransformStyleNameCreateElement() 不会因依赖分析被移除

const importPattern =
  /(^|\n)\s*import(?:\s+(.+?)\s+from)?\s+(?:'|")(.+?\.(?:scss)(?:\?[^'"]*?)?)(?:'|");?/g;

function getStyleImports(source: string) {
  const imports: any[] = [];
  const matches = source.matchAll(importPattern);

  for (const match of matches) {
    const [statement, prefixStatement, variable, importPath] = match;

    if (!importPath.includes('styles/')) {
      imports.push({
        statement,
        prefixStatement,
        variable,
        filepath: importPath,
        index: match.index!,
        length: match[0].length,
      });
    }
  }
  return imports;
}

export default function reactStyleNamePlugin(options: Options = {}) {
  const { reactVariableName = 'React', rootPath = '', isSP = false } = options;

  const globalScssPathList = getGlobalScssPathList(rootPath, isSP);

  return [
    {
      name: 'react-styleName-import',
      enforce: 'pre' as const,
      resolveId(source: string, importer: string | undefined) {
        if (source.endsWith('.scss') && importer) {
          const resolvedPath = path.resolve(path.dirname(importer), source);
          // If it is a global style file, do not add ?module parameter
          if (isGlobalStyleFile(resolvedPath, globalScssPathList)) {
            return null;
          }
          if (filterStyleFiles(resolvedPath)) {
            const hasQuery = resolvedPath.includes('?');
            return `${resolvedPath}${hasQuery ? '&module' : '?module'}`;
          }
        }
      },
      transform(source: string, id: string) {
        if (!matchId(id)) return;
        const imports = getStyleImports(source);

        if (imports.length) {
          const s = new MagicString(source);
          // Only prepend the transformer, existing imports logic in imports array doesn't seem to need change here
          // based on original code `findStyleImports` only gathered imports but didn't effectively change source
          // strictly for `importStyleNameTransformer`.

          const prefix = importStyleNameTransformer('', true) + '\n;\n' + KEEP_STATEMENT + ';\n';
          s.prepend(prefix);

          return {
            code: s.toString(),
            map: s.generateMap({ hires: true }),
          };
        }
      },
    },
    {
      name: 'react-styleName-transform',
      enforce: 'post' as const,
      transform(source: string, id: string) {
        if (matchId(id)) {
          const imports = getStyleImports(source);

          if (imports.length) {
            const s = new MagicString(source);
            const classVariables: string[] = [];
            let nextId = 1;

            // Handle imports: add variable if missing
            for (const info of imports) {
              let variable = info.variable;
              if (!variable) {
                variable = `__cls_${nextId++}`;
                const newExport = `${info.prefixStatement}import ${variable} from '${info.filepath}';`;
                s.overwrite(info.index, info.index + info.length, newExport);
              }
              classVariables.push(variable);
            }

            // Remove KEEP_STATEMENT
            // We need to find it in the source. Since it's JS now, it might be anywhere?
            // "post" transform runs after "pre" transform and after TS compiled.
            // The KEEP_STATEMENT was added at the top.
            const keepIndex = source.indexOf(KEEP_STATEMENT);
            if (keepIndex !== -1) {
              s.overwrite(keepIndex, keepIndex + KEEP_STATEMENT.length, '');
              // Clean up extra semicolons/newlines if needed? Original code just replaced string.
            }

            // Apply wrapper
            const regex = new RegExp(
              `(${reactVariableName}\\.createElement|_?jsx|_?jsxs|_?jsxDEV)\\(`,
              'g'
            );
            
            const matches = source.matchAll(regex);
            for (const match of matches) {
               const [full, funcName] = match;
               s.overwrite(
                 match.index!, 
                 match.index! + full.length, 
                 `TransformStyleNameCreateElement(${funcName}, [${classVariables.join(',')}], `
               );
            }

            return {
              code: s.toString(),
              map: s.generateMap({ hires: true }),
            };
          }
        }
      },
    },
  ];
}
