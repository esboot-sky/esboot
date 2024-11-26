import { join } from 'node:path';
import { writeFile } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info, error } from '@dz-web/esboot-common/helpers';
import cfg from '@/cfg';

export function generateTypeScriptTypes() {
  const types = generateTypes();

  if (!types) return;

  const outputPath = join(cacheDir, 'typescript/esboot.d.ts');
  writeFile(outputPath, types)
    .then(() => {
      info(`Created Type File: ${outputPath}.`);
    })
    .catch((err) => {
      error(err);
    });
}

function generateTypes(): string {
  const { svgr } = cfg.config;

  const baseTypes = `
    declare namespace React {
      interface Attributes {
        styleName?: string | undefined;
      }
      interface HTMLAttributes<T> {
        styleName?: string | undefined;
      }
      interface SVGAttributes<T> {
        styleName?: string | undefined;
      }
    }

    declare module '*.png';
    declare module '*.jpg';
    declare module '*.webp';
    declare module '*.svg?url' {
      const value: string;
      export default value;
    }

    declare module '*.scss' {
      const content: { [key: string]: any };
      export = content;
    }

    declare module '*.css' {
      const content: { [key: string]: any };
      export = content;
    }
  `;

  const svgTypes = svgr
    ? `
    declare module '*.svg' {
      import * as React from 'react';
      const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
      >;
      export default ReactComponent;
    }`
    : `
    declare module '*.svg' {
      const value: string;
      export default value;
    }
  `;

  return baseTypes + svgTypes;
}
