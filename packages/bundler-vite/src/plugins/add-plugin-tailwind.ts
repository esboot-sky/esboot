import type { AddFunc } from '@/cfg/types';
import { resolveTailwindConfig } from '@dz-web/esboot-common/cfg';

/**
 * @deprecated
 * Because this plugin only support css
 *
 */
export const addTailwindPlugin: AddFunc = async (cfg, viteCfg) => {
  const { enable } = resolveTailwindConfig(cfg.config);

  if (!enable)
    return;
  const { default: vitePluginTailwindcss } = await import('@tailwindcss/vite');

  viteCfg.plugins.push(vitePluginTailwindcss());
};
