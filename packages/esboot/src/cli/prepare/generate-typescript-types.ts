import { join } from 'node:path';

import { writeFile } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info, error } from '@dz-web/esboot-common/helpers';

import cfg from '@/cfg';

export function generateTypeScriptTypes() {
  const { svgr } = cfg.config;

  let types = '';
  if (svgr) {
    types = `declare module '*.svg?url' {
      const value: string;
    
      export default value;
    }
    
    declare module '*.svg' {
      import * as React from 'react';
    
      const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
      >;
    
      export default ReactComponent;
    }`;
  }

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
