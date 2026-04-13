import type { AddFunc } from '@/cfg/types';
import { resolveTailwindConfig } from '@dz-web/esboot-common/cfg';

export const addTailwindPlugin: AddFunc = async (cfg, viteCfg) => {
  const { enable, version } = resolveTailwindConfig(cfg.config);

  if (!enable || version !== 'next')
    return;
  const { default: vitePluginTailwindcss } = await import('@tailwindcss/vite');

  viteCfg.plugins.push(vitePluginTailwindcss());
};
