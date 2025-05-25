import type { AddFunc } from '@/cfg/types.mts';

export const addTailwindPlugin: AddFunc = async (cfg, viteCfg) => {
  const { useTailwindcss } = cfg.config;

  if (!useTailwindcss) return;
  const { default: vitePluginTailwindcss } = await import('@tailwindcss/vite');

  viteCfg.plugins.push(vitePluginTailwindcss());
};
