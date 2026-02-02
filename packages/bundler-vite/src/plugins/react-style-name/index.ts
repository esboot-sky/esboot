import type { Plugin } from 'vite';


import { getGlobalScssPathList, isGlobalStyleFile } from '@dz-web/esboot-bundler-common';
import { createFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';
import {
  findStyleImports,
  getTransformerSource,
  makeVariableName,
  REACT_CREATE_ELEMENT_REGEX_GENERATOR,
} from './handle-style-name';

interface Options {
  reactVariableName?: string;
  rootPath?: string;
  isSP?: boolean;
  useStyleName?: boolean;
}

function matchId(id: string): boolean {
  return id.endsWith('tsx');
}

const filterStyleFiles = createFilter(['**/*.scss']);

export default function reactStyleNamePlugin(options: Options = {}): Plugin[] {
  const { reactVariableName = 'React', rootPath = '', isSP = false, useStyleName = true } = options;

  const globalScssPathList = getGlobalScssPathList(rootPath, isSP);

  return [
    {
      name: 'react-styleName',
      enforce: 'pre' as const,
      async resolveId(source: string, importer: string | undefined, options: any) {
        if (source.endsWith('.scss') && importer) {
          const resolution = await this.resolve(source, importer, {
            skipSelf: true,
            ...options,
          });

          if (!resolution?.id) {
            return null;
          }

          const resolvedPath = resolution.id;

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
        if (!useStyleName)
          return;
        if (!matchId(id))
          return;
        const { imports } = findStyleImports(source);

        if (imports.length) {
          // console.log('[DEBUG] Transforming:', id);
          const s = new MagicString(source);
          const variables: string[] = [];

          // Format imports and collect variables
          for (const info of imports) {
            let variable = info.variable;
            if (!variable) {
              variable = makeVariableName();
              // Replace import statement to include variable
              s.overwrite(
                info.start,
                info.end,
                `${info.prefixStatement}import ${variable} from '${info.filepath}';`,
              );
            }
            variables.push(variable);
          }

          // Apply styleName transformer wrapping
          const regex = REACT_CREATE_ELEMENT_REGEX_GENERATOR(reactVariableName);
          // MagicString handles index drift implicitly if we use original indices,
          // but we must use original source for matching.

          const matches = [...source.matchAll(regex)];
          for (const m of matches) {
            const index = m.index!;
            const fullMatch = m[0];
            const captureGroup = m[1]; // e.g. React.createElement

            // We want to replace `React.createElement(` with `TransformStyleNameCreateElement(React.createElement, [vars], `
            // Logic: `TransformStyleNameCreateElement($1, [${classVariables.join(',')}], `

            const replacement = `TransformStyleNameCreateElement(${captureGroup}, [${variables.join(',')}], `;
            s.overwrite(index, index + fullMatch.length, replacement);
          }

          s.prepend(`${getTransformerSource()}\n;\n`);

          return {
            code: s.toString(),
            map: s.generateMap({ hires: true }),
          };
        }
      },
    },
  ];
}
