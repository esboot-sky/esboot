import type { AddFunc } from '@/cfg/types';
import { relative } from 'node:path';
import { pathExistsSync } from '@dz-web/esboot-common/fs-extra';
import { normalizePath } from 'vite';

export const addCopyPlugin: AddFunc = async (cfg, viteCfg) => {
  const { staticPathList, cwd } = cfg.config;
  const { viteStaticCopy } = await import('vite-plugin-static-copy');

  console.log(staticPathList, '<-- staticPathList');
  const filteredStaticPathList = staticPathList
    .map((item) => {
      if (pathExistsSync(item.from)) {
        return {
          src: relative(cwd, normalizePath(item.from)),
          dest: '.',
        };
      }
      return null;
    })
    .filter(Boolean) as any[];

  viteCfg.plugins.push(
    viteStaticCopy({
      targets: filteredStaticPathList,
      silent: false,
    }),
  );
};
