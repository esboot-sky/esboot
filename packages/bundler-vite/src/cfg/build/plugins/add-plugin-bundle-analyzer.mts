import type { AddFunc } from '@/cfg/types.mts';

export const addBundleAnalyzerPlugin: AddFunc = async (cfg, viteCfg) => {
  const { analyze, isDev } = cfg.config;

  if (!isDev && analyze) {
    const { visualizer } = await import('rollup-plugin-visualizer');

    viteCfg.plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        // emitFile: true,
        // filename: 'bundle-analyzer.html',
      })
    );
  }
};
