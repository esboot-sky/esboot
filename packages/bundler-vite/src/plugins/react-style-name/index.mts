import path from 'path';
import { createFilter } from '@rollup/pluginutils';

import {
  findStyleImports,
  formatVariableForStyleImports,
  importStyleNameTransformer,
  applyStyleNameTransformer,
} from './handle-style-name.mts';

interface Options {
  reactVariableName?: string;
}

function matchId(id: string) {
  return id.endsWith('tsx');
}

const filterStyleFiles = createFilter(['**/*.scss'], ['src/styles/**/*.scss']);
const KEEP_STATEMENT = `console.log(TransformStyleNameCreateElement)`; // 用来保证前一个插件引入的 TransformStyleNameCreateElement() 不会因依赖分析被移除

export default function reactStyleNamePlugin(options: Options = {}) {
  const { reactVariableName = 'React' } = options;

  return [
    {
      name: 'react-styleName-import',
      enforce: 'pre' as const,
      resolveId(source: string, importer: string) {
        if (source.endsWith('.scss')) {
          const resolvedPath = path.resolve(path.dirname(importer), source);
          if (filterStyleFiles(resolvedPath)) {
            // console.log(
            //   source,
            //   filterStyleFiles,
            //   importer,
            //   resolvedPath,
            //   'source'
            // );
            // return resolvedPath.replace(/\.scss$/, '.module.scss');
            return resolvedPath + '?module';
          }
        }
      },
      transform(source: string, id: string) {
        const { imports, updatedSource } = findStyleImports(source);

        if (matchId(id) && imports.length) {
          return {
            code:
              importStyleNameTransformer(updatedSource, true) +
              '\n;\n' +
              KEEP_STATEMENT +
              ';\n',
            map: null,
          };
        }
      },
    },
    {
      name: 'react-styleName-transform',
      enforce: 'post' as const,
      transform(source: string, id: string) {
        if (matchId(id)) {
          const { imports } = findStyleImports(source);

          if (imports.length) {
            const formatted = formatVariableForStyleImports(source, imports);

            const classVariables = formatted.variables;

            source = formatted.source;

            source = applyStyleNameTransformer(
              source,
              classVariables,
              reactVariableName
            );

            source = source.replace(KEEP_STATEMENT, '');

            return {
              code: source,
              map: null,
            };
          }
        }
      },
    },
  ];
}
