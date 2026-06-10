import type { Plugin } from 'vite';

import { createFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';
import { getGlobalScssPathList, isGlobalStyleFile } from '../../helpers/global-style';
import {
  findStyleImports,
  getTransformerSource,
  makeVariableName,
  REACT_CREATE_ELEMENT_REGEX_GENERATOR,
  transformJSXStyleName,
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

export function reactStyleNamePlugin(options: Options = {}): Plugin[] {
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

          if (isGlobalStyleFile(resolvedPath, globalScssPathList)) {
            return null;
          }

          const [resolvedPathWithoutQuery] = resolvedPath.split('?');
          if (filterStyleFiles(resolvedPathWithoutQuery)) {
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
          const s = new MagicString(source);
          const variables: string[] = [];

          for (const info of imports) {
            let variable = info.variable;
            if (!variable) {
              variable = makeVariableName();
              s.overwrite(
                info.start,
                info.end,
                `${info.prefixStatement}import ${variable} from '${info.filepath}';`,
              );
            }
            variables.push(variable);
          }

          const hasJSXStyleNameTransform = transformJSXStyleName(s, source, variables);

          const regex = REACT_CREATE_ELEMENT_REGEX_GENERATOR(reactVariableName);
          const matches = [...source.matchAll(regex)];
          for (const m of matches) {
            const index = m.index!;
            const fullMatch = m[0];
            const captureGroup = m[1];
            const replacement = `TransformStyleNameCreateElement(${captureGroup}, [${variables.join(',')}], `;
            s.overwrite(index, index + fullMatch.length, replacement);
          }

          if (matches.length) {
            s.prepend(`${getTransformerSource()}\n;\n`);
          }

          if (hasJSXStyleNameTransform || matches.length) {
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
