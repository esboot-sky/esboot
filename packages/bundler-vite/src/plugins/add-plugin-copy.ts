import { normalizePath } from 'vite';
import { pathExistsSync } from '@dz-web/esboot-common/fs-extra';
import type { AddFunc } from '@/cfg/types';
import { resolve } from 'path';

export const addCopyPlugin: AddFunc = async (cfg, viteCfg) => {
  const { staticPathList } = cfg.config;
  const { viteStaticCopy } = await import('vite-plugin-static-copy');

  const filteredStaticPathList = staticPathList
    .map((item) => {
      if (pathExistsSync(item.from)) {
        console.log('normalizePath(item.from)', normalizePath(item.from), resolve(process.cwd(), normalizePath(item.from)));
        return {
          src: normalizePath(item.from),
          dest: '.',
        };
      }
    })
    .filter(Boolean) as any[];

  viteCfg.plugins.push(
    viteStaticCopy({
      targets: filteredStaticPathList,
      silent: false,
    })
  );
};
