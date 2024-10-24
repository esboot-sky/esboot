import { injectHtml } from '@dz-web/esboot-bundler-common';
import type { AddFunc } from '@/cfg/types.mts';

export const addCompatHtmlPlugin: AddFunc = async (cfg, viteCfg) => {
  const { entry } = cfg.config;

  viteCfg.plugins!.push({
    name: 'vite-plugin-inject-body',
    transformIndexHtml(html) {
      console.log(entry, 'entry');

      return injectHtml(html, cfg, entry?.index?.title);
    },
  });
};
