// Source https://github.com/anjianshi/react-inline-css-module/tree/master?tab=readme-ov-file
// Thanks for anjianshi
//

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

const KEEP_STATEMENT = `console.log(TransformStyleNameCreateElement)`; // 用来保证前一个插件引入的 TransformStyleNameCreateElement() 不会因依赖分析被移除

export default function reactStyleNamePlugin(options: Options = {}) {
  const { reactVariableName = 'React' } = options;

  return [
    {
      name: 'react-styleName-import',
      enforce: 'pre',
      transform(source: string, id: string) {
        if (matchId(id) && findStyleImports(source).length) {
          return {
            code:
              importStyleNameTransformer(source, true) +
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
      enforce: 'post',
      transform(source: string, id: string) {
        if (matchId(id)) {
          const imports = findStyleImports(source);
          if (imports.length) {
            const formatted = formatVariableForStyleImports(source, imports);
            console.log(formatted, 'formatted');
            
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
