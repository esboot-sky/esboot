import type { AddFunc } from '@/cfg/types';

/**
 * @deprecated
 * Because this plugin only support css
 * 
 */
export const addTailwindPlugin: AddFunc = async (cfg, viteCfg) => {
  const { useTailwindcss } = cfg.config;

  if (!useTailwindcss) return;
  const { default: vitePluginTailwindcss } = await import('@tailwindcss/vite');

  console.log('viteCfg.plugins', vitePluginTailwindcss());
  viteCfg.plugins.push(vitePluginTailwindcss());
};
