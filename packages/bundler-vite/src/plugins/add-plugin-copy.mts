import { pathExistsSync } from '@dz-web/esboot-common/fs-extra';

import type { AddFunc } from '@/cfg/types.mts';

export const addCopyPlugin: AddFunc = async (cfg, viteCfg) => {
  const { staticPathList } = cfg.config;
  const { viteStaticCopy } = await import('vite-plugin-static-copy');

  const filteredStaticPathList = staticPathList
    .map((item) => {

      if (pathExistsSync(item.from)) {
        return {
          src: item.from,
          dest: '.',
        };
      }
    })
    .filter(Boolean) as any[];

  viteCfg.plugins.push(
    viteStaticCopy({
      targets: filteredStaticPathList,
      silent: true,
    })
  );
};
