import type { AddFunc } from '@/cfg/types.mts';

export const addSvgrPlugin: AddFunc = async (cfg, viteCfg) => {
  const { svgr, svgrOptions = {} } = cfg.config;

  if (!svgr) return;
  const { default: vitePluginSvgr } = await import('vite-plugin-svgr');

  viteCfg.plugins.push(
    vitePluginSvgr({
      include: '**/*.svg',
      exclude: '**/*.svg?url',
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        svgoConfig: {
          floatPrecision: 2,
        },
        ...svgrOptions,
      },
    })
  );
};
