import type { AddFunc } from '@/cfg/types';

export const addBundleAnalyzerPlugin: AddFunc = async (cfg, rspackCfg) => {
  const { analyze, isDev } = cfg.config;

  if (!isDev && analyze) {
    const { visualizer } = await import('rollup-plugin-visualizer');

    rspackCfg.plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }) as any,
    );
  }
};
