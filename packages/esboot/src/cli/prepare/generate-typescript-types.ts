import { join } from 'path';

import { writeFileSync } from '@dz-web/esboot-common/fs-extra';
import { cacheDir } from '@dz-web/esboot-common/constants';
import { info } from '@dz-web/esboot-common/helpers';

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
  writeFileSync(outputPath, types);
  info(`Created Type File: ${outputPath}.`);
}
