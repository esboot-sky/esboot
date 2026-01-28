import type { Plugin } from 'vite';
import path from 'node:path';

import { getGlobalScssPathList, isGlobalStyleFile } from '@dz-web/esboot-bundler-common';
import { createFilter } from '@rollup/pluginutils';
import {
  applyStyleNameTransformer,
  findStyleImports,
  formatVariableForStyleImports,
  importStyleNameTransformer,
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
const KEEP_STATEMENT = 'console.log(TransformStyleNameCreateElement)'; // To ensure that the TransformStyleNameCreateElement() introduced by the previous plugin is not removed due to dependency analysis

export default function reactStyleNamePlugin(options: Options = {}): Plugin[] {
  const { reactVariableName = 'React', rootPath = '', isSP = false, useStyleName = true } = options;

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
        if (!useStyleName)
          return;
        if (!matchId(id))
          return;
        const { imports, updatedSource } = findStyleImports(source);

        if (imports.length) {
          return {
            code:
              `${importStyleNameTransformer(updatedSource)}\n;\n`
              + `${KEEP_STATEMENT};\n`,
            map: null,
          };
        }
      },
    },
    {
      name: 'react-styleName-transform',
      enforce: 'post' as const,
      transform(source: string, id: string) {
        if (!useStyleName)
          return;
        if (!matchId(id))
          return;
        const { imports } = findStyleImports(source);

        if (imports.length) {
          const formatted = formatVariableForStyleImports(source, imports);

          source = applyStyleNameTransformer(
            formatted.source,
            formatted.variables,
            reactVariableName,
          ).replace(KEEP_STATEMENT, '');

          return {
            code: source,
            map: null,
          };
        }
      },
    },
  ];
}
